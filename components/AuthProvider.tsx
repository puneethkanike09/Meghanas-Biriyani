"use client";

import { ReactNode } from "react";

/**
 * AuthProvider - Placeholder component for future auth-related logic
 * 
 * Token refresh now happens reactively:
 * - When any API call gets 401 → automatically refresh token → retry request
 * - If refresh endpoint gets 401 → clear session → redirect to signin
 * 
 * No proactive refresh on app load - we wait for 401 errors to trigger refresh
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

