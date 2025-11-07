"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const BANNER_SLIDES = [
    {
        id: 1,
        image: "/assets/homepage/images/test.jpg",
        alt: "Banner 1",
    },
    {
        id: 2,
        image: "/assets/homepage/images/test.jpg",
        alt: "Banner 2",
    },
    {
        id: 3,
        image: "/assets/homepage/images/test.jpg",
        alt: "Banner 3",
    },
    {
        id: 4,
        image: "/assets/homepage/images/test.jpg",
        alt: "Banner 3",
    },
    {
        id: 5,
        image: "/assets/homepage/images/test.jpg",
        alt: "Banner 3",
    },
    {
        id: 6,
        image: "/assets/homepage/images/test.jpg",
        alt: "Banner 3",
    },
];

export default function BannerSection() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "center",
    });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
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
                {/* Carousel */}
                <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                    <div className="flex">
                        {BANNER_SLIDES.map((slide) => (
                            <div
                                key={slide.id}
                                className="flex-[0_0_100%] min-w-0"
                            >
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    width={1920}
                                    height={0}
                                    className="w-full h-auto"
                                    priority={slide.id === 1}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-6 tablet:mt-8">
                    {/* Dots */}
                    <div className="flex gap-2">
                        {BANNER_SLIDES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                    ? "w-8 bg-midnight"
                                    : "w-2 bg-gray-300 hover:bg-gray-300"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={scrollPrev}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-300 rounded-full transition-all duration-200"
                            aria-label="Previous slide"
                        >
                            <ChevronLeftIcon className="w-5 h-5 tablet:w-6 tablet:h-6 desktop:w-5 desktop:h-5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-300 rounded-full transition-all duration-200"
                            aria-label="Next slide"
                        >
                            <ChevronRightIcon className="w-5 h-5 tablet:w-6 tablet:h-6 desktop:w-5 desktop:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

