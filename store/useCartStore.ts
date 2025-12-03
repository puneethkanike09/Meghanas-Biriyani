import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    isVegetarian: boolean;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, { ...item, quantity: 1 }] });
                }
            },
            removeItem: (itemId) => {
                set({ items: get().items.filter((i) => i.id !== itemId) });
            },
            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () =>
                get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
        }
    )
);
