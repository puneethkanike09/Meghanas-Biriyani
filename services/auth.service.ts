import apiClient from '@/lib/api-client';

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

    refreshToken: async (refreshToken: string): Promise<{ access_token: string; expires_in: number }> => {
        const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
        return response.data;
    },

    updateFcmToken: async (token: string): Promise<void> => {
        await apiClient.patch('/users/customers/fcm-token', { fcmToken: token });
    },

    logout: async (): Promise<void> => {
        try {
            // Access token is automatically sent in Authorization header via apiClient interceptor
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
};
