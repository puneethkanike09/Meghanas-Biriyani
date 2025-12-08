/**
 * Firebase Cloud Messaging (FCM) Notification Utilities
 * 
 * This module provides functions for:
 * - Requesting notification permissions
 * - Getting FCM device tokens
 * - Handling foreground messages
 * - Managing service worker registration
 */

import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { messaging } from "./firebase";

// Type for FCM token
export type FCMToken = string | null;

// Type for notification handler
export type NotificationHandler = (payload: MessagePayload) => void;

/**
 * Checks if the browser supports notifications
 */
export const isNotificationSupported = (): boolean => {
    return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
};

/**
 * Checks current notification permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
    if (!isNotificationSupported()) {
        return "denied";
    }
    return Notification.permission;
};

/**
 * Registers the Firebase messaging service worker
 * This must be done before getting the FCM token
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    if (!isNotificationSupported()) {
        console.warn("Service workers are not supported in this browser");
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
            scope: "/",
        });

        console.log("Service Worker registered successfully:", registration);

        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;

        return registration;
    } catch (error) {
        console.error("Service Worker registration failed:", error);
        return null;
    }
};

/**
 * Requests notification permission from the user
 * Returns the permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!isNotificationSupported()) {
        console.warn("Notifications are not supported in this browser");
        return "denied";
    }

    try {
        const permission = await Notification.requestPermission();
        console.log("Notification permission status:", permission);
        return permission;
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        return "denied";
    }
};

/**
 * Gets the FCM device token
 * This token should be sent to your backend to send push notifications to this device
 * 
 * @param vapidKey - The VAPID key from Firebase Console (Web Push certificates)
 * @returns FCM token or null if failed
 */
export const getFCMToken = async (vapidKey: string): Promise<FCMToken> => {
    if (!messaging) {
        console.warn("Firebase Messaging is not initialized");
        return null;
    }

    if (!isNotificationSupported()) {
        console.warn("Notifications are not supported in this browser");
        return null;
    }

    try {
        // Check permission first
        const permission = await requestNotificationPermission();
        if (permission !== "granted") {
            console.log("Notification permission not granted");
            return null;
        }

        // Register service worker
        const registration = await registerServiceWorker();
        if (!registration) {
            console.error("Failed to register service worker");
            return null;
        }

        // Get FCM token
        const currentToken = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        if (currentToken) {
            console.log("FCM Token obtained successfully:", currentToken);
            return currentToken;
        } else {
            console.log("No FCM token available. Request permission to generate one.");
            return null;
        }
    } catch (error) {
        console.error("An error occurred while retrieving FCM token:", error);
        return null;
    }
};

/**
 * Sets up listener for foreground messages (when app is open and in focus)
 * 
 * @param handler - Callback function to handle incoming messages
 * @returns Unsubscribe function
 */
export const onForegroundMessage = (handler: NotificationHandler): (() => void) => {
    if (!messaging) {
        console.warn("Firebase Messaging is not initialized");
        return () => { };
    }

    const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        handler(payload);
    });

    return unsubscribe;
};

/**
 * Shows a browser notification (for foreground messages)
 * 
 * @param title - Notification title
 * @param options - Notification options
 */
export const showNotification = async (
    title: string,
    options?: NotificationOptions
): Promise<void> => {
    if (!isNotificationSupported()) {
        console.warn("Notifications are not supported");
        return;
    }

    if (Notification.permission !== "granted") {
        console.warn("Notification permission not granted");
        return;
    }

    try {
        // Use service worker to show notification for better consistency
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
            icon: "/assets/navbar/images/logo.svg",
            badge: "/assets/navbar/images/logo.svg",
            ...options,
        } as NotificationOptions);
    } catch (error) {
        console.error("Error showing notification:", error);
        // Fallback to regular notification
        new Notification(title, options);
    }
};

/**
 * Helper function to save FCM token to backend
 * This should be called after getting the token
 * 
 * @param token - FCM token to save
 * @param userId - Optional user ID to associate with the token
 */
export const saveFCMTokenToBackend = async (
    token: string,
    userId?: string
): Promise<boolean> => {
    try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch("/api/fcm/save-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                userId,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to save FCM token to backend");
        }

        console.log("FCM token saved to backend successfully");
        return true;
    } catch (error) {
        console.error("Error saving FCM token to backend:", error);
        return false;
    }
};

/**
 * Helper function to delete FCM token from backend (e.g., on logout)
 * 
 * @param token - FCM token to delete
 */
export const deleteFCMTokenFromBackend = async (token: string): Promise<boolean> => {
    try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch("/api/fcm/delete-token", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete FCM token from backend");
        }

        console.log("FCM token deleted from backend successfully");
        return true;
    } catch (error) {
        console.error("Error deleting FCM token from backend:", error);
        return false;
    }
};

