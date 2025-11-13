"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RadioCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
  label: string;
  description?: string;
}

const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(
  ({ label, description, className, checked, defaultChecked, ...props }, ref) => {
    const isChecked = checked ?? Boolean(defaultChecked);

    return (
      <label
        className={cn(
          "inline-flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition hover:border-tango/70",
          isChecked ? "border-tango bg-brand-100/40 shadow-sm" : "border-gray-300",
          className
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border-2",
            isChecked ? "border-tango" : "border-gray-300"
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isChecked ? "bg-tango" : "bg-transparent"
            )}
          />
        </span>

        <span className="flex flex-col">
          <span className="text-sm font-semibold text-midnight">{label}</span>
          {description ? (
            <span className="text-xs text-gray-600">{description}</span>
          ) : null}
        </span>

        <input
          ref={ref}
          type="radio"
          className="sr-only"
          checked={checked}
          defaultChecked={defaultChecked}
          {...props}
        />
      </label>
    );
  }
);

RadioCard.displayName = "RadioCard";

export default RadioCard;

