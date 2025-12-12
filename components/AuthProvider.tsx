"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setRouter } from "@/lib/navigation";

/**
 * AuthProvider - Initializes navigation utility and handles auth-related logic
 * 
 * Token refresh now happens reactively:
 * - When any API call gets 401 → automatically refresh token → retry request
 * - If refresh endpoint gets 401 → clear session → redirect to signin
 * 
 * No proactive refresh on app load - we wait for 401 errors to trigger refresh
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();

    // Initialize navigation utility with Next.js router
    useEffect(() => {
        setRouter(router);
    }, [router]);

    return <>{children}</>;
}

