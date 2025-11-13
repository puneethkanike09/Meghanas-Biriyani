"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface Address {
    id: number;
    iconType: "home" | "office" | "location";
    title: string;
    address: string;
}

const addressesData: Address[] = [
    {
        id: 1,
        iconType: "home",
        title: "Koncept Nest",
        address: "A201, Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India.",
    },
    {
        id: 2,
        iconType: "office",
        title: "Office",
        address: "A201, Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India.",
    },
    {
        id: 3,
        iconType: "location",
        title: "Cousin's Place",
        address: "A201, Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India.",
    },
];

const addressIconMap: Record<Address["iconType"], { src: string; alt: string }> = {
    home: {
        src: "/assets/profile/icons/Home.svg",
        alt: "Home address",
    },
    office: {
        src: "/assets/profile/icons/Building.svg",
        alt: "Office address",
    },
    location: {
        src: "/assets/profile/icons/Location.svg",
        alt: "Saved location",
    },
};

export default function AddressTab() {
    const [addresses, setAddresses] = useState<Address[]>(addressesData);

    const handleDelete = (id: number) => {
        setAddresses(addresses.filter((addr) => addr.id !== id));
    };

    return (
        <div className="flex flex-col gap-6 py-6 tablet:py-6 desktop:py-0">
            {/* Header */}
            <header className="flex items-center justify-between py-3 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-midnight">
                    Manage Addresses
                </h1>
            </header>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm"
                    >
                        <div className="flex flex-col gap-4 p-4">
                            {/* Address Content */}
                            <div className="flex items-start gap-3">
                                <Image
                                    src={addressIconMap[address.iconType].src}
                                    alt={addressIconMap[address.iconType].alt}
                                    width={20}
                                    height={20}
                                    className="mt-0.5"
                                />
                                <div className="flex flex-col gap-2 flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-midnight">
                                        {address.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {address.address}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-start gap-4 pl-9">
                                <button className="text-sm font-semibold text-tango hover:underline">
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(address.id)}
                                    className="text-sm font-semibold text-tango hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Address Card */}
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[129px]">
                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <div className="text-base font-semibold text-midnight">
                            Add New Address
                        </div>
                        <Button
                            variant="primaryOutlined"
                            icon={
                                <Image
                                    src="/assets/profile/icons/Add.svg"
                                    alt="Add"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            }
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

