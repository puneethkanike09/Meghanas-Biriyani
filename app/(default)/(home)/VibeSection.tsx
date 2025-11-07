"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const CATEGORIES = [
    {
        id: 1,
        name: "Box Biriyani - New Launch",
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 2,
        name: "Day Special",
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 3,
        name: "Extra",
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 4,
        name: "Veg Starter",
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 5,
        name: "Veg Biryani",
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 6,
        name: "Non-Veg Starter",
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 7,
        name: "Chicken Biryani",
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 8,
        name: "Mutton Biryani",
        image: "/assets/homepage/images/top10.jpg",
    },
];

export default function VibeSection() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        dragFree: true,
    });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section className="py-12 tablet:py-16 desktop:py-20 bg-white">
            <div className="section-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 tablet:mb-10 desktop:mb-12">
                    <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-midnight leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2]">
                        Choose your vibe, we&apos;ll bring the bite
                    </h2>

                    {/* Navigation Buttons - Desktop Only */}
                    <div className="hidden desktop:flex gap-3">
                        <button
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            className={`w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full transition-all duration-200 ${canScrollPrev
                                ? "hover:bg-gray-300 cursor-pointer opacity-100"
                                : "cursor-not-allowed opacity-40"
                                }`}
                            aria-label="Previous"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-midnight" />
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            className={`w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full transition-all duration-200 ${canScrollNext
                                ? "hover:bg-gray-300 cursor-pointer opacity-100"
                                : "cursor-not-allowed opacity-40"
                                }`}
                            aria-label="Next"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-midnight" />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex items-start">
                        {CATEGORIES.map((category) => (
                            <div
                                key={category.id}
                                className="flex-[0_0_260px] tablet:flex-[0_0_300px] desktop:flex-[0_0_320px] min-w-0 px-2 tablet:px-3 first:pl-0 last:pr-0"
                            >
                                <div className="group cursor-pointer">
                                    <div className="relative w-full h-[300px] tablet:h-[350px] desktop:h-[375px] rounded-2xl overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-[#00000066]"></div>

                                        {/* Category Name */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 tablet:p-4 desktop:p-4">
                                            <h3 className="text-base tablet:text-lg desktop:text-xl font-semibold text-white leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.3]">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

