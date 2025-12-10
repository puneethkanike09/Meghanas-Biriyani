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
        
        console.log('[Refresh API] Calling backend refresh endpoint', {
            url: `${API_BASE_URL}/auth/refresh`,
            payload: { refresh_token: payload.refresh_token.substring(0, 20) + '...' }, // Log first 20 chars only for security
            refreshTokenLength: payload.refresh_token.length
        });

        // Call backend refresh endpoint
        const backendResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
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
                sameSite: "lax",
                path: "/",
                maxAge: REFRESH_TOKEN_TTL,
            }
        );

        return response;
    } catch (error: any) {
        // Log error details for debugging
        console.error('[Refresh API] Error refreshing token:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            message: error?.message,
            responseData: error?.response?.data,
            requestPayload: error?.config?.data
        });

        // Check if it's a 401 from backend (invalid refresh token)
        if (error?.response?.status === 401) {
            const response = NextResponse.json(
                { message: "Invalid or expired refresh token" },
                { status: 401 }
            );
            return removeSessionCookies(response);
        }

        console.error("Failed to refresh access token", error);
        return NextResponse.json(
            { message: "Failed to refresh session" },
            { status: 500 }
        );
    }
}
