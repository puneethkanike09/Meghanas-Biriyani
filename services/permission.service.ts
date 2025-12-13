import { toast } from 'sonner';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export const PermissionService = {
    /**
     * Request notification permission
     * Returns the permission state after requesting
     */
    async requestNotificationPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                toast.success('Notifications enabled', {
                    description: 'You will receive order updates and promotions',
                });
            }
            return permission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
        }
    },

    /**
     * Check current notification permission state
     */
    getNotificationPermission(): NotificationPermission {
        if (!('Notification' in window)) {
            return 'denied';
        }
        return Notification.permission;
    },

    /**
     * Request location permission
     * Returns true if permission is granted, false otherwise
     */
    async requestLocationPermission(): Promise<boolean> {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return false;
        }

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                () => resolve(true),
                (error) => {
                    console.error('Location permission denied:', error);
                    if (error.code === 1) {
                        // PERMISSION_DENIED
                        toast.error('Location access is required for delivery services', {
                            description: 'Please enable location access in your browser settings.',
                        });
                    } else {
                        toast.error('Failed to get location', {
                            description: error.message || 'Please try again.',
                        });
                    }
                    resolve(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    },

    /**
     * Check if location permission was previously granted
     * Uses Permissions API if available to avoid triggering browser prompt
     */
    async hasLocationPermission(): Promise<boolean> {
        if (!navigator.geolocation) {
            return false;
        }

        // Try to use Permissions API first (doesn't trigger prompt)
        try {
            if (navigator.permissions && navigator.permissions.query) {
                const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
                return result.state === 'granted';
            }
        } catch {
            // Permissions API not supported, fall through to geolocation check
        }

        // Fallback: Try to get position with very short timeout (may trigger prompt)
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                () => resolve(true),
                () => resolve(false),
                { maximumAge: 0, timeout: 0 }
            );
        });
    },

    /**
     * Check location permission state using Permissions API (doesn't trigger prompt)
     */
    async getLocationPermissionState(): Promise<'granted' | 'denied' | 'prompt' | null> {
        if (!navigator.geolocation) {
            return null;
        }

        try {
            if (navigator.permissions && navigator.permissions.query) {
                const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
                return result.state;
            }
        } catch {
            // Permissions API not supported
        }

        return null;
    },
};

