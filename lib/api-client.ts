import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Note: API base URL can be set via environment variable
// Default URL is the dev tunnel URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://81g9vnjp-3001.inc1.devtunnels.ms/api/v1';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, updateAccessToken, logout } = useAuthStore.getState();

      if (refreshToken) {
        try {
          // Use a fresh axios instance to avoid interceptors
          const response = await axios.post(`${baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          updateAccessToken(access_token);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError: any) {
          // Refresh failed - logout user
          console.error('Token refresh failed:', refreshError);
          logout();

          // Reject with a structured error so components can handle it
          const refreshErrorMsg = refreshError?.response?.data?.message ||
            refreshError?.message ||
            'Session expired. Please login again.';
          return Promise.reject(new Error(refreshErrorMsg));
        }
      } else {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

