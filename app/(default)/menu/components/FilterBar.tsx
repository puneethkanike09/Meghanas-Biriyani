"use client";

import { useRef } from "react";
import Image from "next/image";

interface FilterBarProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function FilterBar({
    categories,
    selectedCategory,
    onSelectCategory,
}: FilterBarProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="section-container py-4">
            <div className="flex items-center gap-4">
                {/* Filter By Button - Fixed */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button className="inline-flex h-9 items-center gap-2 px-[14px] rounded-full border border-gray-200 bg-white transition-colors cursor-pointer">
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
                    ref={scrollContainerRef}
                    className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1"
                    style={{
                        scrollbarWidth: 'thin',
                    }}
                >
                    {categories.map((category) => {
                        const isSelected = selectedCategory === category;
                        return (
                            <button
                                key={category}
                                onClick={() => onSelectCategory(category)}
                                className={`inline-flex h-9 items-center justify-center gap-2 px-[12px] py-2 rounded-[12px] whitespace-nowrap text-base font-normal transition-all duration-200 flex-shrink-0 border cursor-pointer ${isSelected
                                    ? "bg-tango text-white border-transparent"
                                    : "bg-white text-gray-700 border-gray-200"
                                    }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

