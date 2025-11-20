"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "neutral" | "dark" | "primary" | "primaryOutlined" | "selected" | "ghost";

type CommonButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

type AnchorButtonProps = {
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonButtonProps;

type NativeButtonProps = {
  href?: undefined;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  CommonButtonProps;

type ButtonProps = AnchorButtonProps | NativeButtonProps;

const baseStyles =
  "inline-flex h-10 items-center justify-center gap-2 px-4 py-[10px] whitespace-nowrap rounded-[8px] font-semibold text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  neutral: "bg-white text-gray-700 border border-gray-300 focus-visible:ring-gray-200",
  dark: "bg-gray-900 text-white border border-gray-900 focus-visible:ring-gray-300",
  primary: "bg-tango text-white border border-tango focus-visible:ring-brand-200",
  primaryOutlined: "bg-white text-tango border border-tango  focus-visible:ring-brand-200",
  selected: "bg-tropical-green text-white border border-tropical-green focus-visible:ring-tropical-green/40",
  ghost: "bg-transparent text-gray-600 border-0 shadow-none hover:bg-transparent focus-visible:ring-transparent",
};

export default function Button(props: ButtonProps) {
  const { variant = "neutral", className, icon, iconPosition = "left", ...restProps } = props;
  const classes = cn(baseStyles, variants[variant], className);

  const renderContent = (children: ReactNode) => (
    <>
      {icon && iconPosition === "left" ? (
        <span className="inline-flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
      {icon && iconPosition === "right" ? (
        <span className="inline-flex items-center justify-center">{icon}</span>
      ) : null}
    </>
  );

  if ("href" in restProps && restProps.href) {
    const { href, children, ...anchorProps } = restProps as AnchorButtonProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {renderContent(children)}
      </Link>
    );
  }

  const { children, ...buttonProps } = restProps as NativeButtonProps;

  return (
    <button className={classes} {...buttonProps}>
      {renderContent(children)}
    </button>
  );
}