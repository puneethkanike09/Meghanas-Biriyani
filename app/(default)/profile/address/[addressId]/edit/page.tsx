"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import AddressForm from "../../components/AddressForm";
import Loader from "@/components/ui/Loader";
import { AddressService } from "@/services/address.service";
import type { AddressItem, AddressType } from "../../data";

export default function EditAddressPage() {
    const params = useParams();
    const router = useRouter();
    const addressId = params.addressId as string;
    const [address, setAddress] = useState<AddressItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAddress = async () => {
            if (!addressId) {
                router.push("/profile/address");
                return;
            }

            try {
                setIsLoading(true);
                const response = await AddressService.getAddresses();

                // Find the address with matching ID
                const foundAddress = response.addresses.find((addr) => addr.id === addressId);

                if (!foundAddress) {
                    toast.error("Address not found");
                    router.push("/profile/address");
                    return;
                }

                // Map API address format to AddressItem format
                const mappedAddress: AddressItem = {
                    id: foundAddress.id,
                    label: foundAddress.label,
                    type: (foundAddress.address_type.toLowerCase() === 'work' ? 'office' : foundAddress.address_type.toLowerCase()) as AddressType,
                    houseNumber: foundAddress.house_flat_door_number,
                    street: foundAddress.street_locality_area,
                    landmark: foundAddress.landmark,
                    city: foundAddress.city,
                    pincode: foundAddress.pincode,
                };

                setAddress(mappedAddress);
            } catch (error) {
                console.error("Failed to fetch address:", error);
                toast.error("Failed to load address");
                router.push("/profile/address");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, [addressId, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader message="Loading address..." />
            </div>
        );
    }

    if (!address) {
        return null; // Will redirect in useEffect
    }

    return <AddressForm mode="edit" address={address} />;
}

