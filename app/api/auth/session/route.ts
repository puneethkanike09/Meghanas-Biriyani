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
    const body = (await request
        .json()
        .catch(() => null)) as PersistSessionPayload | null;

    if (!body?.accessToken || !body?.refreshToken) {
        return NextResponse.json({ message: "Missing tokens" }, { status: 400 });
    }

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

    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ message: "Session cleared" });
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
}
