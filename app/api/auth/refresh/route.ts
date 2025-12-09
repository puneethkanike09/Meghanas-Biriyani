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
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
        const response = NextResponse.json(
            { message: "Session expired" },
            { status: 401 }
        );
        return removeSessionCookies(response);
    }

    try {
        // Call backend refresh endpoint
        const backendResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
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
