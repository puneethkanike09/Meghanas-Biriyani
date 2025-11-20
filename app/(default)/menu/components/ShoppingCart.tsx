"use client";

import Image from "next/image";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";
import AddIcon from "@/components/ui/assets/icons/Add.svg";
import SubtractIcon from "@/components/ui/assets/icons/Subtract.svg";
import Button from "@/components/ui/Button";
import { CartItem } from "../page";

interface ShoppingCartProps {
    items: CartItem[];
    onUpdateQuantity: (itemId: number, change: number) => void;
    onClearCart: () => void;
}

const VegIcon = () => (
    <Image
        src={VegSymbol}
        alt="Vegetarian"
        width={20}
        height={20}
        className="w-4 h-4"
    />
);

const NonVegIcon = () => (
    <Image
        src={NonVegSymbol}
        alt="Non-Vegetarian"
        width={20}
        height={20}
        className="w-4 h-4"
    />
);

export default function ShoppingCart({ items, onUpdateQuantity, onClearCart }: ShoppingCartProps) {

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl tablet:text-2xl font-semibold text-midnight">
                    Shopping Cart
                </h2>
                {items.length > 0 && (
                    <button
                        onClick={onClearCart}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Cart Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col">
                <div className="flex flex-col h-full justify-between p-4">
                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain pb-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <div className="mb-4 flex items-center justify-center">
                                    <Image
                                        src="/assets/menu/icons/sentiment_dissatisfied.svg"
                                        alt="Empty cart"
                                        width={48}
                                        height={48}
                                        className="w-12 h-12"
                                    />
                                </div>
                                <p className="text-gray-900 text-base tablet:text-lg desktop:text-lg font-normal mb-1">
                                    Your cart is empty.
                                </p>
                                <p className="text-gray-500 text-sm tablet:text-base desktop:text-base font-normal">
                                    Add something and make me happy!
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {items.map((item, index) => (
                                    <div key={item.id}>
                                        <div className="flex flex-col gap-3">
                                            {/* Item Name with Veg/NonVeg Icon */}
                                            <div className="flex items-center gap-2">
                                                {item.isVeg ? <VegIcon /> : <NonVegIcon />}
                                                <h3 className="text-base font-semibold text-midnight">
                                                    {item.name}
                                                </h3>
                                            </div>

                                            {/* Price and Quantity Controls */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-semibold text-midnight">
                                                    ₹{item.price}
                                                </span>

                                                {/* Quantity Controls */}
                                                <div className="inline-flex h-9 items-center justify-between gap-2 px-3.5 bg-white rounded-lg border border-gray-300 shadow-sm min-w-[114px]">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                        className="w-5 h-5 flex items-center justify-center rounded transition-colors cursor-pointer"
                                                    >
                                                        <Image
                                                            src={SubtractIcon}
                                                            alt="Decrease quantity"
                                                            width={18}
                                                            height={18}
                                                            className="w-4 h-4"
                                                        />
                                                    </button>
                                                    <span className="w-[30px] text-center text-sm font-semibold text-midnight">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                        className="w-5 h-5 flex items-center justify-center rounded transition-colors cursor-pointer"
                                                    >
                                                        <Image
                                                            src={AddIcon}
                                                            alt="Increase quantity"
                                                            width={18}
                                                            height={18}
                                                            className="w-4 h-4"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Separator */}
                                        {index < items.length - 1 && (
                                            <div className="h-px bg-gray-200 mt-4" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer - Fixed at bottom */}
                    {items.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <Button
                                variant="primary"
                                className="w-full"
                            >
                                Place Order
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

