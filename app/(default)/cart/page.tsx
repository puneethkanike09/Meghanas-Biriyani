"use client";

import { useMemo, useState } from "react";
import CartProgress, { type CartProgressStep } from "./components/CartProgress";
import CartItemCard, { type CartItem } from "./components/CartItemCard";
import CartSummary, { type ChargeLine } from "./components/CartSummary";
import MenuAddonCard, { type MenuAddonItem } from "../menu/components/MenuAddonCard";

const CHECKOUT_STEPS: CartProgressStep[] = [
    { number: 1, label: "Cart Confirmation", status: "current" as const },
    { number: 2, label: "Delivery", status: "upcoming" as const },
    { number: 3, label: "Payment", status: "upcoming" as const },
];

const INITIAL_CART_ITEMS: CartItem[] = [
    {
        id: 1,
        name: "Chicken Biriyani",
        description: "Fresh pieces of chicken are cooked in our signature Andhra spice mix and layered with fragrant basmati rice.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        quantity: 1,
    },
    {
        id: 2,
        name: "Chicken Kabab",
        description: "Juicy chicken kababs pan-fried with curry leaves, garlic, and our in-house masala.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        quantity: 1,
    },
    {
        id: 3,
        name: "Paneer Butter Masala",
        description: "Soft paneer coated in buttery tomato gravy enriched with Meghana's spice blend.",
        price: 349,
        rating: 4.5,
        reviews: 59,
        isVeg: true,
        image: "/assets/homepage/images/top10.jpg",
        quantity: 1,
    },
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
        category: "Add-ons",
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
        category: "Add-ons",
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
        category: "Add-ons",
    },
];

const ADDITIONAL_CHARGES: Omit<ChargeLine, "emphasize">[] = [
    { label: "Restaurant Packaging Charges", value: 10 },
    { label: "Delivery Fee", value: 35, hasInfo: true },
    { label: "Taxes", value: 10.47, hasInfo: true },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

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
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleAddAddon = (addon: MenuAddonItem) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === addon.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === addon.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            return [
                ...prev,
                {
                    id: addon.id,
                    name: addon.name,
                    description: addon.description ?? "",
                    price: addon.price,
                    rating: addon.rating,
                    reviews: addon.reviews,
                    isVeg: addon.isVeg,
                    image: addon.image,
                    quantity: 1,
                },
            ];
        });

    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 tablet:pt-24 desktop:pt-28 pb-16">
                <div className="section-container flex flex-col gap-6">
                    <div className="sticky top-[96px] tablet:top-[120px] z-40 bg-white flex  before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-160px] before:h-[200px] before:bg-white before:-z-10 tablet:before:top-[-160px] tablet:before:h-[220px] desktop:before:top-[-180px] desktop:before:h-[240px]">
                        <CartProgress steps={CHECKOUT_STEPS} />
                    </div>

                    <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-col gap-4">
                                {cartItems.map((item) => (
                                    <CartItemCard
                                        key={item.id}
                                        item={item}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                ))}
                            </div>

                            <section className="w-full rounded-xl border border-gray-200 bg-peachLight p-4">
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

                        <div className="desktop:w-[360px] desktop:flex-shrink-0 desktop:sticky desktop:top-[209px]">
                            <CartSummary charges={charges} totalPayable={totalPayable} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

