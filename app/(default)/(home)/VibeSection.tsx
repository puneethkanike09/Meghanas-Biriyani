"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { MenuService } from "@/services/menu.service";
import { useMenuStore } from "@/store/useMenuStore";

const ARROW_ENABLED = "/assets/homepage/icons/Arrow Right.svg";
const ARROW_DISABLED = "/assets/homepage/icons/Arrow Left.svg";



export default function VibeSection() {
    const { categories, fetchCategories, loading } = useMenuStore();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        dragFree: false,
    });

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

    if (loading) {
        return (
            <section className="py-12 tablet:py-16 desktop:py-20 bg-white overflow-x-hidden">
                <div className="section-container">
                    <div className="flex items-center justify-between mb-8 tablet:mb-10 desktop:mb-12">
                        <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-midnight leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2]">
                            Choose your vibe, we&apos;ll bring the bite
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        {[...Array(17)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-[0_0_260px] tablet:flex-[0_0_300px] desktop:flex-[0_0_316px] min-w-0"
                            >
                                <div className="relative w-full h-[300px] tablet:h-[350px] desktop:h-[380px] rounded-3xl overflow-hidden bg-gray-200 animate-pulse">
                                    {/* Text skeleton at bottom */}
                                    <div className="absolute left-4 bottom-4 tablet:left-6 tablet:bottom-6 desktop:left-8 desktop:bottom-8">
                                        <div className="h-5 tablet:h-6 desktop:h-7 w-32 tablet:w-40 desktop:w-48 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

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
                        {categories.map((category) => {
                            // @ts-ignore - The service type definition might be missing imageURL but API returns it, or vice versa.
                            // The local interface had imageURL. Let's assume mapped object or optional.
                            // Actually MenuService's Category interface DOES NOT have imageURL.
                            // But the API response in VibeSection had it? 
                            // Let's safe check.
                            const imageUrl = (category as any).imageURL || "/assets/homepage/images/top10.jpg";

                            return (
                                <div
                                    key={category.categoryId}
                                    className="flex-[0_0_260px] tablet:flex-[0_0_300px] desktop:flex-[0_0_316px] min-w-0 px-2 tablet:px-3"
                                >
                                    <Link
                                        href={{
                                            pathname: '/menu',
                                            query: { filter: category.categoryId }
                                        }}
                                        className="group cursor-pointer block"
                                    >
                                        <div className="relative w-full h-[300px] tablet:h-[350px] desktop:h-[380px] rounded-3xl overflow-hidden">
                                            <Image
                                                src={imageUrl}
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
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
