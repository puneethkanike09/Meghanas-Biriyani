import apiClient from '@/lib/api-client';

export interface OrderItem {
    shortName: string;
    longName: string;
    skuCode: string;
    itemId: string;
    quantity: number;
    unitPrice: number;
}

export interface CreateOrderRequest {
    branchCode: string;
    channel: string;
    items: OrderItem[];
    status: string;
}

export interface CreateOrderResponse {
    id: string;
    branchCode: string;
    channel: string;
    items: OrderItem[];
    status: string;
    createdAt?: string;
    updatedAt?: string;
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
};


