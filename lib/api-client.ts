import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { isTokenExpired, decodeJWT } from '@/lib/jwt-utils';

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
// Buffer time before expiration to refresh proactively (2 minutes = 120 seconds)
const TOKEN_REFRESH_BUFFER_SECONDS = 120;

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
  console.log('🔄 [API CLIENT] refreshToken() called');
  const store = useAuthStore.getState();

  // Prevent refresh attempts if we know the refresh token is invalid
  if (refreshTokenInvalid) {
    console.error('🔄 [API CLIENT] refreshToken() - Refresh token marked as invalid, cannot refresh');
    throw new Error('Refresh token is invalid. Please login again.');
  }

  // Prevent refresh attempts if we're on auth pages (signin, otp, etc.)
  // This prevents infinite loops when unauthenticated users visit these pages
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath.startsWith('/signin') || currentPath.startsWith('/otp') || currentPath.startsWith('/select-delivery')) {
      console.log('🔄 [API CLIENT] refreshToken() - On auth page, skipping refresh attempt');
      throw new Error('Cannot refresh token on auth pages. Please login.');
    }
  }

  // If already refreshing, return existing promise
  if (refreshPromise) {
    console.log('🔄 [API CLIENT] refreshToken() - Already refreshing, returning existing promise');
    return refreshPromise;
  }

  console.log('🔄 [API CLIENT] refreshToken() - Starting new refresh');
  // Start refresh
  store.startRefresh();

  refreshPromise = (async () => {
    try {
      console.log('🔄 [API CLIENT] refreshToken() - Setting up timeout and making refresh request');
      // Set timeout to prevent infinite loops
      const timeoutPromise = new Promise<never>((_, reject) => {
        refreshTimeout = setTimeout(() => {
          console.error('🔄 [API CLIENT] refreshToken() - Timeout after', REFRESH_TIMEOUT_MS, 'ms');
          reject(new Error('Token refresh timeout'));
        }, REFRESH_TIMEOUT_MS);
      });

      // Call internal Next.js API route which handles httpOnly cookies
      console.log('🔄 [API CLIENT] refreshToken() - Calling /api/auth/refresh');
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

      console.log('🔄 [API CLIENT] refreshToken() - Received response from refresh endpoint');
      const { accessToken } = response.data;

      if (!accessToken) {
        console.error('🔄 [API CLIENT] refreshToken() - No access token in response');
        throw new Error('No access token in refresh response');
      }

      console.log('🔄 [API CLIENT] refreshToken() - New token received:', {
        tokenPreview: accessToken.substring(0, 20) + '...',
        tokenLength: accessToken.length
      });

      // Update store with new token
      store.finishRefresh(accessToken);

      // Reset invalid flag on successful refresh
      refreshTokenInvalid = false;

      console.log('🔄 [API CLIENT] refreshToken() - Refresh successful, token updated in store');
      return accessToken;
    } catch (error: any) {
      console.error('🔄 [API CLIENT] refreshToken() - Error occurred:', {
        status: error?.response?.status,
        message: error?.message,
        isAxiosError: error?.isAxiosError
      });

      // Only logout if refresh token is actually invalid (401)
      // Don't logout on network errors, timeouts, or other failures
      const isRefreshTokenInvalid = error?.response?.status === 401;

      if (isRefreshTokenInvalid) {
        console.error('🔄 [API CLIENT] refreshToken() - Refresh token is invalid (401), clearing session');

        // Extract error message from response (from Next.js refresh endpoint)
        const errorMessage = (error?.response?.data as { message?: string })?.message || 'Session expired. Please login again.';

        // Show toast notification
        if (typeof window !== 'undefined') {
          toast.error(errorMessage, {
            duration: 5000,
          });
        }

        // Mark refresh token as invalid to prevent further attempts
        refreshTokenInvalid = true;
        // Clear all user data since we can't authenticate without a valid refresh token
        store.logout();

        // Clear httpOnly cookies (refresh token)
        try {
          await fetch('/api/auth/session', { method: 'DELETE' });
        } catch (e) {
          console.error('Failed to clear session cookies:', e);
        }

        // Redirect to signin page (only if not already there or on root)
        if (typeof window !== 'undefined' && window.location.pathname !== '/' && !window.location.pathname.startsWith('/signin')) {
          window.location.href = '/signin';
        }
      } else {
        console.warn('🔄 [API CLIENT] refreshToken() - Non-401 error, keeping state (network/timeout issue)');
      }
      // For other errors (network, timeout), keep state and let user retry

      // Clear refresh promise
      refreshPromise = null;
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }

      // Process queue with error
      console.log('🔄 [API CLIENT] refreshToken() - Processing failed queue:', failedQueue.length, 'items');
      processQueue(error, null);

      throw error;
    }
  })();

  try {
    const token = await refreshPromise;
    console.log('🔄 [API CLIENT] refreshToken() - Completed successfully');
    return token;
  } finally {
    // Clear promise after completion
    refreshPromise = null;
    console.log('🔄 [API CLIENT] refreshToken() - Promise cleared');
  }
}

/**
 * Checks if token needs to be refreshed proactively
 * Returns true if token is expired or will expire within buffer time
 */
function shouldRefreshToken(token: string | null): boolean {
  if (!token) {
    console.log('🔄 [API CLIENT] shouldRefreshToken() - No token provided');
    return false;
  }

  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    console.log('🔄 [API CLIENT] shouldRefreshToken() - Invalid token payload, needs refresh');
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expiresAt = payload.exp;
  const timeUntilExpiry = expiresAt - currentTime;
  const needsRefresh = expiresAt < (currentTime + TOKEN_REFRESH_BUFFER_SECONDS);

  console.log('🔄 [API CLIENT] shouldRefreshToken() - Token check:', {
    expiresAt: new Date(expiresAt * 1000).toISOString(),
    currentTime: new Date(currentTime * 1000).toISOString(),
    timeUntilExpiry: Math.floor(timeUntilExpiry / 60) + ' minutes',
    bufferSeconds: TOKEN_REFRESH_BUFFER_SECONDS,
    needsRefresh
  });

  // Check if token expires within buffer time (proactive refresh)
  return needsRefresh;
}

// Request Interceptor - Add token to requests (no proactive refresh)
// Refresh only happens on 401 response (see response interceptor)
apiClient.interceptors.request.use(
  async (config) => {
    const requestUrl = config.url ?? '';
    const method = config.method?.toUpperCase() || 'UNKNOWN';

    console.log('📤 [API CLIENT] Request Interceptor:', {
      method,
      url: requestUrl,
      timestamp: new Date().toISOString()
    });

    const store = useAuthStore.getState();
    const { accessToken } = store;

    console.log('📤 [API CLIENT] Request - Current token state:', {
      hasToken: !!accessToken,
      tokenPreview: accessToken ? accessToken.substring(0, 20) + '...' : null,
      isRefreshing: store.isRefreshing,
      refreshTokenInvalid
    });

    // Add token to request (if available)
    // If token is expired, let the request proceed - response interceptor will handle 401 and refresh
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('📤 [API CLIENT] Request - Authorization header added');
    } else {
      console.log('📤 [API CLIENT] Request - No token available, request will be unauthenticated');
    }

    return config;
  },
  (error) => {
    console.error('📤 [API CLIENT] Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - FALLBACK for edge cases (should rarely be needed now)
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 [API CLIENT] Response Interceptor - Success:', {
      status: response.status,
      url: response.config.url,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    }) | undefined;

    console.log('📥 [API CLIENT] Response Interceptor - Error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      message: error.message,
      timestamp: new Date().toISOString()
    });

    if (!originalRequest) {
      console.error('📥 [API CLIENT] Response - No original request config');
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? '';
    const isRefreshRequest = requestUrl.includes('/api/auth/refresh');

    // Handle 401 Unauthorized - Refresh token and retry failed request
    if (error.response?.status === 401) {
      console.log('📥 [API CLIENT] Response - 401 Unauthorized detected, attempting token refresh');

      // Don't attempt refresh if we're already on auth pages
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath.startsWith('/signin') || currentPath.startsWith('/otp') || currentPath.startsWith('/select-delivery')) {
          console.log('📥 [API CLIENT] Response - On auth page, not attempting refresh');
          return Promise.reject(error);
        }
      }

      // If refresh endpoint itself gives 401 → clear session and redirect to signin
      if (isRefreshRequest) {
        console.error('📥 [API CLIENT] Response - Refresh endpoint failed with 401, clearing session and redirecting to signin');

        // Extract error message from response (from Next.js refresh endpoint)
        const errorMessage = (error?.response?.data as { message?: string })?.message || 'Session expired. Please login again.';

        // Show toast notification
        if (typeof window !== 'undefined') {
          toast.error(errorMessage, {
            duration: 5000,
          });
        }

        refreshTokenInvalid = true;

        // Clear all auth state
        useAuthStore.getState().logout();

        // Clear httpOnly cookies (refresh token)
        try {
          await fetch('/api/auth/session', { method: 'DELETE' });
        } catch (e) {
          console.error('Failed to clear session cookies:', e);
        }

        // Process queue with error
        processQueue(error, null);

        // Redirect to signin page (only if not already there or on root)
        if (typeof window !== 'undefined' && window.location.pathname !== '/' && !window.location.pathname.startsWith('/signin')) {
          window.location.href = '/signin';
        }

        return Promise.reject(new Error(errorMessage));
      }

      // Don't attempt refresh if we know the refresh token is invalid
      if (refreshTokenInvalid) {
        console.error('📥 [API CLIENT] Response - Refresh token already marked invalid, redirecting to signin');

        // Extract error message from response if available
        const errorMessage = (error?.response?.data as { message?: string })?.message || 'Session expired. Please login again.';

        // Show toast notification
        if (typeof window !== 'undefined') {
          toast.error(errorMessage, {
            duration: 5000,
          });
        }

        // Clear session and redirect
        useAuthStore.getState().logout();
        try {
          await fetch('/api/auth/session', { method: 'DELETE' });
        } catch (e) {
          console.error('Failed to clear session cookies:', e);
        }
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(new Error(errorMessage));
      }

      // Prevent infinite retry loops
      const retryCount = originalRequest._retryCount ?? 0;
      console.log('📥 [API CLIENT] Response - Retry count:', retryCount, '/', MAX_REFRESH_RETRIES);
      if (retryCount >= MAX_REFRESH_RETRIES) {
        console.error('📥 [API CLIENT] Response - Max retries exceeded');
        return Promise.reject(new Error('Max refresh retries exceeded'));
      }

      // If already refreshing, queue this request
      if (refreshPromise) {
        console.log('📥 [API CLIENT] Response - Already refreshing, queueing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string | null) => {
              console.log('📥 [API CLIENT] Response - Processing queued request with new token');
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
      console.log('📥 [API CLIENT] Response - Attempting token refresh and retry');

      try {
        // Refresh token and get new access token
        const newToken = await refreshToken();

        if (!newToken) {
          throw new Error('Failed to refresh token');
        }

        console.log('📥 [API CLIENT] Response - Token refreshed successfully, retrying original request');
        // Update authorization header with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Process queue with new token (retry all queued requests)
        processQueue(null, newToken);

        // Retry the original failed request with new token
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error('📥 [API CLIENT] Response - Token refresh failed:', refreshError);

        // If refresh failed with 401, it means refresh token is invalid
        // This will be handled by the refreshToken() function which calls logout
        // But we still need to process the queue and reject
        processQueue(refreshError, null);

        const refreshErrorMsg = refreshError?.response?.data?.message ||
          refreshError?.message ||
          'Session expired. Please login again.';
        return Promise.reject(new Error(refreshErrorMsg));
      }
    }

    console.log('📥 [API CLIENT] Response - Non-401 error, rejecting');
    return Promise.reject(error);
  }
);

// Export function to reset refresh token invalid flag (called when new session is established)
export function resetRefreshTokenInvalid() {
  refreshTokenInvalid = false;
}

// Export function to manually trigger token refresh (for app load scenarios)
export async function attemptTokenRefresh(): Promise<string | null> {
  console.log('🔄 [API CLIENT] attemptTokenRefresh() called');
  try {
    const token = await refreshToken();
    console.log('🔄 [API CLIENT] attemptTokenRefresh() - Success');
    return token;
  } catch (error) {
    console.error('🔄 [API CLIENT] attemptTokenRefresh() - Failed:', error);
    // Silently fail - let the interceptor handle it on next API call
    return null;
  }
}

export default apiClient;
