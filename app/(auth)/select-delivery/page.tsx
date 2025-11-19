"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import StarRating from "@/components/ui/StarRating";

interface Outlet {
    name: string;
    rating: string;
    reviews: string;
    distance: string;
    available: boolean;
    icon: string;
}

interface SearchResult {
    name: string;
    address: string;
}

const outlets: Outlet[] = [
    {
        name: "Koramangala, Bengaluru",
        rating: "4.5",
        reviews: "58",
        distance: "5.9 km",
        available: true,
        icon: "/assets/profile/icons/Location.svg",
    },
    {
        name: "Indiranagar, Bengaluru",
        rating: "4.5",
        reviews: "58",
        distance: "4.9 km",
        available: true,
        icon: "/assets/profile/icons/Location.svg",
    },
    {
        name: "Jayanagar, Bengaluru",
        rating: "4.5",
        reviews: "58",
        distance: "6 km",
        available: true,
        icon: "/assets/profile/icons/Location.svg",
    },
    {
        name: "JP Nagar, Bengaluru",
        rating: "4.5",
        reviews: "58",
        distance: "3 km",
        available: true,
        icon: "/assets/profile/icons/Location.svg",
    },
    {
        name: "HSR Layout, Bengaluru",
        rating: "4.5",
        reviews: "58",
        distance: "8 km",
        available: false,
        icon: "/assets/profile/icons/Location.svg",
    },
];

// Mock search results - in real app, this would come from an API
const mockSearchResults: SearchResult[] = [
    {
        name: "Citi Hospital Chord Road",
        address: "2nd Block, Rajajinagar, Bengaluru, Karnataka 560010",
    },
    {
        name: "City Hospital SVG Nagar",
        address: "Govindaraja Nagar No 14/1, Priyasarshini Layout, 3rd Cross, Bengaluru, Karnataka",
    },
    {
        name: "City Hospital & Pharmacy",
        address: "Achutharaya Mudaliar Rd, Frazer Town, Bengaluru, Karnataka",
    },
    {
        name: "South City Hospital",
        address: "Rashtriya Vidyalaya Rd, near Lalbagh West Gate, Upparpet, Bengaluru, Karnataka",
    },
];

export default function SelectDeliveryPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (value.trim()) {
            setIsSearching(true);
            // Filter mock results based on search query
            const filtered = mockSearchResults.filter(
                (result) =>
                    result.name.toLowerCase().includes(value.toLowerCase()) ||
                    result.address.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    };

    const handleUseCurrentLocation = () => {
        // In real app, this would get user's current location
        // For now, just navigate to home
        router.push("/home");
    };

    const handleSelectLocation = () => {
        // In real app, this would save the selected location
        // For now, just navigate to home
        router.push("/home");
    };

    return (
        <div className="section-container flex min-h-screen items-center justify-center py-12 tablet:py-16">
            <div className="flex flex-col w-full max-w-[648px] items-start gap-8 px-4 tablet:px-0">
                <div className="flex flex-col items-start gap-6 w-full">
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex flex-col items-start gap-3 flex-1">
                            <h1 className="text-2xl font-semibold text-midnight">
                                Select Delivery Location
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 w-full">
                        <div className="relative w-full">
                            <Image
                                src="/assets/navbar/icons/Search.svg"
                                alt="Search icon"
                                width={20}
                                height={20}
                                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search for area, street name..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full rounded-xl border-none bg-gray-100 px-4 py-2 pl-10 text-black focus:outline-none placeholder:text-gray-500"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            onClick={handleUseCurrentLocation}
                            className="inline-flex items-center justify-center gap-1 h-auto p-0"
                        >
                            <Image
                                src="/assets/signin-signup/icons/MyLocation.svg"
                                alt="My location"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                            <span className="text-gray-600 text-xs font-semibold whitespace-nowrap">
                                Use current location
                            </span>
                        </Button>
                    </div>
                </div>

                {!isSearching ? (
                    <div className="flex flex-col items-start gap-3 w-full">
                        <p className="text-base font-normal text-gray-500">
                            Our other outlets around you
                        </p>
                        <div className="flex flex-col items-start gap-1 w-full">
                            <div className="flex flex-wrap items-start gap-3 w-full">
                                {outlets.map((outlet, index) => (
                                    <Card
                                        key={index}
                                        className={`flex w-[318px] items-start gap-2 p-3 bg-white rounded-xl border border-gray-200 ${!outlet.available
                                            ? "cursor-not-allowed opacity-60"
                                            : "cursor-pointer hover:border-gray-300"
                                            }`}
                                        onClick={() =>
                                            outlet.available && handleSelectLocation()
                                        }
                                    >
                                        <CardContent className="flex items-start gap-2 p-0 w-full">
                                            <Image
                                                src={outlet.icon}
                                                alt="Location"
                                                width={20}
                                                height={20}
                                                className="w-5 h-5 flex-shrink-0"
                                            />
                                            <div className="flex flex-col items-start justify-center gap-2 flex-1">
                                                <h3
                                                    className={`w-full text-base font-semibold text-midnight tracking-normal whitespace-nowrap overflow-hidden text-ellipsis ${!outlet.available ? "opacity-30" : ""
                                                        }`}
                                                >
                                                    {outlet.name}
                                                </h3>
                                                <div
                                                    className={`inline-flex items-center gap-2 ${!outlet.available ? "opacity-30" : ""
                                                        }`}
                                                >
                                                    <div className="inline-flex h-5 items-center gap-1">
                                                        <StarRating
                                                            rating={parseFloat(outlet.rating)}
                                                            variant="single"
                                                            size="sm"
                                                        />
                                                        <span className="text-sm font-normal text-midnight tracking-normal whitespace-nowrap">
                                                            ({outlet.reviews})
                                                        </span>
                                                    </div>
                                                    <div className="w-1 h-1 bg-gray-400 rounded-sm" />
                                                    <span className="text-sm font-normal text-midnight tracking-normal whitespace-nowrap">
                                                        {outlet.distance}
                                                    </span>
                                                </div>
                                                {!outlet.available && (
                                                    <p className="text-sm font-normal text-hotJazz tracking-normal">
                                                        Currently not deliverable
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {searchResults.length > 0 ? (
                            <div className="flex flex-col items-start gap-3 w-full">
                                <p className="text-base font-normal text-gray-500">Search results</p>
                                <div className="flex flex-col items-start gap-1 w-full">
                                    {searchResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 w-full p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={handleSelectLocation}
                                        >
                                            <Image
                                                src="/assets/profile/icons/Location.svg"
                                                alt="Location"
                                                width={20}
                                                height={20}
                                                className="w-5 h-5 flex-shrink-0 mt-0.5"
                                            />
                                            <div className="flex flex-col items-start gap-1 flex-1">
                                                <h3 className="w-full text-base font-semibold text-midnight tracking-normal overflow-hidden text-ellipsis line-clamp-1">
                                                    {result.name}
                                                </h3>
                                                <p className="w-full text-sm font-normal text-gray-600 tracking-normal">
                                                    {result.address}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-6 w-full py-12">
                                <Image
                                    src="/assets/menu/icons/sentiment_dissatisfied.svg"
                                    alt="Sad face icon"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12"
                                />

                                <div className="flex flex-col items-center gap-4 w-full">
                                    <div className="flex flex-col items-center gap-2 w-full">
                                        <p className="font-normal text-gray-900 text-lg text-center tracking-[0] leading-[normal]">
                                            Our aroma can travel miles... sadly, our delivery can&apos;t
                                            (yet)!
                                        </p>
                                        <p className="w-full max-w-[410px] font-normal text-gray-500 text-base text-center tracking-[0] leading-[normal]">
                                            We don&apos;t deliver to this location yet, but never say never,
                                            we&apos;re expanding our reach!
                                        </p>
                                    </div>
                                    <p className="font-normal text-gray-500 text-xs text-center tracking-[0] leading-[normal]">
                                        *We are currently able to spread smiles upto 5 kms from your
                                        nearest Meghana Outlet.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="w-full h-px bg-gray-200" />

                <Alert className="flex items-start gap-2 p-4 w-full bg-[#e6f4ff] rounded-xl border border-solid border-[#86b8ee]">
                    <Image
                        src="/assets/signin-signup/icons/Info.svg"
                        alt="Info"
                        width={16}
                        height={16}
                        className="w-4 h-4 flex-shrink-0"
                    />
                    <AlertDescription className="flex-1 text-base font-normal text-midnight tracking-normal">
                        <span className="text-base font-normal text-midnight">
                            We need your current location to identify your nearest outlet and
                            ensure a smooth ordering journey for you.{" "}
                        </span>
                        <span className="font-bold">🤤</span>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
}

