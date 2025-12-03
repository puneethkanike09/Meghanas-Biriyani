import apiClient from '@/lib/api-client';

export interface MenuItem {
    itemId: string;
    itemName: string;
    price: number;
    status: string;
    categoryId: string;
    itemTagIds: string[];
    type: string;
    skuCode: string;
    measuringUnit: string;
    itemNature: string;
    isPriceIncludesTax: boolean;
    denyDiscount: boolean;
    barCode?: string;
    calorieCount?: number;
    extraInfo?: any;
}

export interface MenuResponse {
    items: MenuItem[];
    nextCursor?: string;
    hasMore: boolean;
}

export const MenuService = {
    getMenuItems: async (params?: any): Promise<MenuResponse> => {
        const response = await apiClient.get('/menu/items', { params });
        return response.data;
    },

    getCategories: async (): Promise<{ categories: any[], total: number }> => {
        const params = {
            branchCode: 'HO',
            channel: 'Meghana Web sale'
        };
        const response = await apiClient.get('/menu/catalog/categories', { params });
        return response.data;
    }
};
