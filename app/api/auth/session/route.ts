import { NextRequest, NextResponse } from "next/server";

import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_TTL,
    IS_PRODUCTION,
    REFRESH_TOKEN_COOKIE,
    REFRESH_TOKEN_TTL,
} from "@/config/session.config";

interface PersistSessionPayload {
    accessToken: string;
    refreshToken: string;
}

export async function POST(request: NextRequest) {
    console.log('🍪 [SESSION API] POST /api/auth/session - Setting cookies');
    const body = (await request
        .json()
        .catch(() => null)) as PersistSessionPayload | null;

    if (!body?.accessToken || !body?.refreshToken) {
        console.error('🍪 [SESSION API] POST - Missing tokens:', {
            hasAccessToken: !!body?.accessToken,
            hasRefreshToken: !!body?.refreshToken
        });
        return NextResponse.json({ message: "Missing tokens" }, { status: 400 });
    }

    console.log('🍪 [SESSION API] POST - Tokens received:', {
        hasAccessToken: !!body.accessToken,
        hasRefreshToken: !!body.refreshToken,
        accessTokenPreview: body.accessToken.substring(0, 20) + '...',
        accessTokenTTL: ACCESS_TOKEN_TTL,
        refreshTokenTTL: REFRESH_TOKEN_TTL,
        isProduction: IS_PRODUCTION,
        timestamp: new Date().toISOString()
    });

    const response = NextResponse.json({ message: "Session established" });

    response.cookies.set(ACCESS_TOKEN_COOKIE, body.accessToken, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: "strict",
        path: "/",
        maxAge: ACCESS_TOKEN_TTL,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, body.refreshToken, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: "strict",
        path: "/",
        maxAge: REFRESH_TOKEN_TTL,
    });

    console.log('🍪 [SESSION API] POST - Cookies set successfully');
    return response;
}

export async function DELETE() {
    console.log('🍪 [SESSION API] DELETE /api/auth/session - Clearing cookies');
    const response = NextResponse.json({ message: "Session cleared" });
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    console.log('🍪 [SESSION API] DELETE - Cookies deleted');
    return response;
}
