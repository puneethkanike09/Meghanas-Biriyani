"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CartProgress, { type CartProgressStep } from "../components/CartProgress";
import DeliveryAddressCard from "../components/DeliveryAddressCard";
import OrderSummary from "../components/OrderSummary";
import Button from "@/components/ui/Button";
import { INITIAL_ADDRESSES, type AddressItem } from "../../profile/address/data";

const PAYMENT_STEPS: CartProgressStep[] = [
    { number: 1, label: "Cart Confirmation", status: "completed" },
    { number: 2, label: "Delivery", status: "completed" },
    { number: 3, label: "Payment", status: "current" },
];

// Mock order data - in real app this would come from cart state/context
const ORDER_ITEMS = [
    { id: 1, name: "Chicken Biriyani", quantity: 2, price: 349, isVeg: false },
    { id: 2, name: "Paneer 65", quantity: 2, price: 249, isVeg: true },
    { id: 3, name: "Pepper Chicken", quantity: 2, price: 299, isVeg: false },
];

const COST_BREAKDOWN = [
    { label: "Item Total", value: 897, isBold: true, hasInfo: false },
    { label: "Restaurant Packaging Charges", value: 10, isBold: false, hasInfo: false },
    { label: "Delivery Fee", value: 35, isBold: false, hasInfo: true },
    { label: "Taxes", value: 10.47, isBold: false, hasInfo: true },
];

const RAZORPAY_KEY =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
    process.env.NEXT_PUBLIC_VITE_RAZORPAY_KEY_ID ??
    "rzp_test_Z73AQcjFtYY6fJ";

const HOSTED_LOGO_URL = "http://meghana-foods.vercel.app/assets/navbar/images/logo.svg";

declare global {
    interface Window {
        Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

type RazorpayPrefill = {
    name?: string;
    email?: string;
    contact?: string;
};

type RazorpayTheme = {
    color?: string;
};

type RazorpayOptions = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id?: string;
    handler: (response: unknown) => void;
    prefill?: RazorpayPrefill;
    notes?: Record<string, string>;
    theme?: RazorpayTheme;
};

type RazorpayInstance = {
    open: () => void;
    on: (event: string, handler: (response: unknown) => void) => void;
};

let razorpayScriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript() {
    if (typeof window === "undefined") {
        return Promise.resolve(false);
    }

    if (window.Razorpay) {
        return Promise.resolve(true);
    }

    if (!razorpayScriptPromise) {
        razorpayScriptPromise = new Promise<boolean>((resolve) => {
            const existingScript = document.querySelector<HTMLScriptElement>(
                "script[src='https://checkout.razorpay.com/v1/checkout.js']"
            );

            if (existingScript) {
                existingScript.addEventListener("load", () => resolve(true));
                existingScript.addEventListener("error", () => resolve(false));
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => {
                script.setAttribute("data-loaded", "true");
                resolve(true);
            };
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    return razorpayScriptPromise;
}

export default function PaymentPage() {
    const router = useRouter();
    const [addresses] = useState<AddressItem[]>(() => INITIAL_ADDRESSES);
    const [selectedAddressId] = useState<number | null>(1);
    const [isCheckoutReady, setIsCheckoutReady] = useState(false);

    const handleSelectAddress = () => {
        // Placeholder for payment method selection
    };

    const totalPayable = COST_BREAKDOWN.reduce((sum, item) => sum + item.value, 0);
    const totalPayableInPaise = Math.round(totalPayable * 100);

    const openRazorpayCheckout = useCallback(async () => {
        if (!RAZORPAY_KEY) {
            console.warn("Razorpay key missing");
            return;
        }

        const scriptLoaded = await loadRazorpayScript();
        const isReady = scriptLoaded && !!window.Razorpay;
        setIsCheckoutReady(isReady);

        if (!isReady) {
            console.error("Failed to load Razorpay checkout script");
            return;
        }

        const paymentLogo = HOSTED_LOGO_URL;

        const options: RazorpayOptions = {
            key: RAZORPAY_KEY,
            amount: totalPayableInPaise,
            currency: "INR",
            name: "Meghana Foods",
            description: "Order Payment",
            image: paymentLogo ?? undefined,
            handler: () => {
                router.push("/cart/confirmation");
            },
            prefill: {
                name: "Meghana Foods Patron",
                email: "patron@meghanafoods.com",
                contact: "+911234567890",
            },
            notes: {
                address: "Meghana Foods Koramangala",
            },
            theme: {
                color: "#f47729",
            },
        };

        const RazorpayConstructor = window.Razorpay;
        if (!RazorpayConstructor) {
            console.error("Razorpay constructor unavailable after script load");
            return;
        }

        const razorpayInstance = new RazorpayConstructor(options);
        razorpayInstance.open();
        razorpayInstance.on("payment.failed", () => {
            alert("Payment failed, please try again.");
        });
    }, [router, totalPayableInPaise]);

    useEffect(() => {
        void openRazorpayCheckout();
    }, [openRazorpayCheckout]);

    const handleProceedToPay = () => {
        void openRazorpayCheckout();
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 tablet:pt-24 desktop:pt-28 pb-16">
                <div className="section-container flex flex-col gap-6">
                    <div className="sticky top-[96px] tablet:top-[120px] z-40 bg-white flex before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-160px] before:h-[200px] before:bg-white before:-z-10 tablet:before:top-[-160px] tablet:before:h-[220px] desktop:before:top-[-180px] desktop:before:h-[240px]">
                        <CartProgress steps={PAYMENT_STEPS} />
                    </div>

                    <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start">
                        {/* Payment Method Section */}
                        <div className="flex-1 space-y-6">
                            <header className="sticky top-[190px] tablet:top-[209px] z-30 bg-white py-3 border-b border-gray-200 before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-72px] before:h-[72px] before:bg-white before:-z-10">
                                <h1 className="text-xl font-semibold text-midnight">
                                    Choose Payment Method
                                </h1>
                            </header>


                        </div>

                        {/* Order Summary Section */}
                        <div className="desktop:w-[316px] desktop:shrink-0 desktop:sticky desktop:top-[209px]">
                            <OrderSummary
                                items={ORDER_ITEMS}
                                charges={COST_BREAKDOWN}
                                totalPayable={totalPayable}
                                onProceed={handleProceedToPay}
                                ctaLabel={isCheckoutReady ? "Reopen Payment" : "Initializing"}
                                isCtaDisabled={!isCheckoutReady}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

