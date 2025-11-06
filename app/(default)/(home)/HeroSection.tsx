"use client";

import Button from "@/components/ui/Button";


export default function HeroSection() {
  return (
    <div className="relative flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500">
      <div className="absolute inset-0 bg-black/10 z-0" />

      <div className="section-container py-32 relative z-10">
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
              <Button variant="default" className="py-3">
                View Menu
              </Button>
              <Button variant="dark" className="py-3">
                Order Now
              </Button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}