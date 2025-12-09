import apiClient from '@/lib/api-client';

export interface Option {
    optionId: string;
    itemId: string;
    optionName: string;
    isDefault: boolean;
    displayOrder: number;
    price: number;
    isOutOfStock: boolean;
}

export interface OptionSet {
    optionSetId: string;
    name: string;
    displayName: string;
    description: string;
    min: number;
    max: number;
    options: Option[];
}

export interface Category {
    categoryId: string;
    name: string;
    displayOrder: number;
}

export interface ExtraInfo {
    calorieCount: number;
    portionSizeUnit: string;
    serveSizeUnit: string;
    carbohydrates: number;
    totalFat: number;
    protein: number;
    vitamins: any[];
    minerals: any[];
}

export interface MenuItem {
    itemId: string;
    type: string;
    skuCode: string;
    price: number;
    itemName: string;
    imageURL?: string;
    status: string;
    isOutOfStock: boolean;
    measuringUnit: string;
    chargeIds: string[];
    taxTypeIds: string[];
    categoryId: string;
    category: Category;
    itemTagIds: string[];
    scheduleIds: string[];
    itemNature: string;
    isPriceIncludesTax: boolean;
    denyDiscount: boolean;
    optionSetIds: string[];
    optionSets: OptionSet[];
    calorieCount: number;
    extraInfo: ExtraInfo;
    barCode?: string;
}

export interface MenuResponse {
    items: MenuItem[];
    nextCursor?: string;
    hasMore: boolean;
}

export const MenuService = {
    getMenuItems: async (params?: any): Promise<MenuResponse> => {
        const defaultParams = {
            branchCode: 'HO',
            channel: 'Meghana Web sale',
            limit: params?.categoryId ? 100 : 100, // 10000 for "All", 100 for specific category
            ...params
        };
        const response = await apiClient.get('/menu/items', { params: defaultParams });
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
