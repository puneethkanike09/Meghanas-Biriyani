"use client";

import Image from "next/image";
import StarRating from "@/components/ui/StarRating";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";
import AddIcon from "@/components/ui/assets/icons/Add.svg";
import SubtractIcon from "@/components/ui/assets/icons/Subtract.svg";

export interface CartItem {
    id: number;
    name: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    isVeg: boolean;
    image: string;
    quantity: number;
    outOfStock?: boolean;
}

interface CartItemCardProps {
    item: CartItem;
    onQuantityChange: (itemId: number, delta: number) => void;
}

const VegIcon = () => (
    <Image
        src={VegSymbol}
        alt="Vegetarian"
        width={20}
        height={20}
        className="h-5 w-5"
    />
);

const NonVegIcon = () => (
    <Image
        src={NonVegSymbol}
        alt="Non-Vegetarian"
        width={20}
        height={20}
        className="h-5 w-5"
    />
);

export default function CartItemCard({ item, onQuantityChange }: CartItemCardProps) {
    const formattedPrice = `₹${item.price}`;

    return (
        <div className="flex w-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm tablet:flex-row">
            <div className="relative h-[220px] w-full overflow-hidden rounded-t-2xl tablet:h-auto tablet:w-[220px] tablet:rounded-l-2xl tablet:rounded-tr-none">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={`object-cover ${item.outOfStock ? "grayscale" : ""}`}
                />
            </div>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        {item.isVeg ? <VegIcon /> : <NonVegIcon />}
                        <div className="inline-flex items-center gap-1">
                            <StarRating rating={item.rating} variant="single" size="sm" />
                            <span className="text-sm font-normal text-midnight">
                                ({item.reviews})
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-midnight">
                            {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
                    <span className="text-xl font-semibold text-midnight">{formattedPrice}</span>
                    <div className="inline-flex h-10 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3.5 shadow-sm">
                        <button
                        type="button"
                            onClick={() => onQuantityChange(item.id, -1)}
                            className="flex h-5 w-5 items-center justify-center cursor-pointer"
                        >
                            <Image src={SubtractIcon} alt="Decrease quantity" width={18} height={18} className="h-4 w-4" />
                        </button>
                        <span className="w-[32px] text-center text-sm font-semibold text-midnight">
                            {item.quantity}
                        </span>
                        <button
                        type="button"
                            onClick={() => onQuantityChange(item.id, 1)}
                            className="flex h-5 w-5 items-center justify-center cursor-pointer"
                        >
                            <Image src={AddIcon} alt="Increase quantity" width={18} height={18} className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

