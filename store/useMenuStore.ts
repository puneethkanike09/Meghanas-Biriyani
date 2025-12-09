import { create } from 'zustand';
import { MenuService, Category, MenuItem } from '@/services/menu.service';

interface MenuState {
    categories: Category[];
    items: MenuItem[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchCategories: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
    categories: [],
    items: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        // If we already have categories or are loading, don't fetch again
        // You can add a forceRefresh param if needed later
        const state = get();
        if (state.loading || state.categories.length > 0) {
            return;
        }

        set({ loading: true, error: null });
        try {
            const response = await MenuService.getCategories();
            // Map response to Category[] if needed. 
            // The service returns { categories: any[] } according to page.tsx usage
            // app/(default)/menu/page.tsx line 37: response.categories.map(...)

            // Checking VibeSection.tsx line 37: setCategories(response.categories);
            // So response.categories IS the array.

            set({ categories: response.categories });
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            set({ error: "Failed to load categories" });
        } finally {
            set({ loading: false });
        }
    },
}));
