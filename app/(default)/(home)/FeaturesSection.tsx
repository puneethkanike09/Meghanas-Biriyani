"use client";

import {
    SparklesIcon,
    ClockIcon,
    CreditCardIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";

const FEATURES = [
    {
        id: 1,
        icon: SparklesIcon,
        title: "Always Fresh",
    },
    {
        id: 2,
        icon: ClockIcon,
        title: "Fast Delivery",
    },
    {
        id: 3,
        icon: CreditCardIcon,
        title: "Secure Payment",
    },
    {
        id: 4,
        icon: PhoneIcon,
        title: "Support Centre",
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-8 tablet:py-10 desktop:py-12 bg-white">
            <div className="section-container">
                <div className="grid grid-cols-2 tablet:grid-cols-4 gap-6 tablet:gap-8 desktop:gap-12 justify-items-center">
                    {FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="flex flex-col tablet:flex-row items-center justify-center gap-3 tablet:gap-4"
                            >
                                <Icon className="w-6 h-6 tablet:w-7 tablet:h-7 desktop:w-8 desktop:h-8 text-midnight flex-shrink-0" />
                                <h3 className="text-sm tablet:text-base desktop:text-[22px] font-normal text-midnight text-center leading-[1.4] tablet:leading-[1.4] desktop:leading-[1.3]">
                                    {feature.title}
                                </h3>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

