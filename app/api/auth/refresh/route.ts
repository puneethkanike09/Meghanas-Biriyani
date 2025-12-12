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
    console.log('🔄 [REFRESH API] POST /api/auth/refresh - Starting refresh');
    // Debug: Log all cookies to see what's available
    const allCookies = request.cookies.getAll();
    console.log('🔄 [REFRESH API] All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 })));

    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    // Validate refresh token exists and is not empty
    if (!refreshToken || refreshToken.trim() === '') {
        console.error('🔄 [REFRESH API] No refresh token found in cookies', {
            cookieName: REFRESH_TOKEN_COOKIE,
            cookieExists: !!request.cookies.get(REFRESH_TOKEN_COOKIE),
            cookieValue: request.cookies.get(REFRESH_TOKEN_COOKIE)?.value || 'undefined',
            allCookieNames: allCookies.map(c => c.name),
            timestamp: new Date().toISOString()
        });
        const response = NextResponse.json(
            { message: "Session expired" },
            { status: 401 }
        );
        console.log('🔄 [REFRESH API] Returning 401 - removing cookies');
        return removeSessionCookies(response);
    }

    console.log('🔄 [REFRESH API] Refresh token found:', {
        tokenPreview: refreshToken.substring(0, 20) + '...',
        tokenLength: refreshToken.length
    });

    try {
        // Prepare payload with refresh token
        const payload = { refresh_token: refreshToken };

        // Validate payload before sending
        if (!payload.refresh_token || payload.refresh_token.trim() === '') {
            console.error('🔄 [REFRESH API] Refresh token is empty in payload!', {
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
            console.log('🔄 [REFRESH API] Concurrent refresh detected, reusing existing request', {
                tokenHash,
                timestamp: new Date().toISOString()
            });
            try {
                const result = await existingPromise;
                console.log('🔄 [REFRESH API] Reused existing refresh request - success');
                return result;
            } catch (err) {
                console.warn('🔄 [REFRESH API] Existing promise failed, creating new request');
                // If the existing promise failed, continue with new request
                refreshPromises.delete(tokenHash);
            }
        }

        console.log('🔄 [REFRESH API] Calling backend refresh endpoint', {
            url: `${API_BASE_URL}/auth/refresh`,
            payload: { refresh_token: payload.refresh_token.substring(0, 20) + '...' }, // Log first 20 chars only for security
            refreshTokenLength: payload.refresh_token.length,
            refreshTokenStart: payload.refresh_token.substring(0, 10), // First 10 chars for debugging
            refreshTokenEnd: payload.refresh_token.substring(payload.refresh_token.length - 10), // Last 10 chars
            cookieDomain: request.headers.get('host'),
            cookiePath: '/',
            timestamp: new Date().toISOString()
        });

        // Create refresh promise and store it
        const refreshPromise = (async () => {
            try {
                // Log the exact request being sent to backend
                console.log('🔄 [REFRESH API] Sending request to backend:', {
                    url: `${API_BASE_URL}/auth/refresh`,
                    method: 'POST',
                    payloadKeys: Object.keys(payload),
                    refreshTokenLength: payload.refresh_token.length,
                    refreshTokenFirst10: payload.refresh_token.substring(0, 10),
                    refreshTokenLast10: payload.refresh_token.substring(payload.refresh_token.length - 10),
                    timestamp: new Date().toISOString()
                });

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

                console.log('🔄 [REFRESH API] Backend response received:', {
                    hasAccessToken: !!backendResponse.data.access_token,
                    hasNewRefreshToken: !!backendResponse.data.refresh_token,
                    status: backendResponse.status
                });

                const { access_token, refresh_token: newRefreshToken } = backendResponse.data;

                if (!access_token) {
                    console.error('🔄 [REFRESH API] No access token in backend response');
                    throw new Error('No access token received from refresh endpoint');
                }

                console.log('🔄 [REFRESH API] Setting new cookies:', {
                    accessTokenPreview: access_token.substring(0, 20) + '...',
                    hasNewRefreshToken: !!newRefreshToken,
                    accessTokenTTL: ACCESS_TOKEN_TTL,
                    refreshTokenTTL: REFRESH_TOKEN_TTL
                });

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

                console.log('🔄 [REFRESH API] Refresh successful - cookies updated');
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
        console.log('🔄 [REFRESH API] Refresh completed successfully');
        return result;
    } catch (error: any) {
        // Log error details for debugging
        console.error('🔄 [REFRESH API] Error refreshing token:', {
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
            console.error('🔄 [REFRESH API] Backend rejected refresh token with 401:', {
                backendMessage: errorMessage,
                backendError: error?.response?.data?.error,
                backendStatusCode: error?.response?.data?.statusCode,
                refreshTokenLength: refreshToken?.length,
                refreshTokenFirst10: refreshToken?.substring(0, 10),
                refreshTokenLast10: refreshToken?.substring(refreshToken.length - 10),
                backendUrl: `${API_BASE_URL}/auth/refresh`,
                requestPayload: error?.config?.data,
                fullBackendResponse: JSON.stringify(error?.response?.data),
                timestamp: new Date().toISOString()
            });

            const response = NextResponse.json(
                { message: errorMessage },
                { status: 401 }
            );
            console.log('🔄 [REFRESH API] Returning 401 - removing cookies');
            return removeSessionCookies(response);
        }

        // Handle network/timeout errors differently - don't clear cookies
        if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT' || !error?.response) {
            console.error('🔄 [REFRESH API] Network/timeout error - not clearing cookies:', {
                code: error?.code,
                message: error?.message
            });
            return NextResponse.json(
                { message: "Network error. Please try again." },
                { status: 503 }
            );
        }

        console.error('🔄 [REFRESH API] Failed to refresh access token - unknown error:', error);
        return NextResponse.json(
            { message: "Failed to refresh session" },
            { status: 500 }
        );
    }
}
