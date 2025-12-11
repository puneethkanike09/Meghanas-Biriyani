import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_TTL,
    IS_PRODUCTION,
    REFRESH_TOKEN_COOKIE,
    REFRESH_TOKEN_TTL,
} from "@/config/session.config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// In-memory cache to prevent concurrent refresh requests with the same token
// This prevents race conditions when backend does token rotation
const refreshPromises = new Map<string, Promise<any>>();

function removeSessionCookies(response: NextResponse) {
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
}

export async function POST(request: NextRequest) {
    // Debug: Log all cookies to see what's available
    const allCookies = request.cookies.getAll();
    console.log('[Refresh API] All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 })));
    
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    // Validate refresh token exists and is not empty
    if (!refreshToken || refreshToken.trim() === '') {
        console.error('[Refresh API] No refresh token found in cookies', {
            cookieName: REFRESH_TOKEN_COOKIE,
            cookieExists: !!request.cookies.get(REFRESH_TOKEN_COOKIE),
            cookieValue: request.cookies.get(REFRESH_TOKEN_COOKIE)?.value || 'undefined',
            allCookieNames: allCookies.map(c => c.name)
        });
        const response = NextResponse.json(
            { message: "Session expired" },
            { status: 401 }
        );
        return removeSessionCookies(response);
    }

    try {
        // Prepare payload with refresh token
        const payload = { refresh_token: refreshToken };
        
        // Validate payload before sending
        if (!payload.refresh_token || payload.refresh_token.trim() === '') {
            console.error('[Refresh API] Refresh token is empty in payload!', {
                refreshToken: payload.refresh_token,
                refreshTokenType: typeof payload.refresh_token
            });
            const response = NextResponse.json(
                { message: "Invalid refresh token" },
                { status: 401 }
            );
            return removeSessionCookies(response);
        }
        
        // Check if there's already a refresh in progress for this token
        // This prevents race conditions when backend does token rotation
        const tokenHash = refreshToken.substring(0, 20); // Use first 20 chars as key
        const existingPromise = refreshPromises.get(tokenHash);
        
        if (existingPromise) {
            console.log('[Refresh API] Concurrent refresh detected, reusing existing request', {
                tokenHash,
                timestamp: new Date().toISOString()
            });
            try {
                const result = await existingPromise;
                return result;
            } catch (err) {
                // If the existing promise failed, continue with new request
                refreshPromises.delete(tokenHash);
            }
        }
        
        console.log('[Refresh API] Calling backend refresh endpoint', {
            url: `${API_BASE_URL}/auth/refresh`,
            payload: { refresh_token: payload.refresh_token.substring(0, 20) + '...' }, // Log first 20 chars only for security
            refreshTokenLength: payload.refresh_token.length,
            timestamp: new Date().toISOString()
        });

        // Create refresh promise and store it
        const refreshPromise = (async () => {
            try {
                // Call backend refresh endpoint
                const backendResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // Add timeout to prevent hanging requests
                        timeout: 10000,
                    }
                );

                const { access_token, refresh_token: newRefreshToken } = backendResponse.data;

                if (!access_token) {
                    throw new Error('No access token received from refresh endpoint');
                }

                const response = NextResponse.json({
                    message: "Token refreshed successfully",
                    accessToken: access_token,
                });

                // Set new access token in cookies
                response.cookies.set(ACCESS_TOKEN_COOKIE, access_token, {
                    httpOnly: true,
                    secure: IS_PRODUCTION,
                    sameSite: "strict",
                    path: "/",
                    maxAge: ACCESS_TOKEN_TTL,
                });

                // Rotate refresh token if backend provided a new one
                response.cookies.set(
                    REFRESH_TOKEN_COOKIE,
                    newRefreshToken ?? refreshToken,
                    {
                        httpOnly: true,
                        secure: IS_PRODUCTION,
                        sameSite: "strict",
                        path: "/",
                        maxAge: REFRESH_TOKEN_TTL,
                    }
                );

                return response;
            } finally {
                // Clean up promise from cache after completion (success or failure)
                refreshPromises.delete(tokenHash);
            }
        })();

        // Store the promise to deduplicate concurrent requests
        refreshPromises.set(tokenHash, refreshPromise);
        
        // Clean up old entries (keep cache size reasonable)
        if (refreshPromises.size > 100) {
            const firstKey = refreshPromises.keys().next().value;
            if (firstKey) {
                refreshPromises.delete(firstKey);
            }
        }

        const result = await refreshPromise;
        return result;
    } catch (error: any) {
        // Log error details for debugging
        console.error('[Refresh API] Error refreshing token:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            message: error?.message,
            responseData: error?.response?.data,
            requestPayload: error?.config?.data,
            isAxiosError: error?.isAxiosError,
            code: error?.code,
            timestamp: new Date().toISOString()
        });

        // Check if it's a 401 from backend (invalid refresh token)
        if (error?.response?.status === 401) {
            const errorMessage = error?.response?.data?.message || "Invalid or expired refresh token";
            console.error('[Refresh API] Backend rejected refresh token with 401:', {
                backendMessage: errorMessage,
                refreshTokenLength: refreshToken?.length,
                timestamp: new Date().toISOString()
            });
            
            const response = NextResponse.json(
                { message: errorMessage },
                { status: 401 }
            );
            return removeSessionCookies(response);
        }

        // Handle network/timeout errors differently - don't clear cookies
        if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT' || !error?.response) {
            console.error('[Refresh API] Network/timeout error - not clearing cookies:', {
                code: error?.code,
                message: error?.message
            });
            return NextResponse.json(
                { message: "Network error. Please try again." },
                { status: 503 }
            );
        }

        console.error("Failed to refresh access token", error);
        return NextResponse.json(
            { message: "Failed to refresh session" },
            { status: 500 }
        );
    }
}
