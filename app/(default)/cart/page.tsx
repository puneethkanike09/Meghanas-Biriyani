"use client";

import { useMemo } from "react";
import CartProgress, { type CartProgressStep } from "./components/CartProgress";
import CartItemCard from "./components/CartItemCard";
import CartSummary, { type ChargeLine } from "./components/CartSummary";
import MenuAddonCard, { type MenuAddonItem } from "../menu/components/MenuAddonCard";
import { useCartStore } from "@/store/useCartStore";
import { type Option } from "@/services/menu.service";

const CHECKOUT_STEPS: CartProgressStep[] = [
    { number: 1, label: "Cart Confirmation", status: "current" as const },
    { number: 2, label: "Delivery", status: "upcoming" as const },
    { number: 3, label: "Payment", status: "upcoming" as const },
];

const SUGGESTED_ADDONS: MenuAddonItem[] = [
    {
        id: 101,
        name: "Lemon Chicken",
        description: "Fresh lemon and our in-house Andhra spice mix.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 102,
        name: "Golden Baby Corn",
        description: "Crispy baby corn tossed with special seasoning.",
        price: 299,
        rating: 4.5,
        reviews: 58,
        isVeg: true,
        image: "/assets/homepage/images/top10.jpg",
    },
    {
        id: 103,
        name: "Pepper Chicken",
        description: "Boneless pieces cooked with pepper and curry leaves.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
    },
];

const ADDITIONAL_CHARGES: Omit<ChargeLine, "emphasize">[] = [
    { label: "Restaurant Packaging Charges", value: 10 },
    { label: "Delivery Fee", value: 35, hasInfo: true },
    { label: "Taxes", value: 10.47, hasInfo: true },
];

export default function CartPage() {
    const { items: cartItems, updateQuantity, addItem } = useCartStore();

    const itemTotal = useMemo(
        () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        [cartItems]
    );

    const charges: ChargeLine[] = [
        { label: "Item Total", value: itemTotal, emphasize: true },
        ...ADDITIONAL_CHARGES,
    ];

    const totalPayable = charges.reduce((total, charge) => total + charge.value, 0);

    const handleQuantityChange = (itemId: number, delta: number) => {
        // Convert itemId to string if needed, or ensure store handles number
        // Store expects string, so we cast to string if it's a number
        updateQuantity(String(itemId), delta + (cartItems.find(i => i.id === String(itemId))?.quantity || 0));
    };

    // Wrapper for CartItemCard which might expect different props
    // We need to check CartItemCard props.
    // Assuming CartItemCard expects `onQuantityChange(id, delta)`
    // But wait, `updateQuantity` in store takes absolute quantity.
    // So I need to calculate new quantity.

    const onQuantityChangeWrapper = (itemId: number | string, delta: number) => {
        const item = cartItems.find(i => i.id === String(itemId));
        if (item) {
            updateQuantity(String(itemId), item.quantity + delta);
        }
    };

    const handleAddAddon = (addon: Option | MenuAddonItem) => {
        // Check if it's an Option type (has optionId) or legacy MenuAddonItem (has id as number)
        const isOption = 'optionId' in addon;
        
        if (isOption) {
            // Handle Option type
            const option = addon as Option;
            addItem({
                id: option.optionId,
                itemId: option.itemId,
                name: option.optionName,
                price: option.price,
                isVegetarian: false // Options don't have veg info, default to false
            });
        } else {
            // Handle legacy MenuAddonItem type
            const menuAddon = addon as MenuAddonItem;
            addItem({
                id: String(menuAddon.id),
                itemId: String(menuAddon.id), // Mock itemId
                name: menuAddon.name,
                price: menuAddon.price,
                isVegetarian: menuAddon.isVeg
            });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 tablet:pt-24 desktop:pt-28 pb-16">
                <div className="section-container flex flex-col gap-6">
                    <div className="sticky top-[96px] tablet:top-[120px] z-40 bg-white flex  before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-160px] before:h-[200px] before:bg-white before:-z-10 tablet:before:top-[-160px] tablet:before:h-[220px] desktop:before:top-[-180px] desktop:before:h-[240px]">
                        <CartProgress steps={CHECKOUT_STEPS} />
                    </div>

                    <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:gap-8">
                        <div className="flex-1 space-y-6 desktop:min-w-0">
                            <div className="flex flex-col gap-4">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <p className="text-gray-500 text-lg">Your cart is empty</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <CartItemCard
                                            key={item.id}
                                            item={{
                                                ...item,
                                                id: item.id,
                                                description: "", // Store doesn't keep description
                                                rating: 4.5, // Mock
                                                reviews: 0, // Mock
                                                isVeg: item.isVegetarian,
                                                image: "/assets/homepage/images/top10.jpg" // Mock image
                                            }}
                                            onQuantityChange={onQuantityChangeWrapper}
                                        />
                                    ))
                                )}
                            </div>

                            <section className="w-full rounded-xl border border-gray-200 bg-peach-light p-4">
                                <div className="mb-3 flex flex-col items-start gap-3 flex-1">
                                    <h2 className="text-xl font-semibold text-midnight">
                                        Suggested Add-ons
                                    </h2>
                                    <div className="flex items-start gap-4 w-full overflow-x-auto custom-scrollbar">
                                        {SUGGESTED_ADDONS.map((addon) => (
                                            <MenuAddonCard
                                                key={addon.id}
                                                addon={addon}
                                                onAdd={handleAddAddon}
                                                className="min-w-[295px] flex-1"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="desktop:w-[360px] desktop:shrink-0 desktop:sticky desktop:top-[209px]">
                            <CartSummary charges={charges} totalPayable={totalPayable} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
