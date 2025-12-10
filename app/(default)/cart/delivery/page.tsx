"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import CartProgress, { type CartProgressStep } from "../components/CartProgress";
import DeliveryAddressCard from "../components/DeliveryAddressCard";
import OrderSummary, { type OrderItem, type OrderCharge } from "../components/OrderSummary";
import Button from "@/components/ui/Button";
import { AddressService } from "@/services/address.service";
import { useCartStore } from "@/store/useCartStore";
import type { AddressItem, AddressType } from "../../profile/address/data";

const DELIVERY_STEPS: CartProgressStep[] = [
    { number: 1, label: "Cart Confirmation", status: "completed" },
    { number: 2, label: "Delivery", status: "current" },
    { number: 3, label: "Payment", status: "upcoming" },
];

export default function DeliveryPage() {
    const router = useRouter();
    const { items: cartItems, subtotal, tax, deliveryFee, total } = useCartStore();
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(null);

    // Fetch addresses from API
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setIsLoadingAddresses(true);
                const response = await AddressService.getAddresses();

                // Map API response to UI format
                const mappedAddresses: AddressItem[] = response.addresses.map((addr) => ({
                    id: addr.id, // Keep as string (UUID) from API
                    label: addr.label,
                    type: (addr.address_type.toLowerCase() === 'work' ? 'office' : addr.address_type.toLowerCase()) as AddressType,
                    houseNumber: addr.house_flat_door_number,
                    street: addr.street_locality_area,
                    landmark: addr.landmark,
                    city: addr.city,
                    pincode: addr.pincode,
                }));

                setAddresses(mappedAddresses);
                
                // Auto-select first address if available
                if (mappedAddresses.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(mappedAddresses[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
                toast.error("Failed to load addresses");
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        fetchAddresses();
    }, []);

    // Map cart items to OrderItem format
    const orderItems: OrderItem[] = useMemo(() => {
        return cartItems.map((item, index) => ({
            id: index + 1, // OrderItem expects number id
            name: item.item_name,
            quantity: item.quantity,
            price: item.item_total,
            isVeg: true, // Note: is_veg field not in cart structure, defaulting to true
        }));
    }, [cartItems]);

    // Create charges array from cart store
    const charges: OrderCharge[] = useMemo(() => [
        { label: "Item Total", value: subtotal, isBold: true, hasInfo: false },
        { label: "Restaurant Packaging Charges", value: 10, isBold: false, hasInfo: false },
        { label: "Delivery Fee", value: deliveryFee, isBold: false, hasInfo: true },
        { label: "Taxes", value: tax, isBold: false, hasInfo: true },
    ], [subtotal, tax, deliveryFee]);

    const totalPayable = total;

    const handleSelectAddress = (id: string | number) => {
        setSelectedAddressId(id);
    };

    const handleAddNewAddress = () => {
        router.push("/profile/address/new");
    };

    const handleProceedToPay = () => {
        // Navigate to payment page
        router.push("/cart/payment");
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 tablet:pt-24 desktop:pt-28 pb-16">
                <div className="section-container flex flex-col gap-6">
                    <div className="sticky top-[96px] tablet:top-[120px] z-40 bg-white flex before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-160px] before:h-[200px] before:bg-white before:-z-10 tablet:before:top-[-160px] tablet:before:h-[220px] desktop:before:top-[-180px] desktop:before:h-[240px]">
                        <CartProgress steps={DELIVERY_STEPS} />
                    </div>

                    <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start">
                        {/* Delivery Address Section */}
                        <div className="flex-1 space-y-6">
                            <header className="sticky top-[190px] tablet:top-[209px] z-30 bg-white py-3 border-b border-gray-200 before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-72px] before:h-[72px] before:bg-white before:-z-10">
                                <h1 className="text-xl font-semibold text-midnight">
                                    Choose Delivery Address
                                </h1>
                            </header>

                            {isLoadingAddresses ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-tango"></div>
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <p className="text-gray-500 text-lg mb-4">No addresses found</p>
                                    <Button
                                        onClick={handleAddNewAddress}
                                        variant="primaryOutlined"
                                    >
                                        Add Address
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                                    {addresses.map((address) => (
                                        <DeliveryAddressCard
                                            key={address.id}
                                            address={address}
                                            isSelected={selectedAddressId === address.id}
                                            isDeliverable={true} // TODO: Check deliverability based on address
                                            onSelect={() => handleSelectAddress(address.id)}
                                        />
                                    ))}

                                    {/* Add New Address Card */}
                                    <div className="flex min-h-[145px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
                                        <div className="flex flex-col items-center justify-center gap-4 p-4">
                                            <div className="text-base font-semibold text-midnight">
                                                Add New Address
                                            </div>
                                            <Button
                                                onClick={handleAddNewAddress}
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

                        {/* Order Summary Section */}
                        <div className="desktop:w-[316px] desktop:shrink-0 desktop:sticky desktop:top-[209px]">
                            <OrderSummary
                                items={orderItems}
                                charges={charges}
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

