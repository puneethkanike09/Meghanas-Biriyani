"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Category {
    id: string;
    name: string;
}

interface FilterBarProps {
    categories: Category[];
    selectedCategoryId: string;
    onSelectCategory: (categoryId: string) => void;
}

export default function FilterBar({
    categories,
    selectedCategoryId,
    onSelectCategory,
}: FilterBarProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const previousSelectedCategoryIdRef = useRef<string | null>(null);
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const startYRef = useRef(0);
    const hasDraggedRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false);

    // Auto-scroll to selected category when it changes
    useEffect(() => {
        if (!selectedCategoryId || categories.length === 0) return;

        // Find the index of the selected category
        const selectedIndex = categories.findIndex(
            (cat) => cat.id === selectedCategoryId
        );

        // Only scroll if:
        // 1. Category is found
        // 2. It's a different category than before (or first time)
        if (
            selectedIndex !== -1 &&
            previousSelectedCategoryIdRef.current !== selectedCategoryId
        ) {
            // Wait for DOM to be ready
            const scrollToCategory = () => {
                const selectedButton = buttonRefs.current.get(selectedCategoryId);
                const scrollContainer = scrollContainerRef.current;

                if (!selectedButton || !scrollContainer) return;

                // Get actual viewport positions
                const containerRect = scrollContainer.getBoundingClientRect();
                const buttonRect = selectedButton.getBoundingClientRect();

                // Calculate centers
                const containerCenterX = containerRect.left + containerRect.width / 2;
                const buttonCenterX = buttonRect.left + buttonRect.width / 2;

                // Calculate how much we need to scroll
                // The difference between button center and container center
                const scrollDelta = buttonCenterX - containerCenterX;

                // Apply the scroll
                scrollContainer.scrollBy({
                    left: scrollDelta,
                    behavior: "smooth",
                });
            };

            // Wait for next frame to ensure DOM is updated
            requestAnimationFrame(() => {
                setTimeout(scrollToCategory, 100);
            });

            previousSelectedCategoryIdRef.current = selectedCategoryId;
        }
    }, [selectedCategoryId, categories]);

    // Handle mouse drag to scroll
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleMouseDown = (e: MouseEvent) => {
            isDraggingRef.current = true;
            hasDraggedRef.current = false;
            setIsDragging(true);
            startXRef.current = e.pageX;
            startYRef.current = e.pageY;
            scrollLeftRef.current = scrollContainer.scrollLeft;

            // Prevent text selection
            scrollContainer.style.userSelect = 'none';
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;

            const deltaX = Math.abs(e.pageX - startXRef.current);
            const deltaY = Math.abs(e.pageY - startYRef.current);

            // Only consider it a drag if moved more than 5px and more horizontally than vertically
            if (deltaX > 5 && deltaX > deltaY) {
                hasDraggedRef.current = true;
                e.preventDefault();
                e.stopPropagation();

                const x = e.pageX;
                const walk = (x - startXRef.current) * 2; // Scroll speed multiplier
                scrollContainer.scrollLeft = scrollLeftRef.current - walk;
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;

            const wasDragging = hasDraggedRef.current;

            isDraggingRef.current = false;
            setIsDragging(false);
            scrollContainer.style.userSelect = '';

            // If it was a drag, prevent button click
            if (wasDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;

            isDraggingRef.current = false;
            setIsDragging(false);
            scrollContainer.style.userSelect = '';
        };

        scrollContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            scrollContainer.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="section-container py-4">
            <div className="flex items-center gap-4">
                {/* Filter By Button - Fixed */}
                <div className="flex items-center gap-3 shrink-0">
                    <button className="inline-flex h-9 items-center gap-2 px-[14px] rounded-full border border-gray-200 bg-white transition-colors cursor-pointer" suppressHydrationWarning>
                        <span className="text-base font-semibold text-gray-900 whitespace-nowrap">
                            Filter by
                        </span>
                        <Image
                            src="/assets/menu/icons/Filter.svg"
                            alt="Filter"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                        />
                    </button>

                    {/* Separator */}
                    <div className="h-9 w-px bg-gray-300" />
                </div>

                {/* Scrollable Categories */}
                <div
                    className="flex-1 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden"
                    ref={scrollContainerRef}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <div className="flex items-center gap-2">
                        {categories.map((category) => {
                            const isSelected = selectedCategoryId === category.id;
                            return (
                                <button
                                    key={category.id}
                                    ref={(el) => {
                                        if (el) {
                                            buttonRefs.current.set(category.id, el);
                                        } else {
                                            buttonRefs.current.delete(category.id);
                                        }
                                    }}
                                    data-category-id={category.id}
                                    onClick={(e) => {
                                        // Only trigger click if it wasn't a drag
                                        if (!hasDraggedRef.current) {
                                            onSelectCategory(category.id);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        // Reset drag flag when mouse down on button
                                        hasDraggedRef.current = false;
                                    }}
                                    className={`inline-flex h-9 items-center justify-center gap-2 px-[12px] py-2 rounded-[12px] whitespace-nowrap text-base font-normal transition-all duration-200 shrink-0 border cursor-pointer ${isSelected
                                        ? "bg-tango text-white border-transparent"
                                        : "bg-white text-gray-700 border-gray-200"
                                        }`}
                                    suppressHydrationWarning
                                >
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

