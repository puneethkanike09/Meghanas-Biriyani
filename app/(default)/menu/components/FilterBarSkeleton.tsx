"use client";

import Image from "next/image";

export default function FilterBarSkeleton() {
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

                {/* Skeleton Categories */}
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1 pb-2">
                    {[...Array(17)].map((_, i) => (
                        <div
                            key={i}
                            className="inline-flex h-9 items-center justify-center gap-2 px-[12px] py-2 rounded-[12px] whitespace-nowrap text-base font-normal flex-shrink-0 border bg-gray-100 border-gray-200 animate-pulse"
                        >
                            <div className="h-4 w-20 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
