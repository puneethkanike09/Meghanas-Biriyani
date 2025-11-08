"use client";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface MenuHamburgerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    onSelectCategory?: (category: string) => void;
}

const MENU_ITEMS = [
    "Recommended",
    "Box Biriyani - New Launch",
    "Day Special",
    "Extra",
    "Veg Starter",
    "Sea Food Starter",
    "Non-Veg Starter",
    "Non-Veg Biriyani",
    "Non-Veg Curries",
    "Indian Breads",
    "Egg",
    "Veg Curries",
    "Rice",
    "Close",
];

export default function MenuHamburger({
    label = "Menu",
    className,
    onSelectCategory,
    ...props
}: MenuHamburgerProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [maxHeight, setMaxHeight] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (item: string) => {
        onSelectCategory?.(item);
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen) return;

        // Prevent body scroll when menu is open
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const calculateMaxHeight = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const availableHeight = rect.top - 18;
                setMaxHeight(availableHeight);
            }
        };

        calculateMaxHeight();
        window.addEventListener("resize", calculateMaxHeight);

        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            // Restore body scroll when menu closes
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("resize", calculateMaxHeight);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative flex justify-center">
            <button
                type="button"
                aria-label={label}
                aria-expanded={isOpen}
                className={cn(
                    "relative inline-flex h-12 w-[132px] items-center overflow-hidden rounded-full bg-midnight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:bg-midnight/90",
                    isOpen && "opacity-0 pointer-events-none",
                    className,
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
                onClick={handleToggle}
                {...props}
            >
                <span
                    className={cn(
                        "absolute flex h-10 w-10 items-center justify-center rounded-full bg-white p-1 transition-[left,transform] duration-300 ease-in-out",
                        isHovered || isOpen ? "left-1/2 -translate-x-1/2" : "left-1 translate-x-0",
                    )}
                >
                    <Image
                        src="/assets/Navigation.svg"
                        alt=""
                        width={32}
                        height={32}
                        className={cn(
                            "h-6 w-6 transition-transform duration-300 ease-in-out",
                            isHovered || isOpen ? "rotate-90" : "rotate-0",
                        )}
                        priority
                    />
                </span>
                <span
                    className={cn(
                        "ml-[52px] overflow-hidden whitespace-nowrap font-normal text-base text-white transition-[opacity,max-width] duration-300 ease-in-out",
                        isHovered || isOpen ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100",
                    )}
                >
                    Menu
                </span>
            </button>

            {isOpen && (
                <div className="pointer-events-auto absolute bottom-0 left-1/2 z-50 -translate-x-1/2">
                    <nav className="inline-flex flex-col items-center justify-center rounded-3xl bg-midnight px-2 py-3 shadow-lg ring-1 ring-black/10">
                        <div
                            className="flex w-60 flex-col items-stretch gap-1 overflow-y-auto custom-scrollbar"
                            style={{ maxHeight: maxHeight > 0 ? `${maxHeight}px` : "70vh" }}
                        >
                            {MENU_ITEMS.map((item) => {
                                const isClose = item.toLowerCase() === "close";
                                return (
                                    <Button
                                        key={item}
                                        type="button"
                                        variant="dark"
                                        className={cn(
                                            "h-auto w-full flex-shrink-0 justify-center rounded-full bg-transparent px-3 py-2 text-white hover:bg-gray-800",
                                            isClose && "bg-gray-900 hover:bg-gray-800",
                                        )}
                                        onClick={() => {
                                            if (isClose) {
                                                setIsOpen(false);
                                                return;
                                            }
                                            handleSelect(item);
                                        }}
                                    >
                                        <span className="text-base font-normal text-white">{item}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}