
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/homepage/images/heroBg.png"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative section-container pt-32 pb-16 tablet:pt-36 tablet:pb-16 desktop:pt-28 desktop:pb-16">
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white z-10">
            <h1 className="text-3xl tablet:text-4xl desktop:text-[56px] font-normal leading-[1.2] tablet:leading-[1.2] desktop:leading-[1.1]">
              Authentic South Indian Cuisine
            </h1>
            <p className="mt-4 text-base tablet:mt-5 tablet:text-lg desktop:mt-6 desktop:text-[18px] max-w-[474px] font-normal leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6] text-white">
              Experience the rich flavors of traditional Indian food, delivered fresh to your doorstep
            </p>

            {/* Buttons */}
            <div className="mt-6 tablet:mt-8 desktop:mt-10 flex flex-col tablet:flex-row gap-4 tablet:gap-5">
              <Link
                href="/menu"
                className="inline-flex h-10 items-center justify-center px-4 py-[10px] whitespace-nowrap rounded-[8px] font-semibold text-base text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm w-full tablet:w-auto"
              >
                View Menu
              </Link>
              <Link
                href="/orders"
                className="inline-flex h-10 items-center justify-center px-4 py-[10px] whitespace-nowrap rounded-[8px] font-semibold text-sm text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-gray-900 border border-gray-900 hover:bg-gray-800 shadow-sm w-full tablet:w-auto"
              >
                Order Now
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden desktop:block relative h-[589px] z-10">
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