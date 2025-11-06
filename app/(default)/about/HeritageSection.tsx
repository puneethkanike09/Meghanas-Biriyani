"use client";

import Image from "next/image";

export default function HeritageSection() {
    return (
        <section className="py-16">
            <div className="section-container">
                <div className="grid gap-8 items-center tablet:grid-cols-2 desktop:gap-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Our Heritage
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Founded in 2000, Meghana&apos;s Biriyani has been serving authentic South Indian
                            cuisine to food lovers across the city. What started as a small
                            family kitchen has grown into one of the most beloved restaurants
                            in the region.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            We take pride in our traditional recipes, passed down through
                            generations, and our commitment to using only the freshest,
                            highest-quality ingredients in every dish we prepare.
                        </p>
                    </div>
                    <div className="relative h-[400px] rounded-lg overflow-hidden">
                        <Image
                            src="/about-heritage.jpg"
                            alt="Our heritage"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
