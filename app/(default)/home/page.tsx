"use client";

import { useState } from "react";
import HeroSection from "../(home)/HeroSection";
import FeaturesSection from "../(home)/FeaturesSection";
import VibeSection from "../(home)/VibeSection";
import CategoriesSection from "../(home)/CategoriesSection";
import BannerSection from "../(home)/BannerSection";
import TestimonialsSection from "../(home)/TestimonialsSection";
import TopDishesSection from "../(home)/TopDishesSection";
import StartersSection from "../(home)/StartersSection";
import FounderSection from "../about-us/FounderSection";

export default function HomePage() {
    const [cart, setCart] = useState<Record<number, number>>({});

    const handleAddToCart = (itemId: number) => {
        setCart(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    };

    const handleUpdateQuantity = (itemId: number, change: number) => {
        setCart(prev => {
            const newQuantity = (prev[itemId] || 0) + change;
            if (newQuantity <= 0) {
                if (!(itemId in prev)) {
                    return prev;
                }
                const updatedCart = { ...prev };
                delete updatedCart[itemId];
                return updatedCart;
            }
            return {
                ...prev,
                [itemId]: newQuantity
            };
        });
    };

    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <VibeSection />
            <CategoriesSection
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
            />
            <BannerSection />
            <TopDishesSection
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
            />
            <StartersSection
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
            />
            <BannerSection />
            <TestimonialsSection />
        </>
    );
}

