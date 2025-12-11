"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { AddressService } from "@/services/address.service";
import type { Address } from "@/services/address.service";
import {
    ADDRESS_TYPE_ICON_MAP,
    formatAddress,
    type AddressItem,
    type AddressType,
} from "../address/data";

export default function AddressTab() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch addresses from API
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setIsLoading(true);
                const response = await AddressService.getAddresses();

                // Map API response to UI format
                const mappedAddresses: AddressItem[] = response.addresses.map((addr) => ({
                    id: addr.id, // Keep as string (UUID) from API
                    label: addr.label,
                    type: addr.address_type.toLowerCase() === 'work' ? 'office' : addr.address_type.toLowerCase() as AddressType,
                    houseNumber: addr.house_flat_door_number,
                    street: addr.street_locality_area,
                    landmark: addr.landmark,
                    city: addr.city,
                    pincode: addr.pincode,
                }));

                setAddresses(mappedAddresses);
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
                toast.error("Failed to load addresses");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    const handleDelete = async (id: string | number) => {
        const address = addresses.find((addr) => addr.id === id);
        const addressLabel = address?.label || "this address";

        toast.warning("Delete Address", {
            description: `Are you sure you want to delete ${addressLabel}? This action cannot be undone.`,
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await AddressService.deleteAddress(String(id));
                        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
                        toast.success("Address deleted successfully!");
                    } catch (error: any) {
                        console.error("Failed to delete address:", error);

                        let errorMessage = "Failed to delete address";
                        if (error.response?.data?.message) {
                            const msg = error.response.data.message;
                            errorMessage = Array.isArray(msg) ? msg.join(", ") : msg;
                        } else if (error.message) {
                            errorMessage = error.message;
                        }

                        toast.error(errorMessage);
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
            duration: Infinity, // Keep it open until user clicks
        });
    };

    const handleEdit = (id: string | number) => {
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
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader message="Loading addresses..." />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="rounded-xl border border-gray-200 bg-white"
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
                                        className="text-sm font-semibold text-tango hover:underline cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(address.id)}
                                        className="text-sm font-semibold text-tango hover:underline cursor-pointer"
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
            )}
        </div>
    );
}
