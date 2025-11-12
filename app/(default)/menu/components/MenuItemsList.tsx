"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/outline";
import StarRating from "@/components/ui/StarRating";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";
import { MenuItem, CartItem } from "../page";
import DishCard from "@/components/ui/DishCard";

interface MenuItemsListProps {
    items: MenuItem[];
    expandedDishId: number | null;
    showAddOnsForId: number | null;
    onCardClick: (itemId: number) => void;
    onAddClick: (item: MenuItem) => void;
    onAddToCart: (item: MenuItem, quantity?: number) => void;
    cart: CartItem[];
    onUpdateQuantity: (itemId: number, change: number) => void;
}

const VegIcon = () => (
    <Image
        src={VegSymbol}
        alt="Vegetarian"
        width={20}
        height={20}
        className="w-5 h-5"
    />
);

const NonVegIcon = () => (
    <Image
        src={NonVegSymbol}
        alt="Non-Vegetarian"
        width={20}
        height={20}
        className="w-5 h-5"
    />
);

export default function MenuItemsList({
    items,
    expandedDishId,
    showAddOnsForId,
    onCardClick,
    onAddClick,
    onAddToCart,
    cart,
    onUpdateQuantity,
}: MenuItemsListProps) {
    const [columns, setColumns] = useState(3);

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth >= 1280) {
                setColumns(3);
            } else if (window.innerWidth >= 768) {
                setColumns(2);
            } else {
                setColumns(1);
            }
        };

        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
        <div className="flex flex-col gap-8">
            {Object.entries(groupedItems).map(([category, categoryItems]) => {

                return (
                    <section key={category} className="flex flex-col gap-4">
                        {/* Category Header */}
                        <h2 className="text-xl tablet:text-2xl font-semibold text-midnight">
                            {category} ({categoryItems.length})
                        </h2>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
                            {(() => {
                                const renderedItems: JSX.Element[] = [];

                                categoryItems.forEach((item, index) => {
                                    const isExpanded = expandedDishId === item.id;
                                    const cartItem = cart.find(c => c.id === item.id);

                                    renderedItems.push(
                                        <div
                                            key={item.id}
                                            className={isExpanded ? "col-span-1 tablet:col-span-2 desktop:col-span-3" : ""}
                                        >
                                            <DishCard
                                                id={item.id}
                                                name={item.name}
                                                description={item.description}
                                                price={item.price}
                                                rating={item.rating}
                                                reviews={item.reviews}
                                                isVeg={item.isVeg}
                                                image={item.image}
                                                outOfStock={item.outOfStock}
                                                variant={isExpanded ? "expanded" : "default"}
                                                onClick={isExpanded ? undefined : () => onCardClick(item.id)}
                                                onAdd={() => onAddClick(item)}
                                                quantity={cartItem?.quantity}
                                                onUpdateQuantity={(change) => onUpdateQuantity(item.id, change)}
                                            />
                                        </div>
                                    );

                                    // If this item has add-ons to show and it's expanded, insert immediately after
                                    if (showAddOnsForId === item.id && item.addOns && item.addOns.length > 0 && isExpanded) {
                                        renderedItems.push(
                                            <div
                                                key={`addons-${item.id}`}
                                                className="col-span-1 tablet:col-span-2 desktop:col-span-3"
                                            >
                                                <div className="bg-lightOrange rounded-xl border border-gray-200 p-4">
                                                    <h3 className="text-xl font-semibold text-midnight mb-3">
                                                        Suggested Add-ons
                                                    </h3>

                                                    <div className="overflow-x-auto custom-scrollbar pb-2">
                                                        <div className="flex gap-4">
                                                            {item.addOns.map((addOn) => (
                                                                <div
                                                                    key={addOn.id}
                                                                    className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-3 w-[280px] tablet:w-[300px] desktop:w-[300px] flex-shrink-0"
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                                            <Image
                                                                                src={addOn.image}
                                                                                alt={addOn.name}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>

                                                                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between">
                                                                                {addOn.isVeg ? <VegIcon /> : <NonVegIcon />}
                                                                                <div className="flex items-center gap-1">
                                                                                    <StarRating rating={addOn.rating} variant="single" size="sm" />
                                                                                    <span className="text-xs font-normal text-midnight">
                                                                                        ({addOn.reviews})
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <h4 className="text-base tablet:text-lg font-semibold text-midnight leading-tight line-clamp-1">
                                                                                {addOn.name}
                                                                            </h4>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-base font-semibold text-midnight">
                                                                            ₹{addOn.price}
                                                                        </span>
                                                                        <button
                                                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] font-semibold text-[13px] desktop:text-sm transition-colors border border-tango text-tango hover:bg-lightOrange bg-white"
                                                                            onClick={() => onAddToCart(addOn)}
                                                                        >
                                                                            <PlusIcon className="w-4 h-4" />
                                                                            Add
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                });

                                // For non-expanded cards, insert add-ons after the complete row
                                const addOnsItemIndex = categoryItems.findIndex(item => item.id === showAddOnsForId);
                                if (addOnsItemIndex !== -1 && showAddOnsForId && expandedDishId !== showAddOnsForId) {
                                    const addOnsItem = categoryItems[addOnsItemIndex];
                                    if (addOnsItem?.addOns && addOnsItem.addOns.length > 0) {
                                        // Calculate position after the row
                                        const insertPosition = Math.min(
                                            renderedItems.length,
                                            (Math.floor(addOnsItemIndex / columns) + 1) * columns
                                        );

                                        renderedItems.splice(
                                            insertPosition,
                                            0,
                                            <div
                                                key={`addons-${addOnsItem.id}`}
                                                className="col-span-1 tablet:col-span-2 desktop:col-span-3"
                                            >
                                                <div className="bg-lightOrange rounded-xl border border-gray-200 p-4">
                                                    <h3 className="text-xl font-semibold text-midnight mb-3">
                                                        Suggested Add-ons
                                                    </h3>

                                                    <div className="overflow-x-auto custom-scrollbar pb-2">
                                                        <div className="flex gap-4">
                                                            {addOnsItem.addOns.map((addOn) => (
                                                                <div
                                                                    key={addOn.id}
                                                                    className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-3 w-[280px] tablet:w-[300px] desktop:w-[300px] flex-shrink-0"
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                                            <Image
                                                                                src={addOn.image}
                                                                                alt={addOn.name}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>

                                                                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between">
                                                                                {addOn.isVeg ? <VegIcon /> : <NonVegIcon />}
                                                                                <div className="flex items-center gap-1">
                                                                                    <StarRating rating={addOn.rating} variant="single" size="sm" />
                                                                                    <span className="text-xs font-normal text-midnight">
                                                                                        ({addOn.reviews})
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <h4 className="text-base tablet:text-lg font-semibold text-midnight leading-tight line-clamp-1">
                                                                                {addOn.name}
                                                                            </h4>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-base font-semibold text-midnight">
                                                                            ₹{addOn.price}
                                                                        </span>
                                                                        <button
                                                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] font-semibold text-[13px] desktop:text-sm transition-colors border border-tango text-tango hover:bg-lightOrange bg-white"
                                                                            onClick={() => onAddToCart(addOn)}
                                                                        >
                                                                            <PlusIcon className="w-4 h-4" />
                                                                            Add
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                }

                                return renderedItems;
                            })()}
                        </div>
                    </section>
                );
            })}

            {items.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No items found in this category</p>
                </div>
            )}
        </div>
    );
}

