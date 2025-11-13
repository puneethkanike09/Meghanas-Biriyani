export interface OrderDestination {
    name: string;
    address: string;
}

export interface OrderItem {
    name: string;
    price: string;
    isVeg: boolean;
    quantity: number;
}

export interface OrderCharge {
    label: string;
    value: string;
    emphasize?: boolean;
}

export interface Order {
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

