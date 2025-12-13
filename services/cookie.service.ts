import { encryptData, decryptData } from '@/lib/encryption';

const COOKIE_OPTIONS = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 7, // 1 week
};

/**
 * Cookie Service for secure storage
 * Uses native browser cookies with encryption for sensitive data
 */
export const CookieService = {
    /**
     * Set a cookie
     */
    set(name: string, value: string, options?: { maxAge?: number; path?: string; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' }) {
        if (typeof window === 'undefined') return;

        const opts = { ...COOKIE_OPTIONS, ...options };
        let cookieString = `${name}=${encodeURIComponent(value)}`;

        if (opts.maxAge) {
            cookieString += `; max-age=${opts.maxAge}`;
        }

        if (opts.path) {
            cookieString += `; path=${opts.path}`;
        }

        if (opts.secure) {
            cookieString += `; secure`;
        }

        if (opts.sameSite) {
            cookieString += `; samesite=${opts.sameSite}`;
        }

        document.cookie = cookieString;
    },

    /**
     * Get a cookie value
     */
    get(name: string): string | null {
        if (typeof window === 'undefined') return null;

        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
            }
        }

        return null;
    },

    /**
     * Remove a cookie
     */
    remove(name: string, options?: { path?: string }) {
        if (typeof window === 'undefined') return;

        const path = options?.path || '/';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    },

    /**
     * Store branch info in encrypted cookie
     */
    setBranchInfo(info: { branchCode: string; isWithin5km: boolean }) {
        try {
            const data = JSON.stringify(info);
            const encrypted = encryptData(data);
            this.set('mb_branch_info', encrypted, COOKIE_OPTIONS);
        } catch (error) {
            console.error('Failed to set branch info in cookie:', error);
        }
    },

    /**
     * Get branch info from encrypted cookie
     */
    getBranchInfo(): { branchCode: string; isWithin5km: boolean } | null {
        try {
            const encrypted = this.get('mb_branch_info');
            if (!encrypted) return null;

            const decrypted = decryptData(encrypted);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Failed to get branch info from cookie:', error);
            return null;
        }
    },

    /**
     * Clear all app cookies
     */
    clearAll() {
        if (typeof window === 'undefined') return;

        const cookies = document.cookie.split(';');
        cookies.forEach((cookie) => {
            const [name] = cookie.split('=').map((c) => c.trim());
            if (name.startsWith('mb_')) {
                this.remove(name);
            }
        });
    },
};

