"use client";

import Image from "next/image";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";
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
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-midnight">
                    Shopping Cart
                </h2>
                {items.length > 0 && (
                    <button
                        onClick={onClearCart}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
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
                                <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-base font-medium mb-1">
                                    Your cart is empty
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Add items from the menu
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
                                                <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-lg border border-gray-300 shadow-sm">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                        className="w-5 h-5 flex items-center justify-center hover:bg-gray-50 rounded transition-colors"
                                                    >
                                                        <MinusIcon className="w-3.5 h-3.5 text-midnight" />
                                                    </button>
                                                    <span className="w-[30px] text-center text-sm font-semibold text-midnight">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                        className="w-5 h-5 flex items-center justify-center hover:bg-gray-50 rounded transition-colors"
                                                    >
                                                        <PlusIcon className="w-5 h-5 text-midnight" />
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
                                className="w-full justify-center"
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

