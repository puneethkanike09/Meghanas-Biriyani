"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { PaymentService, PaymentStatusResponse } from "@/services/payment.service";

// Helper function to format address
const formatAddress = (address: {
    addressLine: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    landmark?: string;
}): string => {
    const parts = [
        address.addressLine,
        address.landmark,
        address.city,
        address.state,
        address.zip,
        address.country,
    ].filter(Boolean);
    return parts.join(', ');
};

function OrderConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('transactionId');

    const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch payment status on mount
    useEffect(() => {
        const fetchPaymentStatus = async () => {
            if (!transactionId) {
                setError("Transaction ID is missing");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const status = await PaymentService.getPaymentStatus(transactionId);
                setPaymentStatus(status);
            } catch (err: any) {
                console.error("Failed to fetch payment status:", err);
                const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch payment status";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentStatus();
    }, [transactionId]);

    // Show loader while fetching payment status
    if (isLoading) {
        return (
            <div className="section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24 tablet:pt-28 desktop:pt-36 min-h-[400px]">
                <div className="mx-auto flex w-full max-w-[648px] flex-col items-center justify-center gap-6">
                    <Loader message="Confirming your payment..." />
                </div>
            </div>
        );
    }

    // Show error state if payment status fetch failed
    if (error || !paymentStatus) {
        return (
            <div className="section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24 tablet:pt-28 desktop:pt-36">
                <div className="mx-auto flex w-full max-w-[648px] flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-4 w-full">
                        <h1 className="text-center font-semibold text-midnight text-xl leading-normal">
                            Unable to confirm payment
                        </h1>
                        <p className="w-full max-w-[410px] text-center text-gray-500 text-base leading-normal">
                            {error || "Please check your order status in your profile."}
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => router.push("/profile/orders")}
                        className="h-auto px-3.5 py-2"
                    >
                        View Orders
                    </Button>
                </div>
            </div>
        );
    }

    // Extract relevant data from payment status
    const orderId = paymentStatus.orderId || paymentStatus.order?.id || "3346524";
    const invoiceNumber = paymentStatus.invoiceNumber;
    const order = paymentStatus.order;
    const branchAddress = paymentStatus.branchAddress;
    const deliveryInfo = order?.deliveryInfo;

    // Prepare locations array from API data
    const locations: Array<{ name: string; address: string }> = [];
    if (branchAddress) {
        locations.push({
            name: branchAddress.name,
            address: formatAddress(branchAddress),
        });
    }
    if (deliveryInfo) {
        locations.push({
            name: deliveryInfo.addressLabel || "Delivery Address",
            address: formatAddress({
                addressLine: deliveryInfo.addressLine,
                city: deliveryInfo.city,
                state: deliveryInfo.state,
                country: deliveryInfo.country,
                zip: deliveryInfo.zip,
                landmark: deliveryInfo.landmark,
            }),
        });
    }

    return (
        <div className="section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24  tablet:pt-28  desktop:pt-36">
            <div className="mx-auto flex w-full max-w-[648px] flex-col items-center justify-center gap-6">
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
                            {invoiceNumber ? (
                                <>Invoice: {invoiceNumber}</>
                            ) : (
                                <>Order#{orderId}</>
                            )}
                        </h1>
                        <p className="w-full max-w-[410px] text-center text-gray-500 text-base leading-normal">
                            Our Chef has already picked up the spices and started preparing your order. Hold on! Its just a few minutes away.
                        </p>
                        {/* {order?.customerName && (
                            <p className="w-full max-w-[410px] text-center text-gray-600 text-sm leading-normal mt-2">
                                Order for {order.customerName}
                            </p>
                        )} */}
                    </div>
                </div>

                {locations.length > 0 && (
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
                                                    className="h-5 w-5 shrink-0"
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
                )}

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

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24 tablet:pt-28 desktop:pt-36">
                <div className="mx-auto flex w-full max-w-[648px] flex-col items-center justify-center gap-6">
                    <Loader message="Loading..." />
                </div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}

