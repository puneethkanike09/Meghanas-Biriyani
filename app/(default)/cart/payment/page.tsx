"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CartProgress, { type CartProgressStep } from "../components/CartProgress";
import DeliveryAddressCard from "../components/DeliveryAddressCard";
import OrderSummary from "../components/OrderSummary";
import Button from "@/components/ui/Button";
import { INITIAL_ADDRESSES, type AddressItem } from "../../profile/address/data";

const PAYMENT_STEPS: CartProgressStep[] = [
    { number: 1, label: "Cart Confirmation", status: "completed" },
    { number: 2, label: "Delivery", status: "completed" },
    { number: 3, label: "Payment", status: "current" },
];

// Mock order data - in real app this would come from cart state/context
const ORDER_ITEMS = [
    { id: 1, name: "Chicken Biriyani", quantity: 2, price: 349, isVeg: false },
    { id: 2, name: "Paneer 65", quantity: 2, price: 249, isVeg: true },
    { id: 3, name: "Pepper Chicken", quantity: 2, price: 299, isVeg: false },
];

const COST_BREAKDOWN = [
    { label: "Item Total", value: 897, isBold: true, hasInfo: false },
    { label: "Restaurant Packaging Charges", value: 10, isBold: false, hasInfo: false },
    { label: "Delivery Fee", value: 35, isBold: false, hasInfo: true },
    { label: "Taxes", value: 10.47, isBold: false, hasInfo: true },
];

export default function PaymentPage() {
    const router = useRouter();
    const [addresses] = useState<AddressItem[]>(() => INITIAL_ADDRESSES);
    const [selectedAddressId] = useState<number | null>(1);

    const handleSelectAddress = () => {
        // Placeholder for payment method selection
    };

    const handleProceedToPay = () => {
        // Navigate to confirmation page after payment
        router.push("/cart/confirmation");
    };

    const totalPayable = COST_BREAKDOWN.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 tablet:pt-24 desktop:pt-28 pb-16">
                <div className="section-container flex flex-col gap-6">
                    <div className="sticky top-[96px] tablet:top-[120px] z-40 bg-white flex before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-160px] before:h-[200px] before:bg-white before:-z-10 tablet:before:top-[-160px] tablet:before:h-[220px] desktop:before:top-[-180px] desktop:before:h-[240px]">
                        <CartProgress steps={PAYMENT_STEPS} />
                    </div>

                    <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start">
                        {/* Payment Method Section */}
                        <div className="flex-1 space-y-6">
                            <header className="sticky top-[168px] tablet:top-[209px] z-30 bg-white py-3 border-b border-gray-200 before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-72px] before:h-[72px] before:bg-white before:-z-10">
                                <h1 className="text-xl font-semibold text-midnight">
                                    Choose Payment Method
                                </h1>
                            </header>

                            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                                {addresses.map((address) => (
                                    <DeliveryAddressCard
                                        key={address.id}
                                        address={address}
                                        isSelected={selectedAddressId === address.id}
                                        isDeliverable={address.id !== 2} // Office not deliverable for demo
                                        onSelect={handleSelectAddress}
                                    />
                                ))}

                                {/* Add New Address Card */}
                                <div className="flex min-h-[145px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
                                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                                        <div className="text-base font-semibold text-midnight">
                                            Add New Address
                                        </div>
                                        <Button
                                            onClick={() => router.push("/profile/address/new")}
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

                        {/* Order Summary Section */}
                        <div className="desktop:w-[316px] desktop:flex-shrink-0 desktop:sticky desktop:top-[209px]">
                            <OrderSummary
                                items={ORDER_ITEMS}
                                charges={COST_BREAKDOWN}
                                totalPayable={totalPayable}
                                onProceed={handleProceedToPay}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

