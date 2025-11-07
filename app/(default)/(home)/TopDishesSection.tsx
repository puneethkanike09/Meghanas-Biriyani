"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import DishCard from "@/components/ui/DishCard";

const DISHES_DATA = [
    {
        id: 1,
        name: "Mutton Keema Biryani",
        description: "Minced mutton is cooked with our in-house andra spice mix and this biryani is served with gravy and raita. It is moderately spicy and will serve two.",
        price: "₹ 470",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 2,
        name: "Prawns Biryani",
        description: "This biryani is topped with 12-13 pieces of prawns are marinated and cooked in our in-house andra spice mix. It serves two people and is moderately spicy.",
        price: "₹ 470",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 3,
        name: "Meghana Chicken 555",
        description: "Boneless, long strips of chicken are pan-fried with our freshly made andra spice mix, garlic, fresh chilies, and curry leaves. It is pretty spicy.",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        outOfStock: true,
    },
    {
        id: 4,
        name: "Lemon Chicken",
        description: "Fresh lemon and our in-house andra spice mix are used to cook boneless pieces of chicken for this dish. It is moderately spicy and is pan-fried to perfection.",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 5,
        name: "Chicken Kabab",
        description: "5-6 chicken pieces with bone are deep-fried with our freshly made in-house masala mix. It is not very spicy.",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 6,
        name: "Chicken Pakoda",
        description: "Boneless pieces of chicken are coated with an andra-style batter and our in-house spices. It is deep-fried with a lot of fresh green chilies and curry leaves. It is moderately spicy.",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 7,
        name: "Pepper Chicken",
        description: "12-15 pieces of boneless chicken are cooked with a lot of black pepper, our in-house spice mix, and green chilies. It is spicy. Pan-fried",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 8,
        name: "Butter Chicken Curry",
        description: "Tandoori chicken tikka pieces are cooked in a buttery gravy and our special andra spice mix. This is a moderately spicy curry and will serve two.",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 9,
        name: "Lollipop Biryani",
        description: "3 pieces of lollypop are freshly fried with our andra spice mix and served with this biryani. It is slightly spicy and will serve two people.",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 10,
        name: "Chicken Rayalaseema",
        description: "This dish has 7-8 boneless and with bone pieces cooked in a special andra, masala inspired from rayal seema. It is pretty spicy.",
        price: "₹ 349",
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
];

export default function TopDishesSection() {
    return (
        <section className="py-12 tablet:py-16 desktop:py-20 bg-white">
            <div className="section-container">
                {/* Content Grid */}
                <div className="flex flex-col desktop:flex-row gap-4 tablet:gap-5 desktop:gap-4">
                    {/* Left Section - Featured Card */}
                    <div className="desktop:flex-1">
                        <div className="relative bg-white rounded-xl overflow-hidden border border-[#E9EAEB] h-full min-h-[400px] tablet:min-h-[500px] desktop:h-[700px]">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src="/assets/homepage/images/top10.jpg"
                                    alt="Top Dishes"
                                    fill
                                    className="object-cover"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 tablet:p-8 desktop:p-8">
                                <div className="flex flex-col gap-4 tablet:gap-6 desktop:gap-8">
                                    <div className="flex flex-col gap-3 tablet:gap-4">
                                        <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-white leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2]">
                                            Craving&apos;s Permanent List<br />Our Top 10
                                        </h2>
                                        <p className="text-sm tablet:text-base desktop:text-base font-normal text-white leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6] opacity-90">
                                            When in doubt, trust the crowd! These are the most-ordered, most-loved dishes from our kitchen.
                                        </p>
                                    </div>
                                    <Button
                                        variant="default"
                                        size="md"
                                        className="self-start"
                                    >
                                        Order Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Scrollable Grid */}
                    <div className="desktop:flex-1 desktop:h-[700px] desktop:overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                            {DISHES_DATA.map((dish) => (
                                <DishCard
                                    key={dish.id}
                                    {...dish}
                                    variant="default"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

