import React from 'react';

export default function DishCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col border border-gray-200 animate-pulse">
            {/* Image Skeleton */}
            <div className="relative w-full h-[180px] tablet:h-[200px] desktop:h-[220px] bg-gray-200" />

            {/* Content Skeleton */}
            <div className="p-4 tablet:p-5 desktop:p-4 flex flex-col flex-1 gap-4">
                <div className="flex items-center justify-between">
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="w-3/4 h-6 bg-gray-200 rounded" />
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded" />
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="w-16 h-6 bg-gray-200 rounded" />
                    <div className="w-24 h-9 bg-gray-200 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
