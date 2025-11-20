"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

const locations = [
    {
        name: "Meghana Foods",
        address: "Koramangala, Bengaluru Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India. (Koncept Nest)",
    },
    {
        name: "Koncept Nest",
        address: "Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India. (Koncept Nest)",
    },
];

export default function OrderConfirmationPage() {
    const router = useRouter();
    const orderId = "3346524"; // In real app, this would come from route params or state

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-[592px] flex flex-col items-center justify-center gap-6">
                <Image
                    src="/assets/cart/icons/confirmed.svg"
                    alt="Order confirmed"
                    width={40}
                    height={40}
                    className="w-12 h-12"
                />

                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                        <h1 className="text-center font-semibold text-midnight text-xl leading-normal">
                            Your order confirmed! <br />
                            Order#{orderId}
                        </h1>
                        <p className="w-full max-w-[410px] text-center text-gray-500 text-base leading-normal">
                            Our Chef has already picked up the spices and started preparing your order. Hold on! Its just a few minutes away.
                        </p>
                    </div>
                </div>

                <div className="w-full rounded-xl border border-gray-200 bg-gray-50 ">
                    <div className="p-4 flex flex-col gap-8">
                        <div className="space-y-2.5">
                            {locations.map((location, index) => {
                                const isLast = index === locations.length - 1;
                                return (
                                    <div key={index} className="flex items-stretch gap-3">
                                        <div className="flex w-5 flex-col items-center">
                                            <Image
                                                src="/assets/profile/icons/Location.svg"
                                                alt="Location pin"
                                                width={20}
                                                height={20}
                                                className="h-5 w-5 flex-shrink-0"
                                            />
                                            {!isLast && (
                                                <span
                                                    className="mt-1 flex-1 w-px"
                                                    style={{
                                                        backgroundImage:
                                                            "repeating-linear-gradient(to bottom, #0f172a 0 6px, transparent 6px 12px)",
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col gap-1">
                                            <h3 className="text-sm font-semibold text-midnight">
                                                {location.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                {location.address}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Button
                    variant="primary"
                    onClick={() => router.push("/home")}
                    className="h-auto px-3.5 py-2"
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
}

