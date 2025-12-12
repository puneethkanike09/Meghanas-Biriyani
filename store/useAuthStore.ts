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
                const isValid = isTokenValid(state.accessToken);
                console.log('🔐 [AUTH STORE] isAuthenticated() called:', {
                    hasToken: !!state.accessToken,
                    isValid,
                    userId: state.user?.id,
                    timestamp: new Date().toISOString()
                });
                return isValid;
            },

            setAuth: ({ user, accessToken }) => {
                console.log('🔐 [AUTH STORE] setAuth() called:', {
                    userId: user?.id,
                    userName: user?.name,
                    userPhone: user?.phone,
                    hasToken: !!accessToken,
                    tokenPreview: accessToken ? accessToken.substring(0, 20) + '...' : null,
                    timestamp: new Date().toISOString()
                });

                // Validate access token before storing
                if (!accessToken) {
                    console.warn('🔐 [AUTH STORE] setAuth: Missing access token in auth data');
                    return;
                }

                set({
                    user,
                    accessToken,
                    tempAuthData: null, // Clear temp data on success
                    isRefreshing: false,
                });

                console.log('🔐 [AUTH STORE] setAuth() completed - state updated');
            },

            setTempAuthData: (data) => {
                console.log('🔐 [AUTH STORE] setTempAuthData() called:', {
                    phone: data?.phone,
                    flow: data?.flow,
                    hasRequestId: !!data?.requestId,
                    timestamp: new Date().toISOString()
                });
                set({ tempAuthData: data });
            },

            updateAccessToken: (token) => {
                console.log('🔐 [AUTH STORE] updateAccessToken() called:', {
                    hasToken: !!token,
                    tokenPreview: token ? token.substring(0, 20) + '...' : null,
                    timestamp: new Date().toISOString()
                });

                if (!token) {
                    console.warn('🔐 [AUTH STORE] updateAccessToken: Token is empty');
                    return;
                }
                set({ accessToken: token });
                console.log('🔐 [AUTH STORE] updateAccessToken() completed');
            },

            startRefresh: () => {
                console.log('🔐 [AUTH STORE] startRefresh() called - setting isRefreshing = true');
                set({ isRefreshing: true });
            },

            finishRefresh: (accessToken) => {
                console.log('🔐 [AUTH STORE] finishRefresh() called:', {
                    hasToken: !!accessToken,
                    tokenPreview: accessToken ? accessToken.substring(0, 20) + '...' : null,
                    timestamp: new Date().toISOString()
                });

                if (!accessToken) {
                    console.warn('🔐 [AUTH STORE] finishRefresh: Token is empty');
                    return;
                }

                set((state) => {
                    // Extract id and role from new token
                    const tokenData = require('@/lib/jwt-utils').extractUserFromToken(accessToken);

                    console.log('🔐 [AUTH STORE] finishRefresh - extracted token data:', {
                        userId: tokenData?.id,
                        role: tokenData?.role,
                        previousUserId: state.user?.id
                    });

                    // Merge with existing user data to preserve phone and name
                    const updatedUser = state.user && tokenData ? {
                        ...state.user,        // Keep existing phone and name
                        id: tokenData.id,     // Update id from token
                        role: tokenData.role, // Update role from token
                    } : state.user; // If no token data, keep existing user

                    console.log('🔐 [AUTH STORE] finishRefresh() completed - state updated:', {
                        userId: updatedUser?.id,
                        userName: updatedUser?.name,
                        isRefreshing: false
                    });

                    return {
                        ...state,
                        user: updatedUser,
                        accessToken,
                        isRefreshing: false
                    };
                });
            },

            logout: () => {
                console.log('🔐 [AUTH STORE] logout() called - clearing all auth state');
                set({
                    user: null,
                    accessToken: null,
                    isRefreshing: false,
                    tempAuthData: null,
                });
                console.log('🔐 [AUTH STORE] logout() completed - state cleared');
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
                console.log('🔐 [AUTH STORE] onRehydrateStorage() called:', {
                    hasError: !!error,
                    hasState: !!state,
                    timestamp: new Date().toISOString()
                });

                if (error) {
                    // If rehydration fails, clear storage and start fresh
                    console.error('🔐 [AUTH STORE] Rehydration failed:', error);
                    if (state) {
                        state.logout();
                        state.setHasHydrated(true);
                    }
                    return;
                }

                if (state) {
                    const hasToken = !!state.accessToken;
                    const isTokenValidNow = state.accessToken ? isTokenValid(state.accessToken) : false;

                    console.log('🔐 [AUTH STORE] Rehydrated state:', {
                        hasUser: !!state.user,
                        userId: state.user?.id,
                        userName: state.user?.name,
                        hasToken,
                        isTokenValid: isTokenValidNow,
                        timestamp: new Date().toISOString()
                    });

                    // Don't immediately logout on expired token
                    // isAuthenticated() will return false, and any API call will trigger refresh
                    // This prevents unnecessary logouts when refresh token is still valid
                    if (state.accessToken && !isTokenValid(state.accessToken)) {
                        console.warn('🔐 [AUTH STORE] Stored access token is expired - will attempt refresh on next API call');
                        // Don't call logout() - let the refresh flow handle it
                    }
                    state.setHasHydrated(true);
                    console.log('🔐 [AUTH STORE] Rehydration completed - _hasHydrated = true');
                }
            },
        }
    )
);
