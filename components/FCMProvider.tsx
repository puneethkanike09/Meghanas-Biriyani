"use client";

import { useFCM } from "@/hooks/useFCM";
import { ReactNode } from "react";

export function FCMProvider({ children }: { children: ReactNode }) {
    useFCM();
    
    return <>{children}</>;
}
