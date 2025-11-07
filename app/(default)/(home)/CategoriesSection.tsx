"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import DishCard from "@/components/ui/DishCard";

const DISHES = [
    {
        id: 1,
        name: "Chicken Biryani",
        description: "This biryani comes with two pieces of chicken, raita, gravy and is cooked in o...",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 2,
        name: "Chicken Boneless Biryani",
        description: "We use long grain basmati rice, and the boneless pieces of chicken are cooked in...",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        outOfStock: true,
    },
    {
        id: 3,
        name: "Paneer Butter Masala",
        description: "Fresh pieces of paneer are coated in our in-house andra spice missala and c...",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: true,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 4,
        name: "Lollipop Biryani",
        description: "3 pieces of lollypop are freshly fried with our andra spice mix and served with th...",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 5,
        name: "Chicken Dum Biryani",
        description: "Slow cooked chicken biryani with aromatic spices and basmati rice...",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        outOfStock: true,
    },
    {
        id: 6,
        name: "Chicken Dum Biryani",
        description: "Slow cooked chicken biryani with aromatic spices and basmati rice...",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 7,
        name: "Chicken Dum Biryani",
        description: "Slow cooked chicken biryani with aromatic spices and basmati rice...",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 8,
        name: "Chicken Dum Biryani",
        description: "Slow cooked chicken biryani with aromatic spices and basmati rice...",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
];

export default function CategoriesSection() {
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
        <section className="py-12 tablet:py-16 desktop:py-20 bg-[#F5E6D3]">
            <div className="section-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 tablet:mb-10 desktop:mb-12">
                    <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-[#181D27] leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2]">
                        What's your next bite going to be?
                    </h2>

                    {/* Navigation Buttons - Desktop Only */}
                    <div className="hidden desktop:flex gap-3">
                        <button
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            className={`w-10 h-10 flex items-center justify-center bg-[#F5F5F5] rounded-full transition-all duration-200 ${canScrollPrev
                                ? "hover:bg-[#D5D7DA] cursor-pointer opacity-100"
                                : "cursor-not-allowed opacity-40"
                                }`}
                            aria-label="Previous"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-[#181D27]" />
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            className={`w-10 h-10 flex items-center justify-center bg-[#F5F5F5] rounded-full transition-all duration-200 ${canScrollNext
                                ? "hover:bg-[#D5D7DA] cursor-pointer opacity-100"
                                : "cursor-not-allowed opacity-40"
                                }`}
                            aria-label="Next"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-[#181D27]" />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div className="overflow-hidden -mb-4 pb-4" ref={emblaRef}>
                    <div className="flex">
                        {DISHES.map((dish) => (
                            <div
                                key={dish.id}
                                className="flex-[0_0_300px] tablet:flex-[0_0_340px] desktop:flex-[0_0_320px] min-w-0 px-2 tablet:px-3 first:pl-0 last:pr-0"
                            >
                                <DishCard
                                    {...dish}
                                    variant="default"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

