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
    refreshToken: string | null;

    // Temporary data for OTP flow (not persisted)
    tempAuthData: TempAuthData | null;

    // Computed property - checks if token is valid
    isAuthenticated: () => boolean;

    setAuth: (data: { user: User; accessToken: string; refreshToken: string }) => void;
    setTempAuthData: (data: TempAuthData | null) => void;
    updateAccessToken: (token: string) => void;
    logout: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            tempAuthData: null,
            _hasHydrated: false,

            // Computed property that validates the token
            // This is called every time to ensure we check token validity
            isAuthenticated: () => {
                const state = get();
                return isTokenValid(state.accessToken);
            },

            setAuth: ({ user, accessToken, refreshToken }) => {
                // Validate tokens before storing
                if (!accessToken || !refreshToken) {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('setAuth: Missing tokens in auth data');
                    }
                    return;
                }

                set({
                    user,
                    accessToken,
                    refreshToken,
                    tempAuthData: null, // Clear temp data on success
                });
            },

            setTempAuthData: (data) => set({ tempAuthData: data }),

            updateAccessToken: (token) => {
                if (!token) {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('updateAccessToken: Token is empty');
                    }
                    return;
                }
                set({ accessToken: token });
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    tempAuthData: null,
                });
            },

            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth-storage',
            // Only persist tokens and user data, NOT isAuthenticated or tempAuthData
            // This ensures authentication state is always computed, not stored
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    // If rehydration fails, clear storage and start fresh
                    if (process.env.NODE_ENV === 'development') {
                        console.error('Failed to rehydrate auth store:', error);
                    }
                    if (state) {
                        state.logout();
                        state.setHasHydrated(true);
                    }
                    return;
                }

                if (state) {
                    // Validate token on rehydration, logout if invalid
                    if (state.accessToken && !isTokenValid(state.accessToken)) {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('Stored token is expired or invalid, logging out');
                        }
                        state.logout();
                    }
                    state.setHasHydrated(true);
                }
            },
        }
    )
);
