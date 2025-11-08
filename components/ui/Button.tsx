"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "dark" | "primary";
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const baseStyles =
  "inline-flex h-auto items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap rounded-[8px] font-semibold text-[13px] desktop:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none";

const variants = {
  default: "bg-white text-black hover:bg-gray-100 border border-gray-300",
  dark: "bg-black text-white hover:bg-gray-800",
  primary: "bg-tango text-white hover:bg-brand-800",
};

export default function Button({
  children,
  variant = "default",
  className = "",
  icon,
  iconPosition = "left",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
}