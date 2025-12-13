"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RadioCard from "@/components/ui/RadioCard";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { AddressService } from "@/services/address.service";
import LocationMap from "@/components/LocationMap";
import {
    ADDRESS_TYPE_OPTIONS,
    type AddressItem,
    type AddressType,
} from "../data";

interface AddressFormProps {
    mode: "create" | "edit";
    address?: AddressItem;
}

interface AddressFormValues {
    label: string;
    houseNumber: string;
    street: string;
    landmark: string;
    city: string;
    pincode: string;
    type: AddressType;
}

const DEFAULT_VALUES: AddressFormValues = {
    label: "",
    houseNumber: "",
    street: "",
    landmark: "",
    city: "",
    pincode: "",
    type: "home",
};

const CITY_OPTIONS = [
    { value: "", label: "Select City" },
    { value: "Bengaluru", label: "Bengaluru" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
];

export default function AddressForm({ mode, address }: AddressFormProps) {
    const router = useRouter();
    const isEdit = mode === "edit";
    const initialValues: AddressFormValues = address
        ? {
            label: address.label,
            houseNumber: address.houseNumber,
            street: address.street,
            landmark: address.landmark ?? "",
            city: address.city,
            pincode: address.pincode,
            type: address.type,
        }
        : DEFAULT_VALUES;

    const [formValues, setFormValues] = useState<AddressFormValues>(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mapPopulatedFields, setMapPopulatedFields] = useState<Set<string>>(new Set());
    const [isWithin5km, setIsWithin5km] = useState<boolean | null>(null);
    const [branchCode, setBranchCode] = useState<string>("");

    const handleFieldChange =
        (field: keyof AddressFormValues) =>
            (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                const { value } = event.target;
                setFormValues((prev) => ({
                    ...prev,
                    [field]: value,
                }));
            };

    const handleAddressTypeSelect = (value: AddressType) => {
        setFormValues((prev) => ({
            ...prev,
            type: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Map UI address types to API expected values
            const addressTypeMap: Record<AddressType, 'HOME' | 'WORK' | 'OTHER'> = {
                home: 'HOME',
                office: 'WORK',
                other: 'OTHER'
            };

            const addressData = {
                label: formValues.label,
                houseFlatDoorNumber: formValues.houseNumber,
                streetLocalityArea: formValues.street,
                landmark: formValues.landmark || undefined,
                city: formValues.city,
                pincode: formValues.pincode,
                addressType: addressTypeMap[formValues.type],
            };

            if (isEdit && address?.id) {
                // Update existing address
                await AddressService.updateAddress(String(address.id), addressData);
                toast.success("Address updated successfully!");
            } else {
                // Create new address
                await AddressService.addAddress(addressData);
                toast.success("Address added successfully!");
            }

            router.push("/profile/address");
        } catch (error: any) {
            console.error(`Failed to ${isEdit ? 'update' : 'add'} address:`, error);

            let errorMessage = `Failed to ${isEdit ? 'update' : 'add'} address`;
            if (error.response?.data?.message) {
                const msg = error.response.data.message;
                errorMessage = Array.isArray(msg) ? msg.join(", ") : msg;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleLocationChange = (location: {
        lat: number;
        lng: number;
        address?: {
            formatted_address: string;
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
            country?: string;
        };
        isWithin5km?: boolean;
        branchCode?: string;
    }) => {
        // Update delivery availability
        if (location.isWithin5km !== undefined) {
            setIsWithin5km(location.isWithin5km);
        }
        if (location.branchCode) {
            setBranchCode(location.branchCode);
        }

        if (location.address) {
            const populatedFields = new Set<string>();
            
            // Populate fields from map
            if (location.address.street) {
                setFormValues((prev) => ({
                    ...prev,
                    street: location.address!.street || prev.street,
                }));
                populatedFields.add('street');
            }
            
            if (location.address.city) {
                setFormValues((prev) => ({
                    ...prev,
                    city: location.address!.city || prev.city,
                }));
                populatedFields.add('city');
            }
            
            if (location.address.pincode) {
                setFormValues((prev) => ({
                    ...prev,
                    pincode: location.address!.pincode || prev.pincode,
                }));
                populatedFields.add('pincode');
            }
            
            setMapPopulatedFields(populatedFields);
        }
    };

    return (
        <div className="w-full  bg-white">
            <div className=" flex w-full max-w-[648px] flex-col gap-6 mx-auto">
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-midnight cursor-pointer"
                    suppressHydrationWarning
                >
                    <Image
                        src="/assets/profile/icons/ArrowLeft.svg"
                        alt="Back"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                    />
                    <span>Back</span>
                </button>

                <header className="w-full border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-semibold text-midnight">
                        {isEdit ? "Edit Address" : "Add New Address"}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Share the delivery address exactly as it appears to ensure timely deliveries.
                    </p>
                </header>

                <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Map Section */}
                    <LocationMap
                        onLocationChange={handleLocationChange}
                        height="400px"
                    />

                    <section className="grid gap-6">
                        <div className="grid gap-1.5">
                            <label htmlFor="label" className="text-sm font-medium text-gray-700">
                                Address label
                            </label>
                            <Input
                                id="label"
                                name="label"
                                value={formValues.label}
                                onChange={handleFieldChange("label")}
                                placeholder="e.g., Home, Parents' House"
                                required
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <label htmlFor="houseNumber" className="text-sm font-medium text-gray-700">
                                House / Flat / Door number
                            </label>
                            <Input
                                id="houseNumber"
                                name="houseNumber"
                                value={formValues.houseNumber}
                                onChange={handleFieldChange("houseNumber")}
                                placeholder="e.g., Flat 203, Green Residency"
                                required
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <label htmlFor="street" className="text-sm font-medium text-gray-700">
                                Street / Locality / Area
                                {mapPopulatedFields.has('street') && (
                                    <span className="ml-2 text-xs text-gray-500">(from map - editable)</span>
                                )}
                            </label>
                            <Input
                                id="street"
                                name="street"
                                value={formValues.street}
                                onChange={handleFieldChange("street")}
                                placeholder="e.g., 6th Cross, Koramangala"
                                required
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="grid gap-4 tablet:grid-cols-2">
                            <div className="grid gap-1.5">
                                <label htmlFor="landmark" className="text-sm font-medium text-gray-700">
                                    Landmark (optional)
                                </label>
                                <Input
                                    id="landmark"
                                    name="landmark"
                                    value={formValues.landmark}
                                    onChange={handleFieldChange("landmark")}
                                    placeholder="e.g., Near Forum Mall"
                                    suppressHydrationWarning
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                                    City
                                    {mapPopulatedFields.has('city') && (
                                        <span className="ml-2 text-xs text-gray-500">(from map)</span>
                                    )}
                                </label>
                                <div className="relative">
                                    <select
                                        id="city"
                                        name="city"
                                        value={formValues.city}
                                        onChange={handleFieldChange("city")}
                                        required
                                        disabled={mapPopulatedFields.has('city')}
                                        suppressHydrationWarning
                                        className={`w-full appearance-none rounded-lg border border-gray-300 px-3.5 py-2.5 text-base text-midnight transition focus:border-tango focus:outline-none focus:ring-2 focus:ring-tango/20 ${
                                            mapPopulatedFields.has('city') 
                                                ? 'bg-gray-100 cursor-not-allowed' 
                                                : 'bg-white'
                                        }`}
                                    >
                                        {CITY_OPTIONS.map((option) => (
                                            <option
                                                key={option.value || "placeholder"}
                                                value={option.value}
                                                disabled={option.value === ""}
                                                hidden={option.value === ""}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Image
                                        src="/assets/profile/icons/Chevron.svg"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                                Pincode / ZIP code
                                {mapPopulatedFields.has('pincode') && (
                                    <span className="ml-2 text-xs text-gray-500">(from map)</span>
                                )}
                            </label>
                            <Input
                                id="pincode"
                                name="pincode"
                                inputMode="numeric"
                                pattern="[0-9]+"
                                value={formValues.pincode}
                                onChange={handleFieldChange("pincode")}
                                placeholder="e.g., 560095"
                                required
                                disabled={mapPopulatedFields.has('pincode')}
                                className={mapPopulatedFields.has('pincode') ? 'bg-gray-100 cursor-not-allowed' : ''}
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="grid gap-2">
                            <span className="text-sm font-medium text-gray-700">Address type</span>
                            <div className="flex flex-wrap items-start gap-3 tablet:gap-4">
                                {ADDRESS_TYPE_OPTIONS.map((option) => (
                                    <RadioCard
                                        key={option.value}
                                        name="addressType"
                                        value={option.value}
                                        label={option.label}
                                        checked={formValues.type === option.value}
                                        onChange={() => handleAddressTypeSelect(option.value)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Delivery Availability Message */}
                    {isWithin5km === false && (
                        <Alert className="flex w-full items-start gap-2 rounded-xl border border-solid border-red-200 bg-red-50 p-4">
                            <Image
                                src="/assets/profile/icons/Location.svg"
                                alt="Warning"
                                width={20}
                                height={20}
                                className="h-5 w-5 shrink-0 mt-0.5"
                            />
                            <AlertDescription className="flex-1 text-base font-normal text-red-800 tracking-normal">
                                <p className="font-medium mb-1">Delivery not available</p>
                                <p className="text-sm text-red-600">
                                    We don't deliver to this location. Please select a different address within our delivery area.
                                </p>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col">
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="w-full" 
                            disabled={isSubmitting || isWithin5km === false}
                        >
                            {isSubmitting ? "Saving..." : (isEdit ? "Update Address" : "Save Address")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

