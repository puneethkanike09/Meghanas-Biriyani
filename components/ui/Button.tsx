"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "neutral" | "dark" | "primary";

type AnchorButtonProps = {
  href: string;
  variant?: ButtonVariant;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type NativeButtonProps = {
  href?: undefined;
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonProps = AnchorButtonProps | NativeButtonProps;

const baseStyles =
  "inline-flex h-10 items-center justify-center px-4 py-[10px] whitespace-nowrap rounded-[8px] font-semibold text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  neutral: "bg-white text-gray-700 border border-gray-300 focus-visible:ring-gray-200",
  dark: "bg-gray-900 text-white border border-gray-900 focus-visible:ring-gray-300",
  primary: "bg-tango text-white border border-tango focus-visible:ring-brand-200",
};

export default function Button(props: ButtonProps) {
  const variant = props.variant ?? "neutral";
  const classes = cn(baseStyles, variants[variant], props.className);

  if ("href" in props && props.href) {
    const { href, children, className: _className, variant: _variant, ...anchorProps } = props as AnchorButtonProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { children, className: _className, variant: _variant, ...buttonProps } = props as NativeButtonProps;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}