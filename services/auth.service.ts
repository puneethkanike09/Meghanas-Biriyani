import apiClient from '@/lib/api-client';
import axios from 'axios';

export interface RegisterRequest {
    name: string;
    phone: string;
}

export interface LoginRequest {
    phone: string;
}

export interface VerifyOtpRequest {
    phone: string;
    otp: string;
    name?: string;
}

export interface AuthResponse {
    request_id: string;
    expires_in: number;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: {
        id: string;
        phone: string;
        role: string;
        name?: string;
    };
}

export const AuthService = {
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/customer/register', data);
        return response.data;
    },

    requestLoginOtp: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/customer/otp/request', data);
        return response.data;
    },

    verifyOtp: async (data: VerifyOtpRequest): Promise<TokenResponse> => {
        const response = await apiClient.post('/auth/customer/otp/verify', data);
        return response.data;
    },

    // Persist session in httpOnly cookies via Next.js API route
    // Uses axios directly (not apiClient) because this is an internal Next.js route, not backend API
    persistSession: async (tokens: { accessToken: string; refreshToken: string }): Promise<void> => {
        await axios.post('/api/auth/session', tokens, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    // Clear session httpOnly cookies via Next.js API route
    // Uses axios directly (not apiClient) because this is an internal Next.js route, not backend API
    clearSession: async (): Promise<void> => {
        await axios.delete('/api/auth/session');
    },

    updateFcmToken: async (token: string): Promise<void> => {
        await apiClient.patch('/users/customers/fcm-token', { fcmToken: token });
    },

    logout: async (): Promise<void> => {
        try {
            // Call backend logout FIRST (access token is automatically sent via apiClient interceptor)
            // This must be done before clearing cookies/store so the token is available
            await apiClient.post('/auth/logout');
            // Then clear httpOnly cookies
            await AuthService.clearSession();
        } catch (error) {
            // Silently fail - logout should work even if backend call fails
            // Still try to clear session cookies even if backend logout fails
            try {
                await AuthService.clearSession();
            } catch (clearError) {
                // Ignore clear session errors
            }
        }
    }
};
