import { create } from 'zustand';
import { CartService, CartItem } from '@/services/cart.service';

interface CartState {
    items: CartItem[];
    subtotal: number;
    tax: number;
    discount: number;
    deliveryFee: number;
    total: number;
    loading: boolean;

    // Actions
    fetchCart: () => Promise<void>;
    addItem: (itemId: string, quantity: number) => Promise<void>;
    // Utility to get quantity of specific item
    getItemQuantity: (itemId: string) => number;
    cartCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0,
    loading: false,

    fetchCart: async () => {
        set({ loading: true });
        try {
            const response = await CartService.getCart();
            if (response && response.cart) {
                // We need to map response items to our internal structure if needed
                // For now assuming response.cart.items aligns or we use it directly
                // The API response image shows "items": [] (empty), so we will need to see real data.
                // Assuming items have item_id, quantity, etc.
                const mappedItems = response.cart.items.map((i: any) => ({
                    ...i,
                    // Ensure we have standard fields if backend differs
                }));

                set({
                    items: mappedItems,
                    subtotal: response.cart.subtotal,
                    tax: response.cart.tax,
                    discount: response.cart.discount,
                    deliveryFee: response.cart.delivery_fee,
                    total: response.cart.total
                });
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            set({ loading: false });
        }
    },

    addItem: async (itemId: string, quantity: number) => {
        // Optimistic update could go here, but let's stick to server source of truth for now or simple optimistic
        // "this also updates the existing items quantity as we increase or decrese" - user
        // So we just post strict quantity? Or +/- 1? 
        // User said: "increase the quality we alawsy post with the itemid ok... updates the exisitng items qualititty"
        // This implies we send the NEW TOTAL quantity.

        try {
            await CartService.addToCart(itemId, quantity);
            // After update, re-fetch cart to ensure sync
            await get().fetchCart();
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        }
    },

    getItemQuantity: (itemId: string) => {
        const item = get().items.find(i => i.item_id === itemId); // Assuming item_id is key
        return item ? item.quantity : 0;
    },

    cartCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
    }
}));
