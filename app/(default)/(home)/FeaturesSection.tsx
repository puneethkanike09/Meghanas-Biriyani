"use client";

import Image from "next/image";

const FEATURES = [
    {
        id: 1,
        icon: "/assets/homepage/icons/Leaf.svg",
        title: "Always Fresh",
        alt: "Fresh ingredients icon",
    },
    {
        id: 2,
        icon: "/assets/homepage/icons/Clock.svg",
        title: "Fast Delivery",
        alt: "Clock icon",
    },
    {
        id: 3,
        icon: "/assets/homepage/icons/Payment.svg",
        title: "Secure Payment",
        alt: "Secure payment icon",
    },
    {
        id: 4,
        icon: "/assets/homepage/icons/Call.svg",
        title: "Support Centre",
        alt: "Customer support icon",
    },
];

export default function FeaturesSection() {
    return (
        <section className="bg-white py-8 tablet:py-10 desktop:py-12">
            <div className="section-container">
                <div className="grid grid-cols-2 justify-items-center gap-6 tablet:grid-cols-4 tablet:gap-8 desktop:gap-12">
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.id}
                            className="flex flex-col items-center justify-center gap-3 tablet:flex-row tablet:gap-4"
                        >
                            <Image
                                src={feature.icon}
                                alt={feature.alt}
                                width={20}
                                height={20}
                                className="h-5 w-5 tablet:h-6 tablet:w-6 desktop:h-7 desktop:w-7"
                            />
                            <h3 className="text-center text-sm font-normal leading-[1.4] text-midnight tablet:text-base tablet:leading-[1.4] desktop:text-[22px] desktop:leading-[1.3]">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

