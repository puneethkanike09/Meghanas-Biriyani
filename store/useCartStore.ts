import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
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
    addItem: (itemId: string, quantity: number, details?: { name: string, price: number, image?: string }) => Promise<void>;
    removeItem: (cartItemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    syncCart: () => Promise<boolean>;
    // Utility to get quantity of specific item
    getItemQuantity: (itemId: string) => number;
    getCartItemId: (itemId: string) => string | null;
    cartCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            subtotal: 0,
            tax: 0,
            discount: 0,
            deliveryFee: 0,
            total: 0,
            loading: false,
            // Removed itemTimeouts/pendingUpdates as we are now local-first

            fetchCart: async () => {
                if (get().loading) return;
                set({ loading: true });
                try {
                    const response = await CartService.getCart();
                    if (response && response.cart) {
                        set({
                            items: response.cart.items.map((i: any) => ({ ...i })),
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

            addItem: async (itemId: string, quantity: number, details?: { name: string, price: number, image?: string }) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(i => i.item_id === itemId);

                let newItems = [...currentItems];

                if (existingItem) {
                    // Update existing
                    if (quantity <= 0) {
                        newItems = newItems.filter(i => i.item_id !== itemId);
                    } else {
                        newItems = newItems.map(i =>
                            i.item_id === itemId
                                ? { ...i, quantity, item_total: i.base_price * quantity }
                                : i
                        );
                    }
                } else {
                    // Add new item
                    if (quantity <= 0) return;

                    if (!details) {
                        console.error("Cannot add new item without details", itemId);
                        // Fallback: Try to fetch cart? No, strictly local.
                        // We could throw or ignore.
                        return;
                    }

                    newItems.push({
                        item_id: itemId,
                        quantity,
                        cart_item_id: `local-${itemId}-${Date.now()}`,
                        name: details.name,
                        item_name: details.name,
                        base_price: details.price,
                        item_total: details.price * quantity,
                        image_url: details.image || "",
                        options: [],
                        options_price: 0,
                        is_price_includes_tax: false,
                        tax_rate: 0,
                        stock_reservation_id: ""
                    } as CartItem);
                }

                // Recalculate Totals Locally
                const subtotal = newItems.reduce((acc, item) => acc + (item.base_price * item.quantity), 0);
                const tax = subtotal * 0.05; // Mock 5% tax
                const deliveryFee = subtotal > 500 ? 0 : 40; // Mock rule
                const total = subtotal + tax + deliveryFee;

                set({
                    items: newItems,
                    subtotal,
                    tax,
                    deliveryFee,
                    total
                });
            },

            removeItem: async (cartItemId: string) => {
                const currentItems = get().items;
                const newItems = currentItems.filter(i => i.cart_item_id !== cartItemId);

                // Recalculate Totals
                const subtotal = newItems.reduce((acc, item) => acc + (item.base_price * item.quantity), 0);
                const tax = subtotal * 0.05;
                const deliveryFee = subtotal > 500 ? 0 : 40;
                const total = subtotal + tax + deliveryFee;

                set({
                    items: newItems,
                    subtotal,
                    tax,
                    deliveryFee,
                    total
                });
            },

            clearCart: async () => {
                set({ items: [], subtotal: 0, tax: 0, discount: 0, deliveryFee: 0, total: 0 });
                // We don't clear server here? Yes we should probably clearing server if connected.
                // But for local-first, we clear local.
                try {
                    await CartService.clearCart();
                } catch (e) {
                    console.error("Failed to clear server cart", e);
                }
            },

            syncCart: async () => {
                const items = get().items;
                if (items.length === 0) return true;

                set({ loading: true });
                try {
                    // Strategy: Clear server cart then add all items?
                    // Or precise sync?
                    //Simplest for "Place Order" is to ensure server has these items.
                    // We'll trust the bulk add if API supports it, or sequential.
                    // Since we don't have bulk add, sequential.

                    // First, get current server cart to see diff? too complex.
                    // Just clear and re-populate is safest to guarantee state matches local.
                    await CartService.clearCart();

                    // Add items sequentially (Promise.all might fail race conditions on backend?)
                    // Best to do sequential.
                    for (const item of items) {
                        try {
                            await CartService.addToCart(item.item_id, item.quantity);
                        } catch (itemError: any) {
                            console.error(`Failed to sync item ${item.item_name}:`, itemError);
                            // Extract validation message if possible
                            let errorMessage = "Failed to sync item.";
                            if (itemError.response?.data?.message) {
                                const msg = itemError.response.data.message;
                                errorMessage = Array.isArray(msg) ? msg.join(", ") : msg;
                            }
                            toast.error(`${item.item_name}: ${errorMessage}`);
                            // If one fails, should we stop?
                            // Yes, because checkout would be partial.
                            // We should probably throw to stop the process.
                            throw itemError;
                        }
                    }

                    // Finally fetch to get authoritative calculations
                    const response = await CartService.getCart();
                    if (response && response.cart) {
                        set({
                            items: response.cart.items.map((i: any) => ({ ...i })),
                            subtotal: response.cart.subtotal,
                            tax: response.cart.tax,
                            discount: response.cart.discount,
                            deliveryFee: response.cart.delivery_fee,
                            total: response.cart.total
                        });
                    }
                    return true;

                } catch (error: any) {
                    console.error("Sync failed:", error);
                    let generalError = "Failed to sync cart. Please try again.";
                    if (error.response?.data?.message) {
                        const msg = error.response.data.message;
                        generalError = Array.isArray(msg) ? msg.join(", ") : msg;
                    }
                    toast.error(generalError);
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            getItemQuantity: (itemId: string) => {
                const item = get().items.find(i => i.item_id === itemId);
                return item ? item.quantity : 0;
            },

            getCartItemId: (itemId: string) => {
                const item = get().items.find(i => i.item_id === itemId);
                return item ? item.cart_item_id : null;
            },

            cartCount: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
            }
        }),
        {
            name: 'cart-storage', // name of the item in the storage (must be unique)
            // storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            skipHydration: false, // Enable auto-hydration
            // Actually, auto hydration is fine usually.
            // But to avoid Hydration Mismatch, we might need a "hydrated" flag.
            // For now, let's use default settings but verify `localStorage` usage.
        }
    )
);
