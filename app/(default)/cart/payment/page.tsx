"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CartProgress, { type CartProgressStep } from "../components/CartProgress";
import OrderSummary, { type OrderItem, type OrderCharge } from "../components/OrderSummary";
import { OrderService } from "@/services/order.service";
import { useCartStore } from "@/store/useCartStore";

const PAYMENT_STEPS: CartProgressStep[] = [
    { number: 1, label: "Cart Confirmation", status: "completed" },
    { number: 2, label: "Delivery", status: "completed" },
    { number: 3, label: "Payment", status: "current" },
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
    const { items: cartItems, subtotal, tax, deliveryFee, total } = useCartStore();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [transaction, setTransaction] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isCheckoutReady, setIsCheckoutReady] = useState(false);

    // Get order ID from sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedOrderId = sessionStorage.getItem('currentOrderId');
            if (storedOrderId) {
                setOrderId(storedOrderId);
            } else {
                toast.error("No order found. Please start from cart.");
                router.push("/cart");
            }
        }
    }, [router]);

    // Map cart items to OrderItem format
    const orderItems: OrderItem[] = useMemo(() => {
        return cartItems.map((item, index) => ({
            id: index + 1,
            name: item.item_name,
            quantity: item.quantity,
            price: item.item_total,
            isVeg: true, // Note: is_veg field not in cart structure, defaulting to true
        }));
    }, [cartItems]);

    // Create charges array from cart store
    const charges: OrderCharge[] = useMemo(() => [
        { label: "Item Total", value: subtotal, isBold: true, hasInfo: false },
        { label: "Restaurant Packaging Charges", value: 10, isBold: false, hasInfo: false },
        { label: "Delivery Fee", value: deliveryFee, isBold: false, hasInfo: true },
        { label: "Taxes", value: tax, isBold: false, hasInfo: true },
    ], [subtotal, tax, deliveryFee]);

    const totalPayable = total;

    // Initiate payment when order ID is available
    useEffect(() => {
        const initiatePayment = async () => {
            if (!orderId || !totalPayable || totalPayable <= 0) {
                setIsInitializing(false);
                return;
            }

            try {
                setIsInitializing(true);

                // Initiate payment
                const paymentTransaction = await OrderService.initiatePayment({
                    orderId: orderId,
                    amount: totalPayable,
                    gateway: "RAZORPAY",
                    currency: "INR",
                });

                setTransaction(paymentTransaction);

                // Load Razorpay script
                const scriptLoaded = await loadRazorpayScript();
                if (scriptLoaded && window.Razorpay) {
                    setIsCheckoutReady(true);
                }
            } catch (error: any) {
                console.error("Failed to initiate payment:", error);

                let errorMessage = "Failed to initiate payment";
                if (error.response?.data?.message) {
                    const msg = error.response.data.message;
                    errorMessage = Array.isArray(msg) ? msg.join(", ") : msg;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                toast.error(errorMessage);
            } finally {
                setIsInitializing(false);
            }
        };

        if (orderId) {
            initiatePayment();
        }
    }, [orderId, totalPayable]);

    const openRazorpayCheckout = useCallback(async () => {
        if (!transaction) {
            toast.error("Payment not initialized. Please wait...");
            return;
        }

        if (!transaction.keyId) {
            console.warn("Razorpay key missing from transaction");
            return;
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || !window.Razorpay) {
            console.error("Failed to load Razorpay checkout script");
            toast.error("Failed to load payment gateway");
            return;
        }

        const paymentLogo = HOSTED_LOGO_URL;

        const options: RazorpayOptions = {
            key: transaction.keyId, // Use keyId from transaction
            amount: transaction.amount, // Already in paise from transaction
            currency: transaction.currency,
            name: "Meghana Foods",
            description: "Order Payment",
            image: paymentLogo ?? undefined,
            order_id: transaction.gatewayTransactionId, // Razorpay order ID
            handler: (response: any) => {
                console.log("Payment success:", response);
                console.log("Razorpay Transaction ID:", response.razorpay_payment_id);
                // Clear order ID from sessionStorage
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('currentOrderId');
                }
                router.push("/cart/confirmation");
            },
            prefill: {
                name: "Meghana Foods Patron",
                email: "patron@meghanafoods.com",
                contact: "+911234567890",
            },
            notes: {
                orderId: orderId || "",
                transactionId: transaction.transactionId,
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
        razorpayInstance.on("payment.failed", (response: any) => {
            console.error("Payment failed:", response);
            toast.error("Payment failed, please try again.");
        });
    }, [transaction, orderId, router]);

    // Auto-open Razorpay when ready (only once)
    useEffect(() => {
        if (isCheckoutReady && transaction && !isInitializing) {
            // Small delay to ensure UI is ready
            const timer = setTimeout(() => {
                openRazorpayCheckout();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isCheckoutReady, transaction, isInitializing, openRazorpayCheckout]);

    const handleProceedToPay = () => {
        if (isCheckoutReady && transaction) {
            openRazorpayCheckout();
        } else {
            toast.error("Payment is not ready yet. Please wait...");
        }
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
                                items={orderItems}
                                charges={charges}
                                totalPayable={totalPayable}
                                onProceed={handleProceedToPay}
                                ctaLabel={
                                    isInitializing
                                        ? "Initializing Payment..."
                                        : isCheckoutReady
                                            ? "Reopen Payment"
                                            : "Pay Now"
                                }
                                isCtaDisabled={!isCheckoutReady || isInitializing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

