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
        if (accessToken) {
            const expirationDate = getTokenExpiration(accessToken);
            console.log('🔑 Access Token Info:');
            console.log('  Token:', accessToken.substring(0, 20) + '...');
            console.log('  Expires at:', expirationDate?.toLocaleString() || 'Unknown');
            console.log('  Time remaining:', expirationDate ? Math.floor((expirationDate.getTime() - Date.now()) / 1000 / 60) + ' minutes' : 'Unknown');
        } else {
            console.log('🔑 No access token found');
        }
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

