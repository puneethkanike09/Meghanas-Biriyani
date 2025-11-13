"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
    ADDRESS_TYPE_ICON_MAP,
    INITIAL_ADDRESSES,
    formatAddress,
    type AddressItem,
} from "../address/data";

export default function AddressTab() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<AddressItem[]>(() =>
        INITIAL_ADDRESSES.map((address) => ({ ...address }))
    );

    const handleDelete = (id: number) => {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    };

    const handleEdit = (id: number) => {
        router.push(`/profile/address/${id}/edit`);
    };

    const handleAdd = () => {
        router.push("/profile/address/new");
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
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                        <div className="flex flex-col gap-4 p-4">
                            {/* Address Content */}
                            <div className="flex items-start gap-3">
                                <Image
                                    src={ADDRESS_TYPE_ICON_MAP[address.type].src}
                                    alt={ADDRESS_TYPE_ICON_MAP[address.type].alt}
                                    width={20}
                                    height={20}
                                    className="mt-0.5"
                                />
                                <div className="flex flex-1 min-w-0 flex-col gap-2">
                                    <h3 className="text-base font-semibold text-midnight">
                                        {address.label}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-600">
                                        {formatAddress(address)}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-start gap-4 pl-9">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(address.id)}
                                    className="text-sm font-semibold text-tango hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
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
                <div className="flex min-h-[129px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <div className="text-base font-semibold text-midnight">
                            Add New Address
                        </div>
                        <Button
                            onClick={handleAdd}
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
