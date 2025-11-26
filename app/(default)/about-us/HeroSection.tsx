import Image from "next/image";
export default function AboutHeroSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/homepage/images/heroBg.png"
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="section-container pb-8 tablet:pb-10 desktop:pb-12 pt-24 tablet:pt-28 desktop:pt-32">
                <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 items-center">
                    <div className="text-white z-10">
                        <h1 className="text-3xl tablet:text-4xl desktop:text-[56px] font-normal leading-[1.2] tablet:leading-[1.2] desktop:leading-[1.1]">
                            <span className="block">More Than Food.</span>
                            <span className="block">A Flavourful Tradition.</span>
                        </h1>
                        <p className="mt-4 text-base tablet:mt-5 tablet:text-lg desktop:mt-6 desktop:text-[18px] max-w-[474px] font-normal leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6] text-white">
                            Discover the journey behind the biryani Bengaluru can’t stop talking about.
                        </p>

                    </div>

                    <div className="relative h-[320px] tablet:h-[420px] desktop:mt-0 desktop:h-[589px] z-10">
                        <Image
                            src="/assets/homepage/images/hero.png"
                            alt="Founders celebrating Meghana Foods"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}


