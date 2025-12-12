import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isTokenValid } from '@/lib/jwt-utils';

export interface User {
    id: string;
    phone: string;
    role: string;
    name?: string;
}

export interface TempAuthData {
    phone: string;
    name?: string;
    requestId: string;
    flow: 'LOGIN' | 'REGISTER';
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    // refreshToken removed - now stored in httpOnly cookies
    isRefreshing: boolean;

    // Temporary data for OTP flow (not persisted)
    tempAuthData: TempAuthData | null;

    // Computed property - checks if token is valid
    isAuthenticated: () => boolean;

    setAuth: (data: { user: User; accessToken: string }) => void;
    setTempAuthData: (data: TempAuthData | null) => void;
    updateAccessToken: (token: string) => void;
    startRefresh: () => void;
    finishRefresh: (accessToken: string) => void;
    logout: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isRefreshing: false,
            tempAuthData: null,
            _hasHydrated: false,

            // Computed property that validates the token
            // This is called every time to ensure we check token validity
            isAuthenticated: () => {
                const state = get();
                return isTokenValid(state.accessToken);
            },

            setAuth: ({ user, accessToken }) => {
                // Validate access token before storing
                if (!accessToken) {
                    return;
                }

                set({
                    user,
                    accessToken,
                    tempAuthData: null, // Clear temp data on success
                    isRefreshing: false,
                });
            },

            setTempAuthData: (data) => {
                set({ tempAuthData: data });
            },

            updateAccessToken: (token) => {
                if (!token) {
                    return;
                }
                set({ accessToken: token });
            },

            startRefresh: () => {
                set({ isRefreshing: true });
            },

            finishRefresh: (accessToken) => {
                if (!accessToken) {
                    return;
                }

                set((state) => {
                    // Extract id and role from new token
                    const tokenData = require('@/lib/jwt-utils').extractUserFromToken(accessToken);

                    // Merge with existing user data to preserve phone and name
                    const updatedUser = state.user && tokenData ? {
                        ...state.user,        // Keep existing phone and name
                        id: tokenData.id,     // Update id from token
                        role: tokenData.role, // Update role from token
                    } : state.user; // If no token data, keep existing user

                    return {
                        ...state,
                        user: updatedUser,
                        accessToken,
                        isRefreshing: false
                    };
                });
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    isRefreshing: false,
                    tempAuthData: null,
                });
            },

            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth-storage',
            // Only persist user and access token, NOT refreshToken (httpOnly cookies), isAuthenticated, or tempAuthData
            // This ensures authentication state is always computed, not stored
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                // refreshToken excluded - now in httpOnly cookies
            }),
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    // If rehydration fails, clear storage and start fresh
                    if (state) {
                        state.logout();
                        state.setHasHydrated(true);
                    }
                    return;
                }

                if (state) {
                    state.setHasHydrated(true);
                }
            },
        }
    )
);
