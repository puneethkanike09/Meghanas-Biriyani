/**
 * NotificationPermissionButton Component
 * 
 * A reusable button component for requesting notification permissions.
 * Can be used in settings pages, profile pages, or anywhere you want to let users enable notifications.
 */

"use client";

import { useState } from "react";
import { useFCM } from "@/lib/hooks/useFCM";
import Button from "./ui/Button";
import { toast } from "sonner";

interface NotificationPermissionButtonProps {
    /**
     * Custom text for the button
     */
    text?: string;
    /**
     * Button variant
     */
    variant?: "neutral" | "dark" | "primary" | "primaryOutlined" | "selected" | "ghost";
    /**
     * Additional CSS classes
     */
    className?: string;
}

export const NotificationPermissionButton: React.FC<NotificationPermissionButtonProps> = ({
    text = "Enable Notifications",
    variant = "primary",
    className = "",
}) => {
    const { permission, isSupported, requestPermission, isLoading } = useFCM();
    const [isRequesting, setIsRequesting] = useState(false);

    const handleRequestPermission = async () => {
        setIsRequesting(true);
        try {
            await requestPermission();
            if (permission === "granted") {
                toast.success("Notifications Enabled", {
                    description: "You'll now receive updates about your orders!",
                });
            } else if (permission === "denied") {
                toast.error("Notifications Blocked", {
                    description: "Please enable notifications in your browser settings.",
                });
            }
        } catch (error) {
            toast.error("Failed to Enable Notifications", {
                description: "Please try again later.",
            });
        } finally {
            setIsRequesting(false);
        }
    };

    // Don't show button if notifications are not supported
    if (!isSupported) {
        return null;
    }

    // Don't show button if permission is already granted
    if (permission === "granted") {
        return (
            <div className="flex items-center gap-2 text-sm text-green-600">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>Notifications Enabled</span>
            </div>
        );
    }

    return (
        <Button
            variant={variant}
            onClick={handleRequestPermission}
            disabled={isRequesting || isLoading}
            className={className}
        >
            {isRequesting || isLoading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Enabling...
                </>
            ) : (
                <>
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    {text}
                </>
            )}
        </Button>
    );
};

