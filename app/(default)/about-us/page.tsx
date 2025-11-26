import HeroSection from "./HeroSection";
import StorySection from "./StorySection";
import VisionMissionSection from "./VisionMissionSection";
import FounderSection from "./FounderSection";

export const metadata = {
    title: "About Us | Meghana Foods",
    description:
        "Discover the story behind Meghana Foods and meet the passionate founders shaping authentic Andhra flavors.",
};

export default function AboutUsPage() {
    return (
        <main className="bg-white">
            <HeroSection />
            <StorySection />
            <VisionMissionSection />
            <FounderSection />
        </main>
    );
}


