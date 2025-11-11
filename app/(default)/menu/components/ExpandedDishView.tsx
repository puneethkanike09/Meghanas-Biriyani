"use client";

import Image from "next/image";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";
import { MenuItem, CartItem } from "../page";

interface ExpandedDishViewProps {
    item: MenuItem;
    cartItem?: CartItem;
    onAddClick: (item: MenuItem) => void;
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

export default function ExpandedDishView({ item, cartItem, onAddClick, onUpdateQuantity }: ExpandedDishViewProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col tablet:flex-row">
                {/* Image Section */}
                <div className="relative w-full tablet:w-1/2 h-[300px] tablet:h-[360px]">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className={`object-cover ${item.outOfStock ? "grayscale" : ""}`}
                    />
                    {item.outOfStock && (
                        <div className="absolute inset-0 bg-[#00000080] flex items-center justify-center">
                            <Button
                                variant="default"
                                className="cursor-default pointer-events-none"
                            >
                                Out of Stock
                            </Button>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-4 p-4 tablet:p-6 flex-1 bg-white">
                    {/* Veg/Non-veg Icon & Rating */}
                    <div className="flex items-center justify-between">
                        {item.isVeg ? <VegIcon /> : <NonVegIcon />}
                        <div className="flex items-center gap-1">
                            <StarRating rating={item.rating} variant="single" size="md" />
                            <span className="text-sm font-normal text-midnight">
                                ({item.reviews})
                            </span>
                        </div>
                    </div>

                    {/* Name */}
                    <h2 className="text-xl tablet:text-2xl font-semibold text-midnight leading-tight">
                        {item.name}
                    </h2>

                    {/* Description */}
                    <p className="text-base text-gray-600 leading-relaxed">
                        {item.description}
                    </p>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between">
                        <span className="text-xl tablet:text-2xl font-semibold text-midnight">
                            ₹{item.price}
                        </span>

                        {cartItem ? (
                            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-lg border border-gray-300 shadow-sm">
                                <button
                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                    className="w-5 h-5 flex items-center justify-center hover:bg-gray-50 rounded transition-colors"
                                >
                                    <MinusIcon className="w-3.5 h-3.5 text-midnight" />
                                </button>
                                <span className="w-[30px] text-center text-sm font-semibold text-midnight">
                                    {cartItem.quantity}
                                </span>
                                <button
                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                    className="w-5 h-5 flex items-center justify-center hover:bg-gray-50 rounded transition-colors"
                                >
                                    <PlusIcon className="w-5 h-5 text-midnight" />
                                </button>
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                className={`${item.outOfStock ? "bg-brand-200" : ""}`}
                                icon={<PlusIcon className="w-5 h-5" />}
                                onClick={() => onAddClick(item)}
                                disabled={item.outOfStock}
                            >
                                Add
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

