"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useMenuStore } from "@/store/useMenuStore";

interface MenuHamburgerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    onSelectCategory?: (category: string) => void;
}

export default function MenuHamburger({
    label = "Menu",
    className,
    onSelectCategory,
    ...props
}: MenuHamburgerProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { categories, fetchCategories, loading, setSelectedCategoryId } = useMenuStore();
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [maxHeight, setMaxHeight] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        // Only navigate if not already on menu page
        if (pathname !== '/menu') {
            router.push('/menu');
        }
        setIsOpen(false);
        onSelectCategory?.(categoryId);
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
                    "relative inline-flex h-12 w-[118px] items-center justify-center overflow-hidden rounded-full bg-midnight transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                    isOpen && "opacity-0 pointer-events-none",
                    className,
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
                onClick={handleToggle}
                suppressHydrationWarning
                {...props}
            >
                <span
                    className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white p-1"
                    style={{
                        left: isHovered || isOpen ? '50%' : '0.25rem',
                        transform: isHovered || isOpen ? 'translateX(-50%)' : 'translateX(0)',
                        transition: 'left 300ms ease-in-out, transform 300ms ease-in-out',
                    }}
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
                        "ml-12 overflow-hidden whitespace-nowrap font-normal text-base text-white transition-[opacity,max-width] duration-300 ease-in-out",
                        isHovered || isOpen ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100",
                    )}
                >
                    Menu
                </span>
            </button>

            {isOpen && (
                <div className="pointer-events-auto absolute bottom-0 left-1/2 z-50 -translate-x-1/2">
                    <nav className="inline-flex flex-col items-center justify-center rounded-3xl bg-black-main px-2 py-3 shadow-lg ring-1 ring-black/10">
                        <div
                            className="flex w-60 flex-col items-stretch gap-1 overflow-y-auto custom-scrollbar"
                            style={{ maxHeight: maxHeight > 0 ? `${maxHeight}px` : "70vh" }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-base font-normal text-white">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    {categories.map((category) => (
                                        <Button
                                            key={category.categoryId}
                                            type="button"
                                            variant="dark"
                                            className="h-auto w-full shrink-0 justify-center rounded-full bg-transparent px-3 py-2 text-white hover:bg-gray-800 border-none shadow-none"
                                            onClick={() => handleSelect(category.categoryId)}
                                        >
                                            <span className="text-base font-normal text-white">{category.name}</span>
                                        </Button>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="dark"
                                        className="h-auto w-full shrink-0 justify-center rounded-full bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 border-none shadow-none"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-base font-normal text-white">Close</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}