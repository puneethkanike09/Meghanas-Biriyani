import apiClient from "@/lib/api-client";

export interface CartItem {
    item_id: string;
    quantity: number;
    price?: number;
    name?: string;
    is_veg?: boolean;
    image?: string;
}

export interface AddTimeRequest {
    item_id: string;
    branch_code: string;
    channel: string;
    quantity: number;
    options: any[];
}

export interface CartResponse {
    cart: {
        customer_id: string;
        branch_code: string;
        channel: string;
        items: any[]; // We will refine this once we see the actual structure, assuming array of objects
        subtotal: number;
        tax: number;
        discount: number;
        delivery_fee: number;
        total: number;
        updated_at: string;
    };
    issues: any[];
}

export const CartService = {
    addToCart: async (itemId: string, quantity: number): Promise<any> => {
        const payload: AddTimeRequest = {
            item_id: String(itemId), // Ensure string
            branch_code: "HO", // Hardcoded as per requirement
            channel: "Meghana Web sale", // Hardcoded as per requirement
            quantity: Number(quantity), // Ensure number
            options: [] // Ensure array
        };
        const response = await apiClient.post('/cart/items', payload);
        return response.data;
    },

    getCart: async (): Promise<CartResponse> => {
        const response = await apiClient.get('/cart', {
            params: {
                branchCode: "HO",
                channel: "Meghana Web sale"
            }
        });
        return response.data;
    }
};
