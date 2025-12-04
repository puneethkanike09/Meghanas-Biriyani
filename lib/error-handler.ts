/**
 * Utility functions for handling API errors consistently
 * Always extracts error messages from API responses
 */

export interface ApiError {
    message?: string;
    error?: string;
    detail?: string;
    errors?: Record<string, string[]>;
}

/**
 * Extracts error message from API error response
 * Priority: response.data.message > response.data.error > response.data.detail > fallback
 */
export function getErrorMessage(error: any, fallback: string = "Something went wrong. Please try again."): string {
    // Network error or no response
    if (!error.response) {
        if (error.message) {
            return error.message;
        }
        return fallback;
    }

    const responseData = error.response.data;

    // Check for message field (most common)
    if (responseData?.message && typeof responseData.message === 'string') {
        return responseData.message;
    }

    // Check for error field
    if (responseData?.error && typeof responseData.error === 'string') {
        return responseData.error;
    }

    // Check for detail field
    if (responseData?.detail && typeof responseData.detail === 'string') {
        return responseData.detail;
    }

    // Check for validation errors object
    if (responseData?.errors && typeof responseData.errors === 'object') {
        const errors = responseData.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
            return firstError[0];
        }
    }

    // Check status-specific messages
    const status = error.response.status;
    if (status === 401) {
        return "Authentication failed. Please login again.";
    }
    if (status === 403) {
        return "You don't have permission to perform this action.";
    }
    if (status === 404) {
        return "The requested resource was not found.";
    }
    if (status === 429) {
        return "Too many requests. Please try again later.";
    }
    if (status >= 500) {
        return "Server error. Please try again later.";
    }

    return fallback;
}

/**
 * Extracts success message from API response
 */
export function getSuccessMessage(response: any, fallback: string = "Operation successful"): string {
    if (!response?.data) {
        return fallback;
    }

    const data = response.data;

    // Check for message field
    if (data?.message && typeof data.message === 'string') {
        return data.message;
    }

    // Check for success field
    if (data?.success && typeof data.success === 'string') {
        return data.success;
    }

    return fallback;
}

