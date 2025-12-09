import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
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

// Shared refresh promise to serialize concurrent refresh attempts
let refreshPromise: Promise<string | null> | null = null;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
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

      return accessToken;
    } catch (error) {
      // Refresh failed - reset store and clear cookies
      store.logout();

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
      // If refresh request failed, reset and logout
      if (isRefreshRequest) {
        useAuthStore.getState().logout();
        processQueue(error, null);
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Prevent infinite retry loops
      const retryCount = originalRequest._retryCount ?? 0;
      if (retryCount >= MAX_REFRESH_RETRIES) {
        useAuthStore.getState().logout();
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
        useAuthStore.getState().logout();

        const refreshErrorMsg = refreshError?.response?.data?.message ||
          refreshError?.message ||
          'Session expired. Please login again.';
        return Promise.reject(new Error(refreshErrorMsg));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
