import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Note: API base URL must be set via NEXT_PUBLIC_API_URL environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL environment variable is not set. Please add it to your .env.local file.'
  );
}

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

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, updateAccessToken, logout } = useAuthStore.getState();

      if (refreshToken) {
        try {
          // Use a fresh axios instance to avoid interceptors
          const response = await axios.post(
            `${baseURL}/auth/refresh`,
            { refresh_token: refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const { access_token } = response.data;

          if (!access_token) {
            throw new Error('No access token received from refresh endpoint');
          }

          updateAccessToken(access_token);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError: any) {
          // Refresh failed - logout user
          if (process.env.NODE_ENV === 'development') {
            console.error('Token refresh failed:', refreshError);
          }
          logout();

          // Reject with a structured error so components can handle it
          const refreshErrorMsg = refreshError?.response?.data?.message ||
            refreshError?.message ||
            'Session expired. Please login again.';
          return Promise.reject(new Error(refreshErrorMsg));
        }
      } else {
        // No refresh token available - logout
        logout();
        return Promise.reject(new Error('Authentication required. Please login again.'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

