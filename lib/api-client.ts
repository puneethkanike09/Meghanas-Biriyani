import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Note: API base URL must be set via NEXT_PUBLIC_API_URL environment variable
// We use a fallback for build time to prevent build errors
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.placeholder.com';

// Validate in development/runtime, but allow build to succeed
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
  console.error(
    'NEXT_PUBLIC_API_URL environment variable is not set. API calls will fail.'
  );
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shared refresh promise to serialize concurrent refresh attempts
let refreshPromise: Promise<string | null> | null = null;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
let refreshTokenInvalid = false; // Flag to prevent refresh attempts after 401
const REFRESH_TIMEOUT_MS = 10000; // 10 seconds max for refresh
const MAX_REFRESH_RETRIES = 1;

// Failed request queue
interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Refresh token function
async function refreshToken(): Promise<string | null> {
  const store = useAuthStore.getState();

  // Prevent refresh attempts if we know the refresh token is invalid
  if (refreshTokenInvalid) {
    throw new Error('Refresh token is invalid. Please login again.');
  }

  // If already refreshing, return existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  // Start refresh
  store.startRefresh();

  refreshPromise = (async () => {
    try {
      // Set timeout to prevent infinite loops
      const timeoutPromise = new Promise<never>((_, reject) => {
        refreshTimeout = setTimeout(() => {
          reject(new Error('Token refresh timeout'));
        }, REFRESH_TIMEOUT_MS);
      });

      // Call internal Next.js API route which handles httpOnly cookies
      const refreshRequest = axios.post<{ accessToken: string }>(
        '/api/auth/refresh',
        {},
        {
          withCredentials: true, // Important: send httpOnly cookies
        }
      );

      const response = await Promise.race([refreshRequest, timeoutPromise]);

      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }

      const { accessToken } = response.data;

      if (!accessToken) {
        throw new Error('No access token in refresh response');
      }

      // Update store with new token
      store.finishRefresh(accessToken);

      // Reset invalid flag on successful refresh
      refreshTokenInvalid = false;

      return accessToken;
    } catch (error: any) {
      // Only logout if refresh token is actually invalid (401)
      // Don't logout on network errors, timeouts, or other failures
      const isRefreshTokenInvalid = error?.response?.status === 401;

      if (isRefreshTokenInvalid) {
        // Mark refresh token as invalid to prevent further attempts
        refreshTokenInvalid = true;
        // Refresh token is invalid - user needs to login again
        store.logout();
      }
      // For other errors (network, timeout), keep state and let user retry

      // Clear refresh promise
      refreshPromise = null;
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }

      // Process queue with error
      processQueue(error, null);

      throw error;
    }
  })();

  try {
    const token = await refreshPromise;
    return token;
  } finally {
    // Clear promise after completion
    refreshPromise = null;
  }
}

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
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    }) | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? '';
    const isRefreshRequest = requestUrl.includes('/api/auth/refresh');

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401) {
      // If refresh request failed, mark as invalid and logout
      if (isRefreshRequest) {
        refreshTokenInvalid = true;
        useAuthStore.getState().logout();
        processQueue(error, null);
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Don't attempt refresh if we know the refresh token is invalid
      if (refreshTokenInvalid) {
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Prevent infinite retry loops
      const retryCount = originalRequest._retryCount ?? 0;
      if (retryCount >= MAX_REFRESH_RETRIES) {
        // Don't logout here - could be a network issue
        // Let the refresh function handle logout if refresh token is invalid
        return Promise.reject(new Error('Max refresh retries exceeded'));
      }

      // If already refreshing, queue this request
      if (refreshPromise) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string | null) => {
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      // Mark request as retried
      originalRequest._retry = true;
      originalRequest._retryCount = retryCount + 1;

      try {
        // Refresh token
        const newToken = await refreshToken();

        if (!newToken) {
          throw new Error('Failed to refresh token');
        }

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Process queue with new token
        processQueue(null, newToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed - process queue with error
        processQueue(refreshError, null);

        // Don't logout here - refreshToken() function already handles it
        // This prevents duplicate logout calls

        const refreshErrorMsg = refreshError?.response?.data?.message ||
          refreshError?.message ||
          'Session expired. Please login again.';
        return Promise.reject(new Error(refreshErrorMsg));
      }
    }

    return Promise.reject(error);
  }
);

// Export function to reset refresh token invalid flag (called when new session is established)
export function resetRefreshTokenInvalid() {
  refreshTokenInvalid = false;
}

export default apiClient;
