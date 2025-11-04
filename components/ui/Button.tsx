"use client";

import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    className?: string;
    onClick?: () => void;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    onClick,
}: ButtonProps) {
    const baseStyles = "font-semibold rounded-lg transition-colors";

    const variants = {
        primary: "bg-orange-600 text-white hover:bg-orange-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
        outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}