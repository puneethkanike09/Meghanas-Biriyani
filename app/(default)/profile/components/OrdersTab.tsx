"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import { OrderService } from "@/services/order.service";

interface OrderDestination {
    name: string;
    address: string;
}

interface OrderItem {
    name: string;
    price: string;
    isVeg: boolean;
    quantity: number;
}

interface OrderCharge {
    label: string;
    value: string;
    emphasize?: boolean;
}

interface Order {
    id: string;
    images: string[];
    status: "delivered" | "cancelled" | "processing";
    statusText: string;
    date: string;
    menuItems: OrderItem[];
    destinations: OrderDestination[];
    charges: OrderCharge[];
    paymentMethod: string;
    totalAmount: string;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return dateString;
    }
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

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

// Helper function to map API order to UI Order format
const mapApiOrderToUIOrder = (apiOrder: any): Order => {
    // Map status based on fulfillmentStatus and orderStatus
    let status: "delivered" | "cancelled" | "processing" = "processing";
    let statusText = apiOrder.orderStatus || "Processing";

    const fulfillmentStatus = apiOrder.fulfillmentStatus?.toUpperCase();
    if (fulfillmentStatus === "DELIVERED" || fulfillmentStatus === "COMPLETED") {
        status = "delivered";
        statusText = apiOrder.orderStatus || "Order Delivered";
    } else if (fulfillmentStatus === "CANCELLED" || fulfillmentStatus === "CANCELED" || apiOrder.status?.toUpperCase() === "CANCELLED") {
        status = "cancelled";
        statusText = apiOrder.orderStatus || "Order Cancelled";
    } else {
        statusText = apiOrder.orderStatus || "Processing";
    }

    // Map items - itemTotalAmount is the total for the item (unitPrice * quantity)
    const menuItems: OrderItem[] = (apiOrder.items || []).map((item: any) => ({
        name: item.shortName || "Unknown Item",
        price: formatCurrency(parseFloat(item.itemTotalAmount || "0")), // Total price for this item (unitPrice * quantity)
        isVeg: false, // Default, can be enhanced if API provides this
        quantity: parseInt(item.quantity || "1", 10),
    }));

    // Use placeholder images (API doesn't provide item images)
    const images = menuItems.map(() => "/assets/homepage/images/top10.jpg");

    // Map charges from billingBreakdown
    const billingBreakdown = apiOrder.billingBreakdown || {};
    const charges: OrderCharge[] = [];

    if (billingBreakdown.itemTotal) {
        charges.push({
            label: "Item Total",
            value: formatCurrency(parseFloat(billingBreakdown.itemTotal)),
            emphasize: true
        });
    }

    if (billingBreakdown.packagingCharges && parseFloat(billingBreakdown.packagingCharges) > 0) {
        charges.push({
            label: "Packaging Charges",
            value: formatCurrency(parseFloat(billingBreakdown.packagingCharges))
        });
    }

    if (billingBreakdown.deliveryFee && parseFloat(billingBreakdown.deliveryFee) > 0) {
        charges.push({
            label: "Delivery Fee",
            value: formatCurrency(parseFloat(billingBreakdown.deliveryFee))
        });
    }

    if (billingBreakdown.taxes && parseFloat(billingBreakdown.taxes) > 0) {
        charges.push({
            label: "Taxes",
            value: formatCurrency(parseFloat(billingBreakdown.taxes))
        });
    }

    // Map destinations - branch address and delivery address
    const destinations: OrderDestination[] = [];

    if (apiOrder.branchAddress) {
        destinations.push({
            name: apiOrder.branchAddress.name || "Branch",
            address: formatAddress(apiOrder.branchAddress),
        });
    }

    if (apiOrder.deliveryAddress) {
        destinations.push({
            name: apiOrder.deliveryAddress.label || "Delivery Address",
            address: formatAddress(apiOrder.deliveryAddress),
        });
    }

    // Determine payment method from payments array or tags
    let paymentMethod = "Paid";
    if (apiOrder.payments && apiOrder.payments.length > 0) {
        const payment = apiOrder.payments[0];
        paymentMethod = payment.method || payment.gateway || "Paid";
    } else if (apiOrder.tags && Array.isArray(apiOrder.tags)) {
        // Check for COD tag
        if (apiOrder.tags.some((tag: string) => tag.toLowerCase() === "cod")) {
            paymentMethod = "Cash on Delivery";
        }
    }

    // Use displayOrderId or invoiceNumber for display
    const displayId = apiOrder.displayOrderId || apiOrder.invoiceNumber || apiOrder.id;

    return {
        id: displayId,
        images: images.length > 0 ? images : ["/assets/homepage/images/top10.jpg"],
        status,
        statusText,
        date: formatDate(apiOrder.createdAt || apiOrder.deliveryDateTime || new Date().toISOString()),
        menuItems,
        destinations,
        charges,
        paymentMethod,
        totalAmount: formatCurrency(parseFloat(billingBreakdown.totalBill || apiOrder.billAmount || apiOrder.totalAmount || 0)),
    };
};

export default function OrdersTab() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Fetch orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await OrderService.getOrders({ page: 1, limit: 20 });

                if (response.orders && Array.isArray(response.orders)) {
                    const mappedOrders = response.orders.map(mapApiOrderToUIOrder);
                    setOrders(mappedOrders);

                    // Check if there are more pages
                    if (response.totalPages) {
                        setHasMore(page < response.totalPages);
                    } else {
                        setHasMore(response.orders.length >= (response.limit || 20));
                    }
                } else {
                    setOrders([]);
                    setHasMore(false);
                }
            } catch (error: any) {
                console.error("Failed to fetch orders:", error);
                let errorMessage = "Failed to load orders";
                if (error.response?.data?.message) {
                    const msg = error.response.data.message;
                    errorMessage = Array.isArray(msg) ? msg.join(", ") : msg;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                toast.error(errorMessage);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Load more orders
    const handleLoadMore = async () => {
        if (isLoadingMore || !hasMore) return;

        try {
            setIsLoadingMore(true);
            const nextPage = page + 1;
            const response = await OrderService.getOrders({ page: nextPage, limit: 20 });

            if (response.orders && Array.isArray(response.orders)) {
                const mappedOrders = response.orders.map(mapApiOrderToUIOrder);
                setOrders((prev) => [...prev, ...mappedOrders]);
                setPage(nextPage);

                // Check if there are more pages
                if (response.totalPages) {
                    setHasMore(nextPage < response.totalPages);
                } else {
                    setHasMore(response.orders.length >= (response.limit || 20));
                }
            } else {
                setHasMore(false);
            }
        } catch (error: any) {
            console.error("Failed to load more orders:", error);
            toast.error("Failed to load more orders");
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        if (selectedOrder) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
        return undefined;
    }, [selectedOrder]);

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
    };

    const closeDrawer = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="flex flex-col gap-6 py-6 tablet:py-6 desktop:py-0">
            {/* Header */}
            <header className="flex items-center justify-between py-3 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-midnight">
                    Past Orders
                </h1>
            </header>

            {/* Orders List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader message="Loading orders..." />
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <p className="text-gray-500">No orders found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order, index) => {
                        const itemsSummary = order.menuItems
                            .map((item) => `${item.name} x${item.quantity}`)
                            .join(", ");
                        const hasExtraImages = order.images.length > 3;
                        const extraCount = hasExtraImages ? `+${order.images.length - 3}` : undefined;

                        return (
                            <div
                                key={`${order.id}-${index}`}
                                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-4"
                            >
                                {/* Order Content */}
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    {/* Left Section */}
                                    <div className="flex flex-col gap-6 flex-1 min-w-[220px]">
                                        {/* Images */}
                                        <div className="flex items-start gap-3">
                                            {order.images.slice(0, 3).map((image, imgIndex) => (
                                                <div
                                                    key={imgIndex}
                                                    className="relative w-16 h-16 rounded-xl overflow-hidden"
                                                >
                                                    <Image
                                                        src={image}
                                                        alt="Food item"
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                </div>
                                            ))}
                                            {extraCount && (
                                                <div className="w-16 h-16 bg-gray-100 rounded-xl border border-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-normal text-midnight">
                                                        {extraCount}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Order Details */}
                                        <div className="flex flex-col gap-2">
                                            <div className="text-sm font-normal text-midnight">
                                                {order.id.startsWith('#') ? order.id : `ORDER ${order.id}`}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={
                                                        order.status === "delivered"
                                                            ? "/assets/profile/icons/CheckmarkCircle.svg"
                                                            : "/assets/profile/icons/DismissCircle.svg"
                                                    }
                                                    alt={
                                                        order.status === "delivered"
                                                            ? "Delivered"
                                                            : "Cancelled"
                                                    }
                                                    width={24}
                                                    height={24}
                                                />
                                                <h3 className="text-xl font-semibold text-midnight">
                                                    {order.statusText}
                                                </h3>
                                            </div>
                                            <div className="text-sm font-normal text-gray-600">
                                                {order.date}
                                            </div>
                                            <div className="text-sm font-normal text-midnight">
                                                {itemsSummary}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <button
                                            className="text-sm font-semibold text-tango hover:underline cursor-pointer"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            View Details
                                        </button>
                                        <div className="text-sm font-semibold text-midnight">
                                            {order.totalAmount}
                                        </div>
                                    </div>
                                </div>

                                {/* Separator */}
                                <div className="h-px bg-gray-200" />

                                {/* Actions */}
                                <div className="flex items-center gap-4">
                                    <button className="flex-1 text-sm font-semibold text-tango hover:underline text-center cursor-pointer">
                                        Reorder
                                    </button>
                                    <button className="flex-1 text-sm font-semibold text-gray-600 hover:underline text-center cursor-pointer">
                                        Help
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Load More Button */}
            {hasMore && !isLoading && (
                <Button
                    variant="neutral"
                    className="w-full"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                >
                    {isLoadingMore ? "Loading..." : "Show More Orders"}
                </Button>
            )}
            {selectedOrder && (
                <OrderDetailsDrawer
                    order={selectedOrder}
                    onClose={closeDrawer}
                    totalItems={selectedOrder.menuItems.reduce((sum, item) => sum + item.quantity, 0)}
                />
            )}
        </div>
    );
}