"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

interface Order {
    id: string;
    images: string[];
    status: "delivered" | "cancelled" | "processing";
    statusText: string;
    date: string;
    items: string;
    price: string;
    extraCount?: string;
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
        items: "Chicken Biriyani x1, Panner 65 x1, Pepper Chicken x1",
        price: "₹649",
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
        date: "Thu, Sep 15, 2025, 10:00 PM",
        items: "Chicken Biriyani x1, Panner 65 x1, Pepper Chicken x1",
        price: "₹649",
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
        date: "Thu, Sep 15, 2025, 10:00 PM",
        items: "Chicken Biriyani x1, Panner 65 x1, Pepper Chicken x1, Chilly Chicken (Andhra Style) x1, Golden Baby Corn x1",
        price: "₹649",
        extraCount: "+2",
    },
];

export default function OrdersTab() {
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
                {ordersData.map((order, index) => (
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
                                    {order.extraCount && (
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl border border-gray-300 flex items-center justify-center">
                                            <span className="text-sm font-normal text-midnight">
                                                {order.extraCount}
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
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                order.status === "delivered"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {order.status === "delivered" ? (
                                                <span className="text-white text-xs">✓</span>
                                            ) : (
                                                <span className="text-white text-xs">✕</span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold text-midnight">
                                            {order.statusText}
                                        </h3>
                                    </div>
                                    <div className="text-sm font-normal text-gray-600">
                                        {order.date}
                                    </div>
                                    <div className="text-sm font-normal text-midnight">
                                        {order.items}
                                    </div>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex desktop:flex-col items-center desktop:items-end justify-between desktop:justify-start gap-3 w-full desktop:w-auto">
                                <button className="text-sm font-semibold text-tango hover:underline">
                                    View Details
                                </button>
                                <div className="text-sm font-semibold text-midnight">
                                    {order.price}
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
                ))}
            </div>

            {/* Load More Button */}
            <Button
                variant="neutral"
                className="w-full"
            >
                Show More Orders
            </Button>
        </div>
    );
}

