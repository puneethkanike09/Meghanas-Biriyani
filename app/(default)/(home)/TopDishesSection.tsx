"use client";

import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

const TOP_DISHES = [
    {
        id: 1,
        name: "Chicken Biryani",
        description: "This biryani comes with two pieces of chicken, raita, gravy and is cooked in our freshly prepared spice blend. It is moderately spicy and...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 2,
        name: "Chicken Boneless Biryani",
        description: "We use long grain basmati rice, and the boneless pieces of chicken are cooked in our own andra spic...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 3,
        name: "Lollipop Biryani",
        description: "3 pieces of lollypop are freshly fried with our andra spice mix and served with this biryani. It is slightly s...",
        price: "₹ 349",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 4,
        name: "Mutton Biryani",
        description: "Tender mutton pieces cooked with aromatic basmati rice and authentic spices...",
        price: "₹ 399",
        rating: 4.5,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 5,
        name: "Veg Biryani",
        description: "Mixed vegetables cooked with fragrant basmati rice and special masalas...",
        price: "₹ 249",
        rating: 4.5,
        isVeg: true,
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

export default function TopDishesSection() {
    const featuredDish = TOP_DISHES[0];
    const scrollDishes = TOP_DISHES.slice(1);

    return (
        <section className="py-12 tablet:py-16 desktop:py-20 bg-white">
            <div className="section-container">
                {/* Header */}
                <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] text-center font-semibold text-[#181D27] mb-8 tablet:mb-10 desktop:mb-12">
                    Cravings Ki Permanent List – Our Top 10
                </h2>

                {/* Content Grid */}
                <div className="grid grid-cols-1 desktop:grid-cols-[40%_60%] gap-5 relative">
                    {/* Left Section - Featured Dish (Sticky) */}
                    <div className="desktop:sticky desktop:top-[116px] h-fit">
                        <div className="bg-[#FFF6F1] rounded-2xl overflow-hidden flex flex-col">
                            {/* Image */}
                            <div className="relative w-full h-48 tablet:h-56 desktop:h-[340px] flex-shrink-0">
                                <Image
                                    src={featuredDish.image}
                                    alt={featuredDish.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-5 desktop:p-6 flex flex-col gap-3">
                                <div className="flex flex-col items-start gap-2">
                                    <div>{featuredDish.isVeg ? <VegIcon /> : <NonVegIcon />}</div>
                                    <h3 className="text-lg tablet:text-xl desktop:text-[18px] font-semibold text-[#181D27] leading-tight">
                                        {featuredDish.name}
                                    </h3>
                                </div>

                                <p className="text-sm tablet:text-base desktop:text-base text-[#414651] leading-relaxed">
                                    {featuredDish.description}
                                </p>

                                <div className="flex items-center gap-1 mt-1">
                                    <StarIcon className="w-4 h-4 tablet:w-5 tablet:h-5 text-primary" />
                                    <span className="text-sm tablet:text-base desktop:text-base font-medium text-[#181D27]">
                                        {featuredDish.rating}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xl tablet:text-2xl font-bold text-[#181D27]">
                                        {featuredDish.price}
                                    </span>
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="px-6 tablet:px-8"
                                        icon={<PlusIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Scrollable List */}
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-4 tablet:gap-5">
                            {scrollDishes.map((dish) => (
                                <div
                                    key={dish.id}
                                    className="bg-[#FFF6F1] rounded-xl overflow-hidden grid grid-cols-[120px_1fr] tablet:grid-cols-[320px_1fr] desktop:grid-cols-[320px_1fr] gap-3 tablet:gap-4"
                                >
                                    {/* Image */}
                                    <div className="relative w-full h-full min-h-[120px] tablet:min-h-[180px] desktop:min-h-[220px]">
                                        <Image
                                            src={dish.image}
                                            alt={dish.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="py-3 pr-3 tablet:py-5 tablet:pr-5 desktop:p-6 flex flex-col justify-between gap-3">
                                        <div className="flex flex-col items-start gap-2">
                                            <div>
                                                {dish.isVeg ? <VegIcon /> : <NonVegIcon />}
                                            </div>
                                            <h4 className="text-lg tablet:text-xl desktop:text-[18px] font-semibold text-[#181D27] leading-tight">
                                                {dish.name}
                                            </h4>
                                        </div>

                                        <p className="text-sm tablet:text-base desktop:text-base text-[#414651] line-clamp-2 leading-relaxed">
                                            {dish.description}
                                        </p>

                                        <div className="flex items-center gap-1">
                                            <StarIcon className="w-4 h-4 tablet:w-5 tablet:h-5 text-primary" />
                                            <span className="text-sm tablet:text-base desktop:text-base font-medium text-[#181D27]">
                                                {dish.rating}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xl tablet:text-2xl font-bold text-[#181D27]">
                                                {dish.price}
                                            </span>
                                            <Button
                                                variant="primary"
                                                size="md"
                                                className="px-6 tablet:px-8"
                                                icon={<PlusIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

