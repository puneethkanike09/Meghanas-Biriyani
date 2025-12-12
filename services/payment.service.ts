import apiClient from '@/lib/api-client';

export interface OrderItem {
    id: string;
    orderId: string;
    itemSequence: number;
    itemId: string;
    shortName: string;
    longName: string;
    variants: string;
    skuCode: string;
    quantity: string;
    unitPrice: string;
    itemAmount: string;
    itemTotalAmount: string;
}

export interface DeliveryInfo {
    id: string;
    orderId: string;
    mode: string;
    addressLabel: string;
    addressLine: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    landmark?: string;
    name?: string;
    phoneNumber?: string;
    email?: string;
}

export interface OrderDetails {
    id: string;
    customerId: string;
    branchCode: string;
    status: string;
    fulfillmentStatus: string;
    channel: string;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    totalAmount: string;
    netAmount: string;
    billAmount: string;
    deliveryInfo: DeliveryInfo;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface BranchAddress {
    name: string;
    addressLine: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

export interface PaymentStatusResponse {
    transactionId: string;
    orderId: string;
    invoiceNumber: string;
    status: string;
    amount: string;
    currency: string;
    gateway: string;
    gatewayTransactionId: string;
    createdAt: string;
    updatedAt: string;
    order: OrderDetails;
    branchAddress: BranchAddress;
}

export const PaymentService = {
    /**
     * Get payment status by transaction ID
     * @param transactionId - The transaction ID from the payment gateway
     * @returns Payment status details
     */
    getPaymentStatus: async (transactionId: string): Promise<PaymentStatusResponse> => {
        const response = await apiClient.get<PaymentStatusResponse>(
            `/payments/status/${transactionId}`
        );
        return response.data;
    },
};

