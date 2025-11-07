"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative bg-primary overflow-hidden">
      <div className="section-container pt-32 pb-16 tablet:pt-36 tablet:pb-16 desktop:pt-36 desktop:pb-16">
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 tablet:space-y-8 desktop:space-y-10 z-10">
            <h1 className="text-3xl tablet:text-4xl desktop:text-[56px] font-normal leading-[1.2] tablet:leading-[1.2] desktop:leading-[1.1]">
              Authentic South Indian Cusine
            </h1>
            <p className="text-base tablet:text-lg desktop:text-[18px] font-normal leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.7] opacity-90">
              Experience the rich flavors of traditional Indian food, delivered fresh to your doorstep
            </p>

            {/* Buttons */}
            <div className="flex flex-col tablet:flex-row gap-4 tablet:gap-6">
              <Button
                variant="default"
                size="lg"
                className="w-full tablet:w-auto"
              >
                View Menu
              </Button>
              <Button
                variant="dark"
                size="lg"
                className="w-full tablet:w-auto"
              >
                Order Now
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden desktop:block relative h-[500px] z-10">
            <Image
              src="/assets/homepage/images/hero.png"
              alt="Delicious South Indian Cuisine"
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