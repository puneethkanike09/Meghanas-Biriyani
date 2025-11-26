"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const FOUNDER = {
    name: "Mr. M. Mansoor Ali",
    role: "Co-Founder",
    description:
        "A culinary enthusiast with a deep love for traditional Andhra flavors, Mr. Ali played a key role in defining the signature taste and essence of Meghana Foods. His commitment to authenticity remains at the heart of every meal we serve.",
    imageSrc: "/assets/homepage/images/top10.jpg",
};

const THUMBNAIL_IMAGES = [
    {
        src: "/assets/homepage/images/top10.jpg",
        alt: "Founder portrait 1",
    },
    {
        src: "/assets/homepage/images/SpecialOffers.jpg",
        alt: "Founder portrait 2",
    },
    {
        src: "/assets/homepage/images/hero.png",
        alt: "Founder portrait 3",
    },
];

export default function FounderSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const transitionTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (transitionTimeout.current) {
                clearTimeout(transitionTimeout.current);
            }
        };
    }, []);

    const handleThumbnailClick = (index: number) => {
        if (index === activeIndex) return;
        if (transitionTimeout.current) {
            clearTimeout(transitionTimeout.current);
        }

        setIsTransitioning(true);
        transitionTimeout.current = setTimeout(() => {
            setActiveIndex(index);
            setIsTransitioning(false);
        }, 200);
    };

    const activeImage = THUMBNAIL_IMAGES[activeIndex];

    return (
        <section className="py-16 tablet:py-20 desktop:py-24 bg-white">
            <div className="section-container flex flex-col items-center gap-10 tablet:gap-12 desktop:gap-16">
                <header className="flex flex-col items-center text-center gap-3 max-w-[648px]">
                    <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-midnight leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2]">
                        Our Founders
                    </h2>
                    <p className="text-base tablet:text-lg text-grey-500 leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6]">
                        Meghana Foods was built by three passionate visionaries
                    </p>
                </header>

                <div className="flex flex-col desktop:flex-row items-stretch gap-8 w-full max-w-[1090px]">
                    <div className="relative w-full desktop:w-[427px] h-[400px] tablet:h-[450px] desktop:h-[480px] overflow-hidden rounded-2xl">
                        <Image
                            key={activeImage.src}
                            src={activeImage.src}
                            alt={activeImage.alt}
                            fill
                            className={`object-cover transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
                            sizes="(min-width: 1280px) 427px, (min-width: 768px) 450px, 100vw"
                            priority
                        />
                    </div>

                    <div className="flex flex-col justify-end gap-10 tablet:gap-20 w-full desktop:w-[631px]">
                        <div className="flex flex-col gap-5">
                            <div>
                                <h3 className="text-xl tablet:text-2xl font-semibold text-midnight leading-[1.3]">
                                    {FOUNDER.name}
                                </h3>
                                <p className="text-base text-grey-600 leading-[1.4]">{FOUNDER.role}</p>
                            </div>
                            <p className="text-base tablet:text-lg font-semibold italic text-midnight leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6]">
                                {FOUNDER.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {THUMBNAIL_IMAGES.map((image, index) => {
                                const isActive = index === activeIndex;

                                return (
                                    <button
                                        key={image.alt}
                                        type="button"
                                        onClick={() => handleThumbnailClick(index)}
                                        className={`relative w-20 h-20 tablet:w-24 tablet:h-24 rounded-xl overflow-hidden transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 cursor-pointer ${isActive ? "ring-2 ring-orange-500 ring-offset-0 ring-offset-white" : "ring-0"}`}
                                        aria-label={`Show ${image.alt}`}
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                            priority={isActive}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


