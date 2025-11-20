"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

const ARROW_ENABLED = "/assets/homepage/icons/Arrow Right.svg";
const ARROW_DISABLED = "/assets/homepage/icons/Arrow Left.svg";

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
        dragFree: false,
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
        <section className="py-12 tablet:py-16 desktop:py-20 bg-white overflow-x-hidden">
            <div className="section-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 tablet:mb-10 desktop:mb-12">
                    <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-midnight leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2]">
                        Choose your vibe, we&apos;ll bring the bite
                    </h2>

                    {/* Navigation Buttons - Desktop Only */}
                    <div className="hidden desktop:flex gap-4">
                        <button
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            className={`inline-flex items-center p-2 bg-gray-100 rounded-[100px] transition-all duration-200 ${canScrollPrev
                                ? "hover:bg-gray-300 cursor-pointer"
                                : "opacity-50 cursor-not-allowed"
                                }`}
                            aria-label="Previous"
                        >
                            {canScrollPrev ? (
                                <Image
                                    src={ARROW_ENABLED}
                                    alt="Previous"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5 rotate-180"
                                />
                            ) : (
                                <Image
                                    src={ARROW_DISABLED}
                                    alt="Previous"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            )}
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            className={`inline-flex items-center p-2 bg-gray-100 rounded-[100px] transition-all duration-200 ${canScrollNext
                                ? "hover:bg-gray-300 cursor-pointer"
                                : "opacity-50 cursor-not-allowed"
                                }`}
                            aria-label="Next"
                        >
                            {canScrollNext ? (
                                <Image
                                    src={ARROW_ENABLED}
                                    alt="Next"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            ) : (
                                <Image
                                    src={ARROW_DISABLED}
                                    alt="Next"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5 rotate-180"
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div className="select-none rounded-2xl" ref={emblaRef}>
                    <div className="flex items-start -mx-2 tablet:-mx-3">
                        {CATEGORIES.map((category) => (
                            <div
                                key={category.id}
                                className="flex-[0_0_260px] tablet:flex-[0_0_300px] desktop:flex-[0_0_316px] min-w-0 px-2 tablet:px-3"
                            >
                                <div className="group cursor-pointer">
                                    <div className="relative w-full h-[300px] tablet:h-[350px] desktop:h-[380px] rounded-3xl overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-[#00000066]"></div>

                                        {/* Category Name */}
                                        <div className="absolute left-4 bottom-4 tablet:left-6 tablet:bottom-6 desktop:left-8 desktop:bottom-8 flex items-end justify-center">
                                            <h3 className="text-base tablet:text-lg desktop:text-2xl font-semibold text-white leading-normal tracking-[0]">
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

