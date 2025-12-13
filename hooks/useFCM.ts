import { useEffect, useState, useCallback, useRef } from 'react';
import { messaging } from '../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/services/auth.service';
import { PermissionService } from '@/services/permission.service';
import { toast } from 'sonner';

const NOTIFICATION_PROMPT_DISMISSED_KEY = 'notification_prompt_dismissed';
const NOTIFICATION_PROMPT_SHOWN_KEY = 'notification_prompt_shown_session';

export function useFCM() {
    const { accessToken, _hasHydrated } = useAuthStore();
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const toastShownRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const setupFCM = useCallback(async () => {
        if (!messaging) return;

        try {
            // Get Token
            const currentToken = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });

            if (currentToken) {
                setFcmToken(currentToken);
                // Send to backend
                await AuthService.updateFcmToken(currentToken);
            }
        } catch (error) {
            // Silently fail - FCM token update is not critical
            console.error('FCM setup error:', error);
        }
    }, []);

    const requestNotificationPermission = useCallback(async () => {
        try {
            // Use PermissionService to request permission
            const permission = await PermissionService.requestNotificationPermission();

            if (permission === 'granted' && messaging) {
                // Setup FCM after permission is granted
                await setupFCM();
            } else if (permission === 'denied') {
                // User denied, mark as dismissed so we don't show again
                localStorage.setItem(NOTIFICATION_PROMPT_DISMISSED_KEY, JSON.stringify({
                    dismissed: true,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            toast.error('Failed to Enable Notifications', {
                description: 'Please try again later.',
            });
        }
    }, [setupFCM]);

    // Check if we should show the permission toast
    useEffect(() => {
        // Wait for store to hydrate
        if (!_hasHydrated) {
            return;
        }

        if (!accessToken) {
            return;
        }

        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        // Check sessionStorage FIRST - this persists across re-renders and remounts
        const hasShownInSession = sessionStorage.getItem(NOTIFICATION_PROMPT_SHOWN_KEY) === 'true';
        if (hasShownInSession) {
            // Already processed in this session, don't do anything
            return;
        }

        // Check if we've already processed this check (prevent re-running in same render cycle)
        if (toastShownRef.current) {
            return;
        }

        // Check if permission is already granted
        const currentPermission = PermissionService.getNotificationPermission();
        if (currentPermission === 'granted') {
            // Permission already granted, get token directly
            setupFCM();
            toastShownRef.current = true;
            sessionStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');
            return;
        }

        // Check if permission is denied (user blocked it)
        if (currentPermission === 'denied') {
            toastShownRef.current = true;
            sessionStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');
            return;
        }

        // Check if user has dismissed the prompt before
        const dismissedData = localStorage.getItem(NOTIFICATION_PROMPT_DISMISSED_KEY);
        let wasDismissed = false;
        let dismissedTimestamp = 0;

        if (dismissedData) {
            try {
                const parsed = JSON.parse(dismissedData);
                wasDismissed = parsed.dismissed === true; // Fix: use === instead of ||
                dismissedTimestamp = parsed.timestamp || 0;
            } catch {
                // Legacy format - just a string "true"
                wasDismissed = dismissedData === 'true';
            }
        }

        // Store previous permission state to detect resets
        const previousPermissionKey = 'notification_permission_previous';
        const previousPermission = localStorage.getItem(previousPermissionKey);

        // If permission changed from "denied" to "default", user reset permissions
        // Clear dismissal flag in this case
        if (previousPermission === 'denied' && currentPermission === 'default' && wasDismissed) {
            localStorage.removeItem(NOTIFICATION_PROMPT_DISMISSED_KEY);
            wasDismissed = false;
            dismissedTimestamp = 0;
        }

        // Store current permission for next check
        localStorage.setItem(previousPermissionKey, currentPermission);

        // Allow showing again after 7 days
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const sevenDaysAgo = Date.now() - sevenDaysInMs;
        const canShowAgain = !wasDismissed || (dismissedTimestamp > 0 && dismissedTimestamp < sevenDaysAgo);

        // Only show toast if permission is default and we can show again
        if (currentPermission === 'default' && canShowAgain) {
            // Mark that we're showing the toast (both ref and sessionStorage)
            toastShownRef.current = true;
            sessionStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');

            // Small delay to ensure page is loaded
            timerRef.current = setTimeout(() => {
                toast('Enable Notifications', {
                    id: 'notification-permission-prompt', // Use a unique ID to prevent duplicates
                    description: 'Stay updated with real-time order status, delivery updates, and exclusive offers.',
                    duration: Infinity, // Keep it open until user clicks
                    action: {
                        label: 'Enable',
                        onClick: () => {
                            requestNotificationPermission();
                        },
                    },
                    cancel: {
                        label: 'Maybe Later',
                        onClick: () => {
                            // Store dismissal with timestamp
                            localStorage.setItem(NOTIFICATION_PROMPT_DISMISSED_KEY, JSON.stringify({
                                dismissed: true,
                                timestamp: Date.now()
                            }));
                            // Show a subtle confirmation
                            toast.info('You can enable notifications anytime from your browser settings', {
                                duration: 3000,
                            });
                        },
                    },
                });
            }, 2000); // Show after 2 seconds

            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        } else {
            // Mark as processed even if we're not showing the toast
            toastShownRef.current = true;
            sessionStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, _hasHydrated]); // setupFCM is stable (empty deps), so we can safely omit it

    useEffect(() => {
        if (typeof window !== 'undefined' && messaging) {
            // Foreground message listener
            const unsubscribe = onMessage(messaging, (payload) => {
                const title = payload.notification?.title || 'New Notification';
                const body = payload.notification?.body || 'You have a new notification';

                // Show Sonner toast notification
                toast.success(title, {
                    description: body,
                    duration: 5000,
                });

                // Also show browser notification if permission is granted
                if (PermissionService.getNotificationPermission() === 'granted') {
                    new Notification(title, {
                        body,
                        icon: '/assets/navbar/images/logo.svg',
                    });
                }
            });
            return () => unsubscribe();
        }
    }, []);

    return {
        fcmToken
    };
}
