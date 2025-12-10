"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export interface ChargeLine {
    label: string;
    value: number;
    emphasize?: boolean;
    hasInfo?: boolean;
}

interface CartSummaryProps {
    charges: ChargeLine[];
    totalPayable: number;
    onCheckout?: () => void;
    isLoading?: boolean;
}

export default function CartSummary({ charges, totalPayable, onCheckout, isLoading = false }: CartSummaryProps) {
    const router = useRouter();

    const handleCheckout = () => {
        if (onCheckout) {
            onCheckout();
        } else {
            router.push("/cart/delivery");
        }
    };

    return (
        <section className="flex flex-col w-full items-start gap-6  relative">
            {/* ... */}
            {/* Keeping inner content same, just modifying button action below */}
            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                {charges.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]"
                    >
                        <div className="flex items-center gap-1 relative">
                            <div
                                className={`relative w-fit mt-[-1.00px] ${item.emphasize
                                    ? "font-semibold text-midnight"
                                    : "font-normal text-gray-600"
                                    } text-xs tracking-[0] leading-[normal]`}
                            >
                                {item.label}
                            </div>
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
                        <div
                            className={`relative w-fit mt-[-1.00px] ${item.emphasize
                                ? "font-semibold text-midnight"
                                : "font-normal text-gray-600"
                                } text-xs text-right tracking-[0] leading-[normal]`}
                        >
                            ₹{item.value.toFixed(item.value % 1 === 0 ? 0 : 2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px w-full bg-gray-200 self-stretch" />

            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-semibold text-midnight text-xs tracking-[0] leading-[normal]">
                        To Pay
                    </div>
                    <div className="w-fit font-semibold text-midnight text-xs leading-[normal] relative mt-[-1.00px] tracking-[0]">
                        ₹{totalPayable.toFixed(totalPayable % 1 === 0 ? 0 : 2)}
                    </div>
                </div>
            </div>

            <div className="flex items-start self-stretch w-full relative flex-[0_0_auto] rounded-lg">
                <Button
                    variant="primary"
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="flex-1 bg-tango hover:bg-tango/90 items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-solid border-tango h-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                        </div>
                    ) : (
                        <span className="w-fit font-semibold text-white text-sm whitespace-nowrap">
                            Yes! Let&apos;s Continue
                        </span>
                    )}
                </Button>
            </div>
        </section>
    );
}

