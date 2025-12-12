import { useEffect, useState } from 'react';
import { messaging } from '../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/services/auth.service';

export function useFCM() {
    const { accessToken } = useAuthStore();
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    useEffect(() => {
        // Only run on client and if user is authenticated (has accessToken)
        // Actually, we might want to get token even if not authenticated?
        // User said: "Send to backend with access token" -> implies we need access token.
        if (!accessToken) return;

        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        const setupFCM = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted' && messaging) {

                    // Get Token
                    // Note: using vapidKey is optional but recommended if set up in console. 
                    // Assuming default config for now, or user can add VAPID key to hook later if needed.
                    const currentToken = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY // Optional, verify if user has this
                    });

                    if (currentToken) {
                        setFcmToken(currentToken);

                        // Send to backend
                        // Ideally we check if it changed, but simple approach implies sending it on auth.
                        // Backend should handle upsert idempotency.
                        await AuthService.updateFcmToken(currentToken);
                    }
                }
            } catch (error) {
                // Silently fail - FCM token update is not critical
            }
        };

        setupFCM();
    }, [accessToken]); // Re-run if accessToken changes (login)

    useEffect(() => {
        if (typeof window !== 'undefined' && messaging) {
            // Foreground message listener
            const unsubscribe = onMessage(messaging, (payload) => {
                // You can use a toast or snackbar library here to show the notification
                // e.g., toast(payload.notification?.title);
                // For now, we will rely on browser Notification if permission granted 
                // (though onMessage prevents default system notification in focus for some browsers, so manual UI is better)

                if (Notification.permission === 'granted') {
                    const title = payload.notification?.title || 'New Message';
                    const options = {
                        body: payload.notification?.body,
                        icon: '/icon-192x192.png'
                    };
                    new Notification(title, options);
                }
            });
            return () => unsubscribe();
        }
    }, []);

    return { fcmToken };
}
