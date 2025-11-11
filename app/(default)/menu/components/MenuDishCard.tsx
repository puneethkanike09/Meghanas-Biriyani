"use client";

import Image from "next/image";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";
import { MenuItem, CartItem } from "../page";

interface MenuDishCardProps {
    item: MenuItem;
    cartItem?: CartItem;
    onClick: () => void;
    onAddClick: () => void;
    onUpdateQuantity: (itemId: number, change: number) => void;
}

const VegIcon = () => (
    <Image
        src={VegSymbol}
        alt="Vegetarian"
        width={20}
        height={20}
        className="w-4 h-4 tablet:w-5 tablet:h-5"
    />
);

const NonVegIcon = () => (
    <Image
        src={NonVegSymbol}
        alt="Non-Vegetarian"
        width={20}
        height={20}
        className="w-4 h-4 tablet:w-5 tablet:h-5"
    />
);

export default function MenuDishCard({ item, cartItem, onClick, onAddClick, onUpdateQuantity }: MenuDishCardProps) {
    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddClick();
    };

    const handleQuantityChange = (e: React.MouseEvent, change: number) => {
        e.stopPropagation();
        onUpdateQuantity(item.id, change);
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition duration-300 border border-gray-200 hover:border-sunRay cursor-pointer select-none"
        >
            {/* Image */}
            <div className="relative w-full h-[220px]">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={`object-cover ${item.outOfStock ? "grayscale" : ""}`}
                />

                {/* Out of Stock Overlay */}
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

            {/* Content */}
            <div className="p-4 tablet:p-5 desktop:p-4 flex flex-col flex-1 gap-4">
                {/* Veg/Non-veg Icon & Rating Row */}
                <div className="flex items-center justify-between">
                    {item.isVeg ? <VegIcon /> : <NonVegIcon />}
                    <div className="flex items-center gap-1">
                        <StarRating rating={item.rating} variant="single" size="sm" />
                        <span className="text-xs tablet:text-sm desktop:text-sm font-normal text-midnight leading-5">
                            ({item.reviews})
                        </span>
                    </div>
                </div>

                {/* Name and Description */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-base tablet:text-lg desktop:text-xl font-semibold text-midnight leading-normal whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.name}
                    </h3>
                    <p className="text-xs tablet:text-sm desktop:text-base text-gray-600 leading-normal line-clamp-2">
                        {item.description}
                    </p>
                </div>

                {/* Price & Add Button / Quantity Controls */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg tablet:text-xl desktop:text-2xl font-semibold text-midnight leading-normal">
                        ₹{item.price}
                    </span>

                    {cartItem ? (
                        <div 
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-lg border border-gray-300 shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={(e) => handleQuantityChange(e, -1)}
                                className="w-5 h-5 flex items-center justify-center hover:bg-gray-50 rounded transition-colors"
                            >
                                <MinusIcon className="w-3.5 h-3.5 text-midnight" />
                            </button>
                            <span className="w-[30px] text-center text-sm font-semibold text-midnight">
                                {cartItem.quantity}
                            </span>
                            <button
                                onClick={(e) => handleQuantityChange(e, 1)}
                                className="w-5 h-5 flex items-center justify-center hover:bg-gray-50 rounded transition-colors"
                            >
                                <PlusIcon className="w-5 h-5 text-midnight" />
                            </button>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            className={`${item.outOfStock ? "bg-brand-200" : ""}`}
                            icon={<PlusIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />}
                            onClick={handleAddClick}
                            disabled={item.outOfStock}
                        >
                            Add
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

