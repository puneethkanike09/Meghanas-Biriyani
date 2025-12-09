"use client";

import { useMemo, useEffect } from "react";
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

export default function CartPage() {
    const { items: cartItems, addItem, removeItem, fetchCart, subtotal, tax, deliveryFee, total } = useCartStore();

    // Re-fetch cart on mount to ensure freshness
    useEffect(() => {
        fetchCart();
    }, []);

    const charges: ChargeLine[] = [
        { label: "Item Total", value: subtotal, emphasize: true },
        { label: "Restaurant Packaging Charges", value: 10 },
        { label: "Delivery Fee", value: deliveryFee, hasInfo: true },
        { label: "Taxes", value: tax, hasInfo: true },
    ];

    const totalPayable = total;

    const onQuantityChangeWrapper = async (itemId: number | string, delta: number) => {
        const item = cartItems.find(i => i.item_id === String(itemId));
        if (!item) {
            return;
        }

        const newQuantity = item.quantity + delta;
        
        if (newQuantity < 0) {
            // Don't allow negative quantities
            return;
        }
        
        if (newQuantity === 0) {
            // If quantity becomes 0, remove the item from cart
            try {
                await removeItem(item.cart_item_id);
            } catch (error) {
                console.error("Failed to remove item from cart:", error);
            }
        } else {
            // Otherwise, update the quantity
            await addItem(String(itemId), newQuantity);
        }
    };

    const handleAddAddon = (addon: Option | MenuAddonItem) => {
        // Check if it's an Option type (has optionId) or legacy MenuAddonItem (has id as number)
        const isOption = 'optionId' in addon;

        if (isOption) {
            // Handle Option type
            const option = addon as Option;
            addItem(option.optionId, 1);
        } else {
            // Handle legacy MenuAddonItem type
            const menuAddon = addon as MenuAddonItem;
            addItem(String(menuAddon.id), 1);
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
                                            key={item.cart_item_id}
                                            item={{
                                                id: item.cart_item_id,
                                                name: item.item_name,
                                                price: item.item_total,
                                                quantity: item.quantity,
                                                description: "", // Description not in cart structure
                                                rating: 4.5, // Mock
                                                reviews: 0, // Mock
                                                isVeg: true, // Note: is_veg field not in new structure, defaulting to true
                                                image: item.image_url || "/assets/homepage/images/top10.jpg"
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
