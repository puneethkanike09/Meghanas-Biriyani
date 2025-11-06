"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Button from "@/components/ui/Button";
import { StarIcon } from "@heroicons/react/24/solid";

const REVIEWS_DATA = [
    {
        id: 1,
        rating: 5,
        text: "I had heard a lot of praise about the Biryani served at Meghana Foods and made a point to visit this place on my visit to Bangalore. Being a foodie that I am, I came to this place on my very first night in Bangalore with a friend. Roadside two wheeler parking available.",
        author: "Ajay Supekar",
    },
    {
        id: 2,
        rating: 4,
        text: "Biryani was awesome - slightly spicy for a person like me but full of flavour ... the chicken legs were ok - would suggest stick to the biryani - that's anyway thier show stopper.",
        author: "Jaideep Pandit",
    },
    {
        id: 3,
        rating: 4,
        text: "Meghana Foods on Residency Road is a standout destination for lovers of authentic Indian cuisine. Specializing in Andhra-style dishes, this restaurant consistently delivers flavorful and well-spiced meals that keep patrons coming back for more.",
        author: "Pragath Sj",
    },
    {
        id: 4,
        rating: 5,
        text: "The ambience was great and the food was delicious. If you are a biryani lover, this is the place to be. The service was quick and the staff was very friendly. Highly recommended!",
        author: "Akash Kumar",
    },
    {
        id: 5,
        rating: 5,
        text: "Authentic South Indian flavors! The spices are perfectly balanced and every dish we ordered was absolutely delicious. The portion sizes are generous and worth every penny.",
        author: "Priya Sharma",
    },
    {
        id: 6,
        rating: 4,
        text: "Great food quality and taste. The biryani is aromatic and flavorful. Service could be faster during peak hours, but the wait is worth it for the authentic taste.",
        author: "Rahul Mehta",
    },
];

// Duplicate reviews for seamless infinite loop
const INFINITE_REVIEWS = [...REVIEWS_DATA, ...REVIEWS_DATA];

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    className={`w-4 h-4 tablet:w-[16px] tablet:h-[16px] desktop:w-5 desktop:h-5 ${star <= rating ? "text-primary" : "text-primary/30"
                        }`}
                />
            ))}
        </div>
    );
};

export default function TestimonialsSection() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1280);
        };

        checkDesktop();
        window.addEventListener("resize", checkDesktop);

        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            dragFree: false,
        },
        isDesktop
            ? [
                AutoScroll({
                    speed: 1,
                    startDelay: 0,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                }),
            ]
            : []
    );

    return (
        <section className="py-12 tablet:py-16 desktop:py-20 bg-[#FFF6F1]">
            <div className="section-container">
                {/* Header */}
                <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4 tablet:gap-6 mb-8 tablet:mb-10 desktop:mb-12">
                    <div>
                        <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-[#181D27] mb-2">
                            Your Opinion Matters
                        </h2>
                        <div className="flex items-center gap-1">
                            <StarRating rating={5} />
                            <div className="flex flex-row items-center gap-6">
                                <span className="text-xs tablet:text-sm desktop:text-[14px] font-regular text-[#181D27]">
                                    4.5
                                </span>
                                <span className="text-xs tablet:text-sm desktop:text-[14px] underline font-semibold text-[#181D27]">
                                    280 Reviews
                                </span>
                            </div>

                        </div>
                    </div>
                    <Button
                        size="md"
                        variant="default"
                        className="self-start tablet:self-auto"
                    >
                        Leave a Comment
                    </Button>
                </div>

                {/* Carousel */}
                <div className="overflow-hidden -mx-2 tablet:-mx-2.5 desktop:-mx-3" ref={emblaRef}>
                    <div className="flex">
                        {(isDesktop ? INFINITE_REVIEWS : REVIEWS_DATA).map((review, index) => (
                            <div
                                key={`${review.id}-${index}`}
                                className="flex-[0_0_100%] tablet:flex-[0_0_50%] desktop:flex-[0_0_33.333%] min-w-0 px-2 tablet:px-2.5 desktop:px-3"
                            >
                                <div className="bg-white rounded-xl p-5 tablet:p-6 desktop:p-6 h-full flex flex-col border border-[#E9EAEB]">
                                    {/* Review Text */}
                                    <p className="text-sm tablet:text-[15px] desktop:text-base text-[#414651] leading-relaxed mb-6 flex-grow">
                                        {review.text}
                                    </p>

                                    {/* Author and Rating */}
                                    <div className="flex flex-col gap-2">
                                        <StarRating rating={review.rating} />
                                        <span className="text-base tablet:text-[17px] desktop:text-lg font-semibold text-[#414651]">
                                            {review.author}
                                        </span>
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

