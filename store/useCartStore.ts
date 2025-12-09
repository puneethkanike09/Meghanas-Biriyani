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
    removeItem: (cartItemId: string) => Promise<void>;
    // Utility to get quantity of specific item
    getItemQuantity: (itemId: string) => number;
    getCartItemId: (itemId: string) => string | null;
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
        // Don't allow quantity 0 - use removeItem instead
        if (quantity <= 0) {
            console.warn("Cannot add item with quantity 0. Use removeItem instead.");
            return;
        }

        try {
            await CartService.addToCart(itemId, quantity);
            // After update, re-fetch cart to ensure sync
            await get().fetchCart();
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        }
    },

    removeItem: async (cartItemId: string) => {
        try {
            await CartService.removeItem(cartItemId);
            // After removal, re-fetch cart to ensure sync
            await get().fetchCart();
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            throw error;
        }
    },

    getItemQuantity: (itemId: string) => {
        const item = get().items.find(i => i.item_id === itemId); // Assuming item_id is key
        return item ? item.quantity : 0;
    },

    getCartItemId: (itemId: string) => {
        const item = get().items.find(i => i.item_id === itemId);
        return item ? item.cart_item_id : null;
    },

    cartCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
    }
}));
