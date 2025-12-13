"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setRouter } from "@/lib/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { attemptTokenRefresh } from "@/lib/api-client";
import { isTokenExpired } from "@/lib/jwt-utils";

/**
 * AuthProvider - Initializes navigation utility and handles auth-related logic
 * 
 * Token refresh happens both proactively and reactively:
 * - On app load: If token is expired but user exists, attempt refresh proactively
 * - On API calls: When any API call gets 401 → automatically refresh token → retry request
 * - If refresh endpoint gets 401 → clear session → redirect to signin
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { accessToken, user, _hasHydrated } = useAuthStore();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Initialize navigation utility with Next.js router
    useEffect(() => {
        setRouter(router);
    }, [router]);

    // Proactive token refresh on app load if token is expired
    useEffect(() => {
        // Wait for store to hydrate
        if (!_hasHydrated) return;

        // Only attempt refresh if:
        // 1. We have a user (meaning user was logged in)
        // 2. We have an access token (even if expired)
        // 3. Token is expired
        // 4. Not already refreshing
        if (user && accessToken && isTokenExpired(accessToken) && !isRefreshing) {
            setIsRefreshing(true);
            attemptTokenRefresh()
                .then((newToken) => {
                    // Refresh successful - token is now updated in store
                    // If we're on an auth page, redirect to home
                    if (typeof window !== 'undefined' && newToken) {
                        const currentPath = window.location.pathname;
                        if (currentPath === '/' || currentPath.startsWith('/signin') || currentPath.startsWith('/otp') || currentPath.startsWith('/select-delivery')) {
                            router.replace('/home');
                        }
                    }
                })
                .catch(() => {
                    // Refresh failed - token refresh logic will handle logout/redirect
                })
                .finally(() => {
                    setIsRefreshing(false);
                });
        }
    }, [_hasHydrated, user, accessToken, isRefreshing, router]);

    return <>{children}</>;
}

