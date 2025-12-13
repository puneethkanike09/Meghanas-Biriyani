"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/useAuthStore";
import { ReactNode } from "react";

export function FCMProvider({ children }: { children: ReactNode }) {
    const { user } = useAuthStore();
    useNotifications(user?.id);
    
    return <>{children}</>;
}
