"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500">
      <div className="absolute inset-0 bg-black/10 z-0" />

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              Authentic South Indian Cuisine
            </h1>
            <p className="text-xl opacity-90">
              Experience the rich flavors of traditional Indian food,
              delivered fresh to your doorstep
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                View Menu
              </button>
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Order Now
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-square">
              <Image
                src="/biriyani-hero.jpg"
                alt="Delicious Biriyani"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24">
                <Image
                  src="/leaf1.png"
                  alt="Decorative leaf"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24">
                <Image
                  src="/leaf2.png"
                  alt="Decorative leaf"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}