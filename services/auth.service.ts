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
        console.log('🔑 [AUTH SERVICE] register() called:', {
            phone: data.phone,
            name: data.name,
            timestamp: new Date().toISOString()
        });
        const response = await apiClient.post('/auth/customer/register', data);
        console.log('🔑 [AUTH SERVICE] register() - Success:', {
            requestId: response.data.request_id,
            expiresIn: response.data.expires_in
        });
        return response.data;
    },

    requestLoginOtp: async (data: LoginRequest): Promise<AuthResponse> => {
        console.log('🔑 [AUTH SERVICE] requestLoginOtp() called:', {
            phone: data.phone,
            timestamp: new Date().toISOString()
        });
        const response = await apiClient.post('/auth/customer/otp/request', data);
        console.log('🔑 [AUTH SERVICE] requestLoginOtp() - Success:', {
            requestId: response.data.request_id,
            expiresIn: response.data.expires_in
        });
        return response.data;
    },

    verifyOtp: async (data: VerifyOtpRequest): Promise<TokenResponse> => {
        console.log('🔑 [AUTH SERVICE] verifyOtp() called:', {
            phone: data.phone,
            hasOtp: !!data.otp,
            hasName: !!data.name,
            timestamp: new Date().toISOString()
        });
        const response = await apiClient.post('/auth/customer/otp/verify', data);
        console.log('🔑 [AUTH SERVICE] verifyOtp() - Success:', {
            userId: response.data.user.id,
            userName: response.data.user.name,
            hasAccessToken: !!response.data.access_token,
            hasRefreshToken: !!response.data.refresh_token,
            expiresIn: response.data.expires_in
        });
        return response.data;
    },

    // Persist session in httpOnly cookies via Next.js API route
    // Uses axios directly (not apiClient) because this is an internal Next.js route, not backend API
    persistSession: async (tokens: { accessToken: string; refreshToken: string }): Promise<void> => {
        console.log('🔑 [AUTH SERVICE] persistSession() called:', {
            hasAccessToken: !!tokens.accessToken,
            hasRefreshToken: !!tokens.refreshToken,
            accessTokenPreview: tokens.accessToken.substring(0, 20) + '...',
            timestamp: new Date().toISOString()
        });
        await axios.post('/api/auth/session', tokens, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('🔑 [AUTH SERVICE] persistSession() - Cookies set successfully');
    },

    // Clear session httpOnly cookies via Next.js API route
    // Uses axios directly (not apiClient) because this is an internal Next.js route, not backend API
    clearSession: async (): Promise<void> => {
        console.log('🔑 [AUTH SERVICE] clearSession() called');
        await axios.delete('/api/auth/session');
        console.log('🔑 [AUTH SERVICE] clearSession() - Cookies cleared');
    },

    updateFcmToken: async (token: string): Promise<void> => {
        console.log('🔑 [AUTH SERVICE] updateFcmToken() called:', {
            hasToken: !!token,
            tokenPreview: token.substring(0, 20) + '...'
        });
        await apiClient.patch('/users/customers/fcm-token', { fcmToken: token });
        console.log('🔑 [AUTH SERVICE] updateFcmToken() - Success');
    },

    logout: async (): Promise<void> => {
        console.log('🔑 [AUTH SERVICE] logout() called');
        try {
            // Clear httpOnly cookies first
            console.log('🔑 [AUTH SERVICE] logout() - Clearing session cookies');
            await AuthService.clearSession();
            // Then call backend logout (access token is automatically sent via apiClient interceptor)
            console.log('🔑 [AUTH SERVICE] logout() - Calling backend logout endpoint');
            await apiClient.post('/auth/logout');
            console.log('🔑 [AUTH SERVICE] logout() - Success');
        } catch (error) {
            console.error('🔑 [AUTH SERVICE] logout() - Failed:', error);
        }
    }
};
