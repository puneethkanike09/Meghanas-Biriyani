"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "dark" | "primary";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: ReactNode;
}

export default function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  icon,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-white text-black hover:bg-gray-100 border border-gray-300",
    dark: "bg-black text-white hover:bg-gray-800",
    primary: "bg-tango text-white hover:bg-brand-800"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-10 py-2 px-6",
    lg: "h-12 px-8 text-lg"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        icon && "space-x-2",
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}