"use client";

import { useState } from "react";
import Image from "next/image";

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

const getIcon = (type: string) => {
    switch (type) {
        case "home":
            return "🏠";
        case "office":
            return "🏢";
        case "location":
        default:
            return "📍";
    }
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
                            <div className="flex items-start gap-2">
                                <span className="text-2xl flex-shrink-0">
                                    {getIcon(address.iconType)}
                                </span>
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
                        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-tango shadow-sm transition-colors hover:bg-brand-50">
                            <Image
                                src="/assets/navbar/icons/Location.svg"
                                alt="Add"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                            <span className="text-sm font-semibold text-tango whitespace-nowrap">
                                Add
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

