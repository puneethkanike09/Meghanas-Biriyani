import Image from "next/image";

const STORY_PARAGRAPHS = [
    "Meghana Foods began its flavorful journey in 2007, when the first restaurant opened its doors in Koramangala, Bengaluru. What started as a passion to bring authentic Andhra-style Hyderabadi biryani to the city soon grew into a culinary movement loved by millions.",
    "Over the years, Meghana Foods has expanded to 9 restaurants and 6 cloud kitchens across Bengaluru, each one carrying forward the legacy of bold flavors, rich aroma, and heartfelt hospitality. From day one, our commitment has been simple — serve exceptional biryani that feels both familiar and unforgettable.",
];

const STORY_QUOTE =
    "Meghana Foods is also credited with a milestone that changed Bengaluru’s food culture. We invented the iconic Chicken Boneless Biryani, a dish that is now synonymous with Namma Bengaluru’s biryani scene.";

export default function StorySection() {
    return (
        <section className="py-16 tablet:py-20 desktop:py-24 bg-white">
            <div className="section-container flex flex-col gap-12 tablet:gap-24">
                <div className="max-w-3xl desktop:pl-36">
                    <h2 className="text-2xl tablet:text-3xl desktop:text-[32px] font-semibold text-midnight leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2] mb-4">
                        Our Story
                    </h2>
                    <div className="flex flex-col gap-4">
                        {STORY_PARAGRAPHS.map(paragraph => (
                            <p
                                key={paragraph}
                                className="text-base tablet:text-lg text-grey-500 leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6]"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                <figure className="relative w-full rounded-[36px] overflow-hidden">
                    <Image
                        src="/assets/about/images/ourStory.jpg"
                        alt="Signature Meghana Foods dishes"
                        width={1312}
                        height={720}
                        className="w-full h-auto object-cover"
                        priority
                    />
                </figure>
            </div>
        </section>
    );
}


