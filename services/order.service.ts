import apiClient from '@/lib/api-client';

export interface OrderItem {
    shortName: string;
    longName: string;
    skuCode: string;
    itemId: string;
    quantity: number;
    unitPrice: number;
}

export interface DeliveryAddress {
    label: string;
    name?: string; // Optional name field
    addressLine: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    landmark?: string;
}

export interface Delivery {
    mode: string;
    address: DeliveryAddress;
}

export interface CreateOrderRequest {
    branchCode: string;
    channel: string;
    items: OrderItem[];
    delivery?: Delivery;
    status: string;
}

export interface CreateOrderResponse {
    orderId: string;
    status: string;
    message?: string;
    orderData?: {
        branchCode: string;
        totalAmount: number;
        items: OrderItem[];
    };
    // Legacy support - some APIs might return id instead
    id?: string;
}

export interface PaymentInitiateRequest {
    orderId: string;
    amount: number;
    gateway: string;
    currency: string;
}

export interface PaymentTransaction {
    transactionId: string;
    gatewayTransactionId: string;
    amount: number; // in paise
    currency: string;
    keyId: string;
    status: string;
}

export interface GetOrdersParams {
    page?: number;
    limit?: number;
}

export interface OrderItemResponse {
    id: string;
    shortName: string;
    quantity: string;
    unitPrice: string;
    itemTotalAmount: string;
}

export interface BillingBreakdown {
    itemTotal: string;
    packagingCharges: string;
    deliveryFee: string;
    taxes: string;
    totalBill: string;
}

export interface BranchAddress {
    name: string;
    addressLine: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

export interface OrderDeliveryAddress {
    label: string;
    name: string;
    addressLine: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    landmark?: string;
}

export interface OrderResponse {
    id: string;
    displayOrderId: string;
    ristaSaleId: string;
    invoiceNumber: string;
    customerId: string;
    branchCode: string;
    status: string;
    invoiceType: string;
    fulfillmentStatus: string;
    orderStatus: string;
    channel: string;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    itemTotalAmount: string;
    totalAmount: string;
    billAmount: string;
    createdAt: string;
    updatedAt: string;
    closedAt: string;
    deliveryDateTime: string;
    branchAddress: BranchAddress;
    deliveryAddress: OrderDeliveryAddress;
    items: OrderItemResponse[];
    payments: any[];
    billingBreakdown: BillingBreakdown;
    deliveryInfo?: any;
    sourceInfo?: any;
}

export interface GetOrdersResponse {
    orders: OrderResponse[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

export const OrderService = {
    // Create a new order
    createOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
        const response = await apiClient.post<CreateOrderResponse>('/orders', orderData);
        return response.data;
    },

    // Initiate payment for an order
    initiatePayment: async (paymentData: PaymentInitiateRequest): Promise<PaymentTransaction> => {
        const response = await apiClient.post<PaymentTransaction>('/payments/initiate', paymentData);
        return response.data;
    },

    // Get customer orders with pagination
    getOrders: async (params?: GetOrdersParams): Promise<GetOrdersResponse> => {
        const response = await apiClient.get<GetOrdersResponse>('/orders', {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 20,
            },
        });
        return response.data;
    },
};
