"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import OrderDetailsDrawer from "./OrderDetailsDrawer";

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

const ordersData: Order[] = [
    {
        id: "1234567890",
        images: [
            "/assets/homepage/images/top10.jpg",
            "/assets/homepage/images/top10.jpg",
            "/assets/homepage/images/top10.jpg",
        ],
        status: "delivered",
        statusText: "Order Delivered",
        date: "Thu, Sep 15, 2025, 10:00 PM",
        menuItems: [
            { name: "Chicken Biriyani", price: "₹349", isVeg: false, quantity: 1 },
            { name: "Paneer 65", price: "₹249", isVeg: true, quantity: 1 },
            { name: "Pepper Chicken", price: "₹299", isVeg: false, quantity: 1 },
        ],
        destinations: [
            { name: "Meghana Foods", address: "Koramangala, Bengaluru" },
            {
                name: "Koncept Nest",
                address: "Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India. Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India.",
            },
            {
                name: "Koncept Nest",
                address: "Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India.",
            },
            {
                name: "Koncept Nest",
                address: "Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India.",
            },
        ],
        charges: [
            { label: "Item Total", value: "₹897", emphasize: true },
            { label: "Restaurant Packaging Charges", value: "₹10" },
            { label: "Delivery Fee", value: "₹35" },
            { label: "Taxes", value: "₹10.47" },
        ],
        paymentMethod: "Paid Via UPI",
        totalAmount: "₹952.47",
    },
    {
        id: "1234567891",
        images: [
            "/assets/homepage/images/top10.jpg",
            "/assets/homepage/images/top10.jpg",
            "/assets/homepage/images/top10.jpg",
        ],
        status: "delivered",
        statusText: "Order Delivered",
        date: "Wed, Sep 14, 2025, 09:15 PM",
        menuItems: [
            { name: "Chicken Biriyani", price: "₹349", isVeg: false, quantity: 1 },
            { name: "Paneer 65", price: "₹249", isVeg: true, quantity: 1 },
            { name: "Butter Naan", price: "₹89", isVeg: true, quantity: 2 },
        ],
        destinations: [
            { name: "Meghana Foods", address: "Indiranagar, Bengaluru" },
            {
                name: "Koncept Nest",
                address: "Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India.",
            },
        ],
        charges: [
            { label: "Item Total", value: "₹776", emphasize: true },
            { label: "Restaurant Packaging Charges", value: "₹12" },
            { label: "Delivery Fee", value: "₹30" },
            { label: "Taxes", value: "₹9.14" },
        ],
        paymentMethod: "Paid Via UPI",
        totalAmount: "₹827.14",
    },
    {
        id: "1234567892",
        images: [
            "/assets/homepage/images/top10.jpg",
            "/assets/homepage/images/top10.jpg",
            "/assets/homepage/images/top10.jpg",
            "/assets/homepage/images/top10.jpg",
        ],
        status: "cancelled",
        statusText: "Order Cancelled",
        date: "Tue, Sep 13, 2025, 08:45 PM",
        menuItems: [
            { name: "Chicken Biriyani", price: "₹349", isVeg: false, quantity: 1 },
            { name: "Paneer 65", price: "₹249", isVeg: true, quantity: 1 },
            { name: "Pepper Chicken", price: "₹299", isVeg: false, quantity: 1 },
            { name: "Golden Baby Corn", price: "₹199", isVeg: true, quantity: 1 },
            { name: "Chilly Chicken (Andhra Style)", price: "₹259", isVeg: false, quantity: 1 },
        ],
        destinations: [
            { name: "Meghana Foods", address: "HSR Layout, Bengaluru" },
            {
                name: "Koncept Nest",
                address: "Ganapathi Nagar, Banashankari Stage I, Banashankari, Bengaluru, Karnataka 560026, India.",
            },
        ],
        charges: [
            { label: "Item Total", value: "₹1,355", emphasize: true },
            { label: "Restaurant Packaging Charges", value: "₹12" },
            { label: "Delivery Fee", value: "₹40" },
            { label: "Taxes", value: "₹18.20" },
        ],
        paymentMethod: "Payment Failed",
        totalAmount: "₹1,425.20",
    },
];

export default function OrdersTab() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
            <div className="flex flex-col gap-4">
                {ordersData.map((order, index) => {
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
                            <div className="flex flex-col desktop:flex-row items-start justify-between gap-4">
                                {/* Left Section */}
                                <div className="flex flex-col gap-6 flex-1 w-full">
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
                                            ORDER #{order.id}
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
                                <div className="flex desktop:flex-col items-center desktop:items-end justify-between desktop:justify-start gap-3 w-full desktop:w-auto">
                                    <button
                                        className="text-sm font-semibold text-tango hover:underline"
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
                                <button className="flex-1 text-sm font-semibold text-tango hover:underline text-center">
                                    Reorder
                                </button>
                                <button className="flex-1 text-sm font-semibold text-gray-600 hover:underline text-center">
                                    Help
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Load More Button */}
            <Button
                variant="neutral"
                className="w-full"
            >
                Show More Orders
            </Button>
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