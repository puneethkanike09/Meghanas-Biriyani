"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

const ARROW_ENABLED = "/assets/homepage/icons/Arrow Right.svg";

const BANNER_SLIDES = [
    {
        id: 1,
        image: "/assets/homepage/images/SpecialOffers.jpg",
        alt: "Banner 1",
    },
    {
        id: 2,
        image: "/assets/homepage/images/SpecialOffers.jpg",
        alt: "Banner 2",
    },
    {
        id: 3,
        image: "/assets/homepage/images/SpecialOffers.jpg",
        alt: "Banner 3",
    },
    {
        id: 4,
        image: "/assets/homepage/images/SpecialOffers.jpg",
        alt: "Banner 3",
    },
    {
        id: 5,
        image: "/assets/homepage/images/SpecialOffers.jpg",
        alt: "Banner 3",
    },
    {
        id: 6,
        image: "/assets/homepage/images/SpecialOffers.jpg",
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
            <div className="section-container flex flex-col items-start gap-4">
                {/* Carousel */}
                <div className="overflow-hidden rounded-3xl w-full" ref={emblaRef}>
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
                                    height={640}
                                    className="w-full h-auto"
                                    priority={slide.id === 1}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Controls */}
                <nav className="flex h-9 items-center justify-between px-6 py-0 w-full" aria-label="Carousel navigation">
                    {/* Dots */}
                    <div className="inline-flex items-center gap-1">
                        {BANNER_SLIDES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`transition-all duration-300 cursor-pointer ${index === selectedIndex
                                    ? "w-4 h-2 bg-midnight rounded-[100px]"
                                    : "w-2 h-2 bg-gray-300 rounded hover:bg-gray-400"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === selectedIndex ? "true" : "false"}
                                suppressHydrationWarning
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="inline-flex items-center gap-4">
                        <button
                            onClick={scrollPrev}
                            className="inline-flex items-center p-2 bg-gray-100 rounded-[100px] hover:bg-gray-300 transition-all duration-200 cursor-pointer"
                            aria-label="Previous slide"
                            suppressHydrationWarning
                        >
                            <Image
                                src={ARROW_ENABLED}
                                alt="Previous slide"
                                width={20}
                                height={20}
                                className="h-5 w-5 rotate-180"
                            />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="inline-flex items-center p-2 bg-gray-100 rounded-[100px] hover:bg-gray-300 transition-all duration-200 cursor-pointer"
                            aria-label="Next slide"
                            suppressHydrationWarning
                        >
                            <Image
                                src={ARROW_ENABLED}
                                alt="Next slide"
                                width={20}
                                height={20}
                                className="h-5 w-5"
                            />
                        </button>
                    </div>
                </nav>
            </div>
        </section>
    );
}

