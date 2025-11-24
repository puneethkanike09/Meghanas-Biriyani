import Image from "next/image";
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

interface OrderDetailsDrawerProps {
    order: Order;
    totalItems: number;
    onClose: () => void;
}

export default function OrderDetailsDrawer({ order, totalItems, onClose }: OrderDetailsDrawerProps) {
    return (
        <div className="fixed inset-0 z-[80] flex">
            <div
                className="absolute inset-0 bg-gray-800/90"
                onClick={onClose}
            />
            <aside className="relative z-[81] ml-auto flex h-full w-full max-w-full flex-col bg-white shadow-2xl tablet:max-w-[420px]">
                <header className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div className="space-y-1">

                        <h2 className="text-2xl font-semibold text-midnight">
                            #{order.id}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center cursor-pointer"
                        aria-label="Close order details"
                    >
                        <Image
                            src="/assets/profile/icons/Dismiss.svg"
                            alt="Close drawer"
                            width={20}
                            height={20}
                        />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
                    {/* Locations */}
                    <section className="space-y-2.5">
                        {order.destinations.map((destination, index) => {
                            const isLast = index === order.destinations.length - 1;
                            return (
                                <div key={`${destination.name}-${index}`} className="flex items-stretch gap-3">
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
                                            {destination.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            {destination.address}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <div className="h-px bg-gray-200" />

                    {/* Status */}
                    <section className="space-y-2">
                        <div className="inline-flex items-center gap-2">
                            <Image
                                src={
                                    order.status === "delivered"
                                        ? "/assets/profile/icons/CheckmarkCircle.svg"
                                        : "/assets/profile/icons/DismissCircle.svg"
                                }
                                alt={
                                    order.status === "delivered"
                                        ? "Order delivered"
                                        : "Order cancelled"
                                }
                                width={20}
                                height={20}
                            />
                            <span className="text-sm font-semibold text-midnight">
                                {order.statusText}
                            </span>
                        </div>
                        <time className="block text-xs text-gray-600">
                            {order.date}
                        </time>
                    </section>

                    <div className="h-px bg-gray-200" />

                    {/* Items */}
                    <section className="space-y-3">
                        <p className="text-xs text-gray-600">
                            {totalItems} {totalItems === 1 ? "Item" : "Items"}
                        </p>
                        <ul className="space-y-3">
                            {order.menuItems.map((item, index) => (
                                <li key={`${item.name}-${index}`} className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={
                                                item.isVeg
                                                    ? "/assets/profile/icons/VegSymbol.svg"
                                                    : "/assets/profile/icons/NonVegSymbol.svg"
                                            }
                                            alt={item.isVeg ? "Vegetarian item" : "Non vegetarian item"}
                                            width={14}
                                            height={14}
                                            className="h-3.5 w-3.5"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-midnight">
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-normal text-gray-700">
                                        {item.price}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className="h-px bg-gray-200" />

                    {/* Charges */}
                    <section className="space-y-2">
                        {order.charges.map((charge) => (
                            <div key={charge.label} className="flex items-center justify-between gap-2">
                                <span
                                    className={`text-xs ${charge.emphasize ? "font-semibold text-midnight" : "font-normal text-gray-600"
                                        }`}
                                >
                                    {charge.label}
                                </span>
                                <span className="text-xs font-normal text-gray-700">
                                    {charge.value}
                                </span>
                            </div>
                        ))}
                    </section>

                    <div className="h-px bg-gray-200" />

                    {/* Footer */}
                    <section className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-midnight">
                                {order.paymentMethod}
                            </span>
                            <span className="text-xs font-semibold text-midnight">
                                Total Bill: {order.totalAmount}
                            </span>
                        </div>
                    </section>
                </div>
            </aside>
        </div>
    );
}


