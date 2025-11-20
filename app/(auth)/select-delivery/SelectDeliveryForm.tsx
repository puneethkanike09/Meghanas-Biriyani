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

export default function SelectDeliveryForm() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (value.trim()) {
            setIsSearching(true);
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
        router.push("/home");
    };

    const handleSelectLocation = () => {
        router.push("/home");
    };

    return (
        <div className="mx-auto flex w-full max-w-[648px] flex-col gap-8">
            <div className="flex w-full flex-col items-start gap-6">
                <div className="flex w-full items-center gap-3">
                    <div className="flex flex-1 flex-col items-start gap-3">
                        <h1 className="text-2xl font-semibold text-midnight">
                            Select Delivery Location
                        </h1>
                    </div>
                </div>

                <div className="flex w-full flex-col items-start gap-2">
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
                            className="w-full rounded-xl border-none bg-gray-100 px-4 py-2 pl-10 text-black placeholder:text-gray-500 focus:outline-none"
                        />
                    </div>

                    <Button
                        variant="ghost"
                        onClick={handleUseCurrentLocation}
                        className="inline-flex h-auto items-center justify-center gap-1 p-0"
                    >
                        <Image
                            src="/assets/signin-signup/icons/MyLocation.svg"
                            alt="My location"
                            width={20}
                            height={20}
                            className="h-5 w-5"
                        />
                        <span className="whitespace-nowrap text-xs font-semibold text-gray-600">
                            Use current location
                        </span>
                    </Button>
                </div>
            </div>

            {!isSearching ? (
                <div className="flex w-full flex-col items-start gap-3">
                    <p className="text-base font-normal text-gray-500">
                        Our other outlets around you
                    </p>
                    <div className="flex w-full flex-col items-start gap-1">
                        <div className="flex w-full flex-wrap items-start gap-3">
                            {outlets.map((outlet, index) => (
                                <Card
                                    key={index}
                                    className={`flex w-[318px] items-start gap-2 rounded-xl border border-gray-200 bg-white p-3 ${!outlet.available
                                        ? "cursor-not-allowed opacity-60"
                                        : "cursor-pointer hover:border-gray-300"
                                        }`}
                                    onClick={() =>
                                        outlet.available && handleSelectLocation()
                                    }
                                >
                                    <CardContent className="flex w-full items-start gap-2 p-0">
                                        <Image
                                            src={outlet.icon}
                                            alt="Location"
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 flex-shrink-0"
                                        />
                                        <div className="flex flex-1 flex-col items-start justify-center gap-2">
                                            <h3
                                                className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold text-midnight tracking-normal ${!outlet.available ? "opacity-30" : ""
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
                                                <div className="h-1 w-1 rounded-sm bg-gray-400" />
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
                        <div className="flex w-full flex-col items-start gap-3">
                            <p className="text-base font-normal text-gray-500">Search results</p>
                            <div className="flex w-full flex-col items-start gap-1">
                                {searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="flex w-full cursor-pointer items-start gap-2 rounded-lg p-3 transition-colors hover:bg-gray-50"
                                        onClick={handleSelectLocation}
                                    >
                                        <Image
                                            src="/assets/profile/icons/Location.svg"
                                            alt="Location"
                                            width={20}
                                            height={20}
                                            className="mt-0.5 h-5 w-5 flex-shrink-0"
                                        />
                                        <div className="flex flex-1 flex-col items-start gap-1">
                                            <h3 className="w-full overflow-hidden text-ellipsis text-base font-semibold text-midnight tracking-normal line-clamp-1">
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
                        <div className="flex w-full flex-col items-center justify-center gap-6 py-12">
                            <Image
                                src="/assets/menu/icons/sentiment_dissatisfied.svg"
                                alt="Sad face icon"
                                width={48}
                                height={48}
                                className="h-12 w-12"
                            />

                            <div className="flex w-full flex-col items-center gap-4">
                                <div className="flex w-full flex-col items-center gap-2">
                                    <p className="text-center text-lg font-normal text-gray-900">
                                        Our aroma can travel miles... sadly, our delivery can&apos;t
                                        (yet)!
                                    </p>
                                    <p className="w-full max-w-[410px] text-center text-base font-normal text-gray-500">
                                        We don&apos;t deliver to this location yet, but never say never,
                                        we&apos;re expanding our reach!
                                    </p>
                                </div>
                                <p className="text-center text-xs font-normal text-gray-500">
                                    *We are currently able to spread smiles upto 5 kms from your
                                    nearest Meghana Outlet.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="h-px w-full bg-gray-200" />

            <Alert className="flex w-full items-start gap-2 rounded-xl border border-solid border-[#86b8ee] bg-[#e6f4ff] p-4">
                <Image
                    src="/assets/signin-signup/icons/Info.svg"
                    alt="Info"
                    width={16}
                    height={16}
                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                />
                <AlertDescription className="flex-1 text-base font-normal text-midnight tracking-normal">
                    <span>
                        We need your current location to identify your nearest outlet and ensure a
                        smooth ordering journey for you.{" "}
                    </span>
                    <span className="font-bold">🤤</span>
                </AlertDescription>
            </Alert>
        </div>
    );
}


