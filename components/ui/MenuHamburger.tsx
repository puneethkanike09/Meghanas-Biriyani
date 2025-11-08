"use client";
import { useState } from "react";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface MenuHamburgerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export default function MenuHamburger({
    label = "Menu",
    className,
    ...props
}: MenuHamburgerProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            type="button"
            aria-label={label}
            className={cn(
                "relative inline-flex h-12 w-[120px] items-center overflow-hidden rounded-full bg-midnight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                className,
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            <span
                className={cn(
                    "absolute flex h-10 w-10 items-center justify-center rounded-full bg-white p-1 transition-[left,transform] duration-300 ease-in-out",
                    isHovered ? "left-1/2 -translate-x-1/2" : "left-1 translate-x-0",
                )}
            >
                <Image
                    src="/assets/Navigation.svg"
                    alt=""
                    width={32}
                    height={32}
                    className={cn(
                        "h-6 w-6 transition-transform duration-300 ease-in-out",
                        isHovered ? "rotate-90" : "rotate-0",
                    )}
                    priority
                />
            </span>
            <span
                className={cn(
                    "ml-[52px] overflow-hidden whitespace-nowrap font-normal text-base text-white transition-[opacity,max-width] duration-300 ease-in-out",
                    isHovered ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100",
                )}
            >
                Menu
            </span>
        </button>
    );
}