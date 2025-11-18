"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";

export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
}

export interface OrderCharge {
    label: string;
    value: number;
    isBold: boolean;
    hasInfo?: boolean;
}

interface OrderSummaryProps {
    items: OrderItem[];
    charges: OrderCharge[];
    totalPayable: number;
    onProceed: () => void;
}

const VegIcon = () => (
    <Image
        src={VegSymbol}
        alt="Vegetarian"
        width={16}
        height={16}
        className="w-4 h-4"
    />
);

const NonVegIcon = () => (
    <Image
        src={NonVegSymbol}
        alt="Non-Vegetarian"
        width={16}
        height={16}
        className="w-4 h-4"
    />
);

export default function OrderSummary({
    items,
    charges,
    totalPayable,
    onProceed,
}: OrderSummaryProps) {
    const pathname = usePathname();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const isPaymentPage = pathname?.includes("/payment");

    return (
        <section className="flex flex-col w-full items-start gap-6">
            <header className="flex items-center justify-between px-0 py-3 w-full border-b border-gray-200">
                <h2 className="text-xl font-semibold text-midnight">
                    Order Summary
                </h2>
            </header>

            <div className="flex flex-col w-full items-start gap-3">
                <p className="text-xs font-normal text-gray-600">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </p>
                <ul className="flex flex-col items-start gap-4 w-full">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between w-full">
                            <div className="inline-flex items-center gap-2">
                                {item.isVeg ? <VegIcon /> : <NonVegIcon />}
                                <span className="text-sm font-semibold text-midnight">
                                    {item.name} (x{item.quantity})
                                </span>
                            </div>
                            <span className="text-xs font-normal text-gray-600 text-right">
                                ₹{item.price}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="h-px w-full bg-gray-200" />

            <div className="flex flex-col items-start gap-2 w-full">
                {charges.map((item, index) => (
                    <div key={index} className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-1">
                            <span
                                className={`text-xs tracking-[0] leading-[normal] ${item.isBold
                                    ? "font-semibold text-midnight"
                                    : "font-normal text-gray-600"
                                    }`}
                            >
                                {item.label}
                            </span>
                            {item.hasInfo && (
                                <Image
                                    className="relative w-3 h-3"
                                    alt="Info"
                                    src="/assets/cart/icons/Info.svg"
                                    width={12}
                                    height={12}
                                />
                            )}
                        </div>
                        <span className="text-xs font-normal text-gray-600 text-right leading-[normal] tracking-[0]">
                            ₹{item.value.toFixed(item.value % 1 === 0 ? 0 : 2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="h-px w-full bg-gray-200" />

            <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-semibold text-midnight tracking-[0] leading-[normal]">
                        To Pay
                    </span>
                    <span className="text-xs font-semibold text-midnight leading-[normal] tracking-[0]">
                        ₹{totalPayable.toFixed(totalPayable % 1 === 0 ? 0 : 2)}
                    </span>
                </div>
            </div>

            <Button
                variant="primary"
                onClick={onProceed}
                className="w-full h-auto px-3.5 py-2"
            >
                {isPaymentPage ? "Pay Now" : "Proceed to Pay"}
            </Button>
        </section>
    );
}

