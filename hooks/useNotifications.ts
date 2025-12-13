import { useEffect, useRef } from 'react';
import { messaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { PermissionService } from '@/services/permission.service';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';

const NOTIFICATION_PROMPT_DISMISSED_KEY = 'notification_prompt_dismissed';
const NOTIFICATION_PROMPT_SHOWN_KEY = 'notification_prompt_shown_session';
const PREVIOUS_PERMISSION_KEY = 'notification_permission_previous';

/**
 * Custom hook for managing notifications
 * Handles FCM token setup and permission requests
 */
export const useNotifications = (userId?: string) => {
    const toastShownRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Setup FCM token
    const setupFCM = async () => {
        if (!messaging) return;

        try {
            const currentToken = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });

            if (currentToken) {
                await AuthService.updateFcmToken(currentToken);
            }
        } catch (error) {
            console.error('FCM setup error:', error);
        }
    };

    // Request notification permission
    const requestNotificationPermission = async () => {
        try {
            const permission = await PermissionService.requestNotificationPermission();

            if (permission === 'granted' && messaging) {
                await setupFCM();
            } else if (permission === 'denied') {
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
    };

    // Check if we should show the permission toast
    useEffect(() => {
        if (!userId) return;
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        // Check if we've already processed this check in this render cycle (prevent duplicate toasts)
        if (toastShownRef.current) {
            return;
        }

        const currentPermission = PermissionService.getNotificationPermission();

        // Check if permission is already granted
        if (currentPermission === 'granted') {
            setupFCM();
            toastShownRef.current = true;
            return;
        }

        // Check if permission is denied (user blocked it)
        if (currentPermission === 'denied') {
            toastShownRef.current = true;
            return;
        }

        // Check if user has dismissed the prompt before (clicked "Maybe Later")
        const dismissedData = localStorage.getItem(NOTIFICATION_PROMPT_DISMISSED_KEY);
        let wasDismissed = false;
        let dismissedTimestamp = 0;

        if (dismissedData) {
            try {
                const parsed = JSON.parse(dismissedData);
                wasDismissed = parsed.dismissed === true;
                dismissedTimestamp = parsed.timestamp || 0;
            } catch {
                wasDismissed = dismissedData === 'true';
            }
        }

        // Store previous permission state to detect resets
        const previousPermission = localStorage.getItem(PREVIOUS_PERMISSION_KEY);

        // If permission changed from "denied" to "default", user reset permissions
        if (previousPermission === 'denied' && currentPermission === 'default' && wasDismissed) {
            localStorage.removeItem(NOTIFICATION_PROMPT_DISMISSED_KEY);
            wasDismissed = false;
            dismissedTimestamp = 0;
        }

        // Store current permission for next check
        localStorage.setItem(PREVIOUS_PERMISSION_KEY, currentPermission);

        // Allow showing again after 7 days
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const sevenDaysAgo = Date.now() - sevenDaysInMs;
        const canShowAgain = !wasDismissed || (dismissedTimestamp > 0 && dismissedTimestamp < sevenDaysAgo);

        // Only show toast if permission is default and we can show again
        // Note: We don't use sessionStorage to prevent showing across refreshes
        // If user didn't click "Maybe Later", toast will show again on refresh
        if (currentPermission === 'default' && canShowAgain) {
            toastShownRef.current = true;

            timerRef.current = setTimeout(() => {
                toast('Enable Notifications', {
                    id: 'notification-permission-prompt',
                    description: 'Stay updated with real-time order status, delivery updates, and exclusive offers.',
                    duration: Infinity,
                    action: {
                        label: 'Enable',
                        onClick: () => {
                            requestNotificationPermission();
                        },
                    },
                    cancel: {
                        label: 'Maybe Later',
                        onClick: () => {
                            // Only mark as dismissed if user explicitly clicks "Maybe Later"
                            localStorage.setItem(NOTIFICATION_PROMPT_DISMISSED_KEY, JSON.stringify({
                                dismissed: true,
                                timestamp: Date.now()
                            }));
                            toast.info('You can enable notifications anytime from your browser settings', {
                                duration: 3000,
                            });
                        },
                    },
                });
            }, 2000);

            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        } else {
            toastShownRef.current = true;
        }
    }, [userId]);

    // Listen for foreground messages
    useEffect(() => {
        if (typeof window !== 'undefined' && messaging) {
            const unsubscribe = onMessage(messaging, (payload) => {
                const title = payload.notification?.title || 'New Notification';
                const body = payload.notification?.body || 'You have a new notification';

                toast.success(title, {
                    description: body,
                    duration: 5000,
                });

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
};

