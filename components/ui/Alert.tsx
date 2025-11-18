"use client";

import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AlertProps = HTMLAttributes<HTMLDivElement>;

const Alert = forwardRef<HTMLDivElement, AlertProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="alert"
                className={cn(
                    "relative w-full rounded-lg border p-4",
                    className
                )}
                {...props}
            />
        );
    }
);
Alert.displayName = "Alert";

const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("text-sm [&_p]:leading-relaxed", className)}
                {...props}
            />
        );
    }
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };

