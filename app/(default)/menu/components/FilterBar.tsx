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
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors">
                        <span className="text-sm tablet:text-base font-semibold text-midnight whitespace-nowrap">
                            Filter by
                        </span>
                        <Image
                            src="/assets/homepage/icons/Filter.svg"
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
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`inline-flex items-center px-4 py-2.5 rounded-xl whitespace-nowrap text-sm tablet:text-base font-semibold transition-all duration-200 flex-shrink-0 ${selectedCategory === category
                                ? "bg-tango text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

