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

export interface GetOrdersResponse {
    orders: any[]; // Will be refined based on actual API response
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


