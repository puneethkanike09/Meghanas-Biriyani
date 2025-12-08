/**
 * JWT Utility Functions
 * Provides token decoding and validation without requiring external libraries
 */

interface JWTPayload {
    sub?: string;
    user_id?: string;
    role?: string;
    iss?: string;
    iat?: number;
    exp?: number;
    [key: string]: any;
}

/**
 * Decodes a JWT token without verifying the signature
 * NOTE: This is safe for checking expiration on the client side,
 * but actual authentication is verified by the backend API
 * 
 * @param token - The JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
    try {
        if (!token || typeof token !== 'string') {
            return null;
        }

        // JWT format: header.payload.signature
        const parts = token.trim().split('.');
        if (parts.length !== 3) {
            return null;
        }

        // Decode the payload (second part)
        const payload = parts[1];
        if (!payload) {
            return null;
        }

        // Base64URL decode - replace URL-safe chars and add padding if needed
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

        // Add padding if needed (Base64 requires length to be multiple of 4)
        const paddingLength = (4 - (base64.length % 4)) % 4;
        const paddedBase64 = base64 + '='.repeat(paddingLength);

        // Decode base64 to binary string, then to UTF-8
        const binaryString = atob(paddedBase64);
        const jsonPayload = decodeURIComponent(
            binaryString
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload) as JWTPayload;
    } catch (error) {
        // Silently fail - don't log sensitive token data in production
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to decode JWT:', error);
        }
        return null;
    }
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token to check
 * @returns true if token is expired or invalid, false if still valid
 */
export function isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Add a 30 second buffer to refresh before actual expiration
    return payload.exp < (currentTime + 30);
}

/**
 * Checks if a token is valid (exists and not expired)
 */
export function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    return !isTokenExpired(token);
}

/**
 * Gets the expiration time of a token
 */
export function getTokenExpiration(token: string | null): Date | null {
    if (!token) return null;

    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return null;
    }

    return new Date(payload.exp * 1000);
}

