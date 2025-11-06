"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

const DISHES = [
    {
        id: 1,
        name: "Chicken Biryani",
        description: "This biryani comes with two pieces of chicken, raita, gravy and is cooked in o...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 2,
        name: "Chicken Boneless Biryani",
        description: "We use long grain basmati rice, and the boneless pieces of chicken are cooked in...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 3,
        name: "Paneer Butter Masala",
        description: "Fresh pieces of paneer are coated in our in-house andra spice missala and c...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: true,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 4,
        name: "Lollipop Biryani",
        description: "3 pieces of lollypop are freshly fried with our andra spice mix and served with th...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 5,
        name: "Chicken Dum Biryani",
        description: "Slow cooked chicken biryani with aromatic spices and basmati rice...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 6,
        name: "Chicken Dum Biryani",
        description: "Slow cooked chicken biryani with aromatic spices and basmati rice...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 7,
        name: "Chicken Dum Biryani",
        description: "Slow cooked chicken biryani with aromatic spices and basmati rice...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 8,
        name: "Chicken Dum Biryani",
        description: "Slow cooked chicken biryani with aromatic spices and basmati rice...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
];

const VegIcon = () => (
    <div className="w-4 h-4 tablet:w-5 tablet:h-5 border-2 border-green-600 flex items-center justify-center">
        <div className="w-2 h-2 tablet:w-2.5 tablet:h-2.5 rounded-full bg-green-600"></div>
    </div>
);

const NonVegIcon = () => (
    <div className="w-4 h-4 tablet:w-5 tablet:h-5 border-2 border-red-600 flex items-center justify-center">
        <div className="w-2 h-2 tablet:w-2.5 tablet:h-2.5 rounded-full bg-red-600"></div>
    </div>
);

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
                    <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-[#181D27]">
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
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {DISHES.map((dish) => (
                            <div
                                key={dish.id}
                                className="flex-[0_0_280px] tablet:flex-[0_0_320px] desktop:flex-[0_0_300px] min-w-0 px-2 tablet:px-3 first:pl-0 last:pr-0"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                                    {/* Image */}
                                    <div className="relative w-full h-[180px] tablet:h-[200px] desktop:h-[180px]">
                                        <Image
                                            src={dish.image}
                                            alt={dish.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 tablet:p-5 desktop:p-4 flex flex-col flex-1">
                                        {/* Veg/Non-veg Icon & Name */}
                                        <div className="flex flex-col items-start gap-2 mb-2">
                                            {dish.isVeg ? <VegIcon /> : <NonVegIcon />}
                                            <h3 className="text-sm tablet:text-base desktop:text-[18px] font-semibold text-[#181D27] leading-tight">
                                                {dish.name}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs tablet:text-sm desktop:text-base text-[#414651] mb-3 line-clamp-2 leading-relaxed">
                                            {dish.description}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-4">
                                            <StarIcon className="w-4 h-4 text-primary" />
                                            <span className="text-xs tablet:text-sm desktop:text-sm font-medium text-[#181D27]">
                                                {dish.rating}
                                            </span>
                                        </div>

                                        {/* Price & Add Button */}
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-base tablet:text-lg desktop:text-xl font-bold text-[#181D27]">
                                                {dish.price}
                                            </span>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="px-4 tablet:px-5 desktop:px-4"
                                                icon={<PlusIcon className="w-4 h-4" />}
                                            >
                                                Add
                                            </Button>
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

