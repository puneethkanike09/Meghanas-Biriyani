import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    phone: string;
    role: string;
    name?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // Temporary data for OTP flow
    tempAuthData: {
        phone: string;
        name?: string;
        requestId: string;
        flow: 'LOGIN' | 'REGISTER';
    } | null;

    setAuth: (data: { user: User; accessToken: string; refreshToken: string }) => void;
    setTempAuthData: (data: AuthState['tempAuthData']) => void;
    updateAccessToken: (token: string) => void;
    logout: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            tempAuthData: null,
            _hasHydrated: false,

            setAuth: ({ user, accessToken, refreshToken }) => set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                tempAuthData: null // Clear temp data on success
            }),

            setTempAuthData: (data) => set({ tempAuthData: data }),

            updateAccessToken: (token) => set({ accessToken: token }),

            logout: () => set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                tempAuthData: null
            }),

            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
