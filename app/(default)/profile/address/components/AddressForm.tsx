"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RadioCard from "@/components/ui/RadioCard";
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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // In a real application we would persist the form data.
        // For now, redirect back to the address list.
        router.push("/profile/address");
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="w-full rounded-2xl bg-white shadow-sm">
            <div className="mx-auto flex w-full max-w-[648px] flex-col gap-6 px-4 py-6 tablet:px-6 desktop:px-10">
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-midnight"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
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
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <label htmlFor="street" className="text-sm font-medium text-gray-700">
                                Street / Locality / Area
                            </label>
                            <Input
                                id="street"
                                name="street"
                                value={formValues.street}
                                onChange={handleFieldChange("street")}
                                placeholder="e.g., 6th Cross, Koramangala"
                                required
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
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                                    City
                                </label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formValues.city}
                                    onChange={handleFieldChange("city")}
                                    placeholder="e.g., Bengaluru"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                                Pincode / ZIP code
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
                            />
                        </div>

                        <div className="grid gap-2">
                            <span className="text-sm font-medium text-gray-700">Address type</span>
                            <div className="flex flex-col flex-wrap gap-3 tablet:flex-row tablet:gap-4">
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

                    <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-end">
                        <Button
                            type="button"
                            variant="neutral"
                            className="w-full tablet:w-auto"
                            onClick={handleBack}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="w-full tablet:w-auto">
                            {isEdit ? "Update Address" : "Save Address"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

