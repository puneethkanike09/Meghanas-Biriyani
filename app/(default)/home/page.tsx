"use client";

import { useEffect } from "react";
import { getTokenExpiration } from "@/lib/jwt-utils";
import { useAuthStore } from "@/store/useAuthStore";
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
    const { accessToken } = useAuthStore();

    useEffect(() => {
        // Token expiration is handled by the API client interceptor
    }, [accessToken]);

    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <VibeSection />
            <CategoriesSection />
            <BannerSection />
            <TopDishesSection />
            <StartersSection />
            <BannerSection />
            <TestimonialsSection />
        </>
    );
}

