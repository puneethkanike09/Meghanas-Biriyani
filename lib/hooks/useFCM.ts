/**
 * useFCM - React Hook for Firebase Cloud Messaging
 * 
 * This hook provides a simple interface to set up and manage FCM in React components.
 * It handles:
 * - Service worker registration
 * - Permission requests
 * - Token retrieval
 * - Foreground message listening
 * - Token persistence
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { type MessagePayload } from "firebase/messaging";
import {
  getFCMToken,
  onForegroundMessage,
  showNotification,
  saveFCMTokenToBackend,
  isNotificationSupported,
  getNotificationPermission,
} from "../fcm-notifications";
import { toast } from "sonner";

interface UseFCMOptions {
  /**
   * Whether to automatically request permission on mount
   * Default: false
   */
  autoRequestPermission?: boolean;
  
  /**
   * Whether to automatically save token to backend
   * Default: true
   */
  autoSaveToken?: boolean;
  
  /**
   * Custom handler for foreground messages
   * If not provided, will show a toast notification
   */
  onMessage?: (payload: MessagePayload) => void;
  
  /**
   * User ID to associate with the FCM token (optional)
   */
  userId?: string;
  
  /**
   * Whether to enable verbose logging
   * Default: false
   */
  debug?: boolean;
}

interface UseFCMReturn {
  /**
   * The FCM device token (null if not available)
   */
  token: string | null;
  
  /**
   * Current notification permission status
   */
  permission: NotificationPermission;
  
  /**
   * Whether FCM is supported in this browser
   */
  isSupported: boolean;
  
  /**
   * Whether FCM is currently initializing
   */
  isLoading: boolean;
  
  /**
   * Any error that occurred during initialization
   */
  error: Error | null;
  
  /**
   * Function to manually request notification permission and get token
   */
  requestPermission: () => Promise<void>;
  
  /**
   * Function to manually refresh the FCM token
   */
  refreshToken: () => Promise<void>;
}

/**
 * Custom hook for Firebase Cloud Messaging
 */
export const useFCM = (options: UseFCMOptions = {}): UseFCMReturn => {
  const {
    autoRequestPermission = false,
    autoSaveToken = true,
    onMessage: customMessageHandler,
    userId,
    debug = false,
  } = options;

  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSupported] = useState(() => isNotificationSupported());

  const log = useCallback(
    (...args: any[]) => {
      if (debug) {
        console.log("[useFCM]", ...args);
      }
    },
    [debug]
  );

  /**
   * Default handler for foreground messages
   */
  const defaultMessageHandler = useCallback((payload: MessagePayload) => {
    log("Foreground message received:", payload);
    
    const title = payload.notification?.title || "New Notification";
    const body = payload.notification?.body || "You have a new notification";
    
    // Show toast notification
    toast.success(title, {
      description: body,
      duration: 5000,
    });
    
    // Also show browser notification
    showNotification(title, {
      body,
      icon: payload.notification?.icon,
      data: payload.data,
      tag: payload.data?.type as string,
    });
  }, [log]);

  /**
   * Gets the FCM token
   */
  const getToken = useCallback(async () => {
    if (!isSupported) {
      log("FCM is not supported in this browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      
      if (!vapidKey) {
        throw new Error("VAPID key is not configured");
      }

      const fcmToken = await getFCMToken(vapidKey);
      
      if (fcmToken) {
        setToken(fcmToken);
        setPermission("granted");
        log("FCM token obtained:", fcmToken);

        // Save token to backend if enabled
        if (autoSaveToken) {
          await saveFCMTokenToBackend(fcmToken, userId);
        }

        // Store token in localStorage for persistence
        localStorage.setItem("fcm_token", fcmToken);
      } else {
        log("Failed to get FCM token");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to get FCM token");
      setError(error);
      console.error("Error getting FCM token:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, autoSaveToken, userId, log]);

  /**
   * Manually request permission and get token
   */
  const requestPermission = useCallback(async () => {
    await getToken();
  }, [getToken]);

  /**
   * Refresh the FCM token
   */
  const refreshToken = useCallback(async () => {
    localStorage.removeItem("fcm_token");
    await getToken();
  }, [getToken]);

  /**
   * Initialize FCM on mount
   */
  useEffect(() => {
    if (!isSupported) {
      log("FCM is not supported, skipping initialization");
      return;
    }

    // Check current permission status
    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);
    log("Current permission status:", currentPermission);

    // Try to get existing token from localStorage
    const existingToken = localStorage.getItem("fcm_token");
    if (existingToken) {
      setToken(existingToken);
      log("Existing FCM token found:", existingToken);
    }

    // Auto request permission if enabled and not already granted
    if (autoRequestPermission && currentPermission === "default") {
      log("Auto-requesting notification permission");
      requestPermission();
    } else if (currentPermission === "granted" && !existingToken) {
      // Permission already granted but no token, get it
      log("Permission granted, getting FCM token");
      getToken();
    }
  }, [isSupported, autoRequestPermission, requestPermission, getToken, log]);

  /**
   * Set up foreground message listener
   */
  useEffect(() => {
    if (!isSupported) {
      return;
    }

    log("Setting up foreground message listener");
    
    const messageHandler = customMessageHandler || defaultMessageHandler;
    const unsubscribe = onForegroundMessage(messageHandler);

    return () => {
      log("Cleaning up foreground message listener");
      unsubscribe();
    };
  }, [isSupported, customMessageHandler, defaultMessageHandler, log]);

  return {
    token,
    permission,
    isSupported,
    isLoading,
    error,
    requestPermission,
    refreshToken,
  };
};

