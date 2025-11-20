"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const baseInputClasses =
    "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base text-midnight  transition focus:border-tango focus:outline-none focus:ring-2 focus:ring-tango/20 placeholder:text-gray-500";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    startIcon?: ReactNode;
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, startIcon, containerClassName, type = "text", ...props }, ref) => {
        return (
            <div className={cn("relative w-full", containerClassName)}>
                {startIcon ? (
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500">
                        {startIcon}
                    </span>
                ) : null}
                <input
                    ref={ref}
                    type={type}
                    className={cn(baseInputClasses, startIcon && "pl-10", className)}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;

