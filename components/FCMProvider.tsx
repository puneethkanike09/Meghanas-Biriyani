
"use client";

import { useEffect } from "react";
import { useFCM } from "@/lib/hooks/useFCM";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface FCMProviderProps {
    children: React.ReactNode;
    /**
     * Whether to automatically request notification permission
     * Default: false (user must manually enable)
     */
    autoRequestPermission?: boolean;
    /**
     * Whether to show notification permission prompt
     * Default: true
     */
    showPermissionPrompt?: boolean;
}

export const FCMProvider: React.FC<FCMProviderProps> = ({
    children,
    autoRequestPermission = false,
    showPermissionPrompt = true,
}) => {
    const { user } = useAuthStore();

    const {
        token,
        permission,
        isSupported,
        isLoading,
        error,
        requestPermission,
    } = useFCM({
        autoRequestPermission,
        autoSaveToken: true,
        userId: user?.id,
        debug: process.env.NODE_ENV === "development",
    });

    // Show permission prompt if notifications are not enabled
    useEffect(() => {
        if (!isSupported) {
            return;
        }

        // Only show prompt if user is logged in and hasn't made a decision yet
        if (user && permission === "default" && showPermissionPrompt) {
            const hasShownPrompt = localStorage.getItem("fcm_prompt_shown");

            if (!hasShownPrompt) {
                // Show a friendly prompt to enable notifications
                const promptTimeout = setTimeout(() => {
                    toast.info("Enable Notifications", {
                        description: "Stay updated with your order status and special offers!",
                        duration: 8000,
                        action: {
                            label: "Enable",
                            onClick: () => {
                                requestPermission();
                                localStorage.setItem("fcm_prompt_shown", "true");
                            },
                        },
                        onDismiss: () => {
                            localStorage.setItem("fcm_prompt_shown", "true");
                        },
                        onAutoClose: () => {
                            localStorage.setItem("fcm_prompt_shown", "true");
                        },
                    });
                }, 3000); // Show prompt after 3 seconds

                return () => clearTimeout(promptTimeout);
            }
        }
    }, [isSupported, user, permission, showPermissionPrompt, requestPermission]);

    // Log FCM status in development
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.log("[FCM Provider] Status:", {
                isSupported,
                permission,
                hasToken: !!token,
                isLoading,
                error: error?.message,
                userId: user?.id,
            });
        }
    }, [isSupported, permission, token, isLoading, error, user]);

    // Show error toast if FCM initialization fails
    useEffect(() => {
        if (error) {
            console.error("[FCM Provider] Error:", error);
            if (process.env.NODE_ENV === "development") {
                toast.error("Notification Setup Failed", {
                    description: error.message,
                });
            }
        }
    }, [error]);

    return <>{children}</>;
};

