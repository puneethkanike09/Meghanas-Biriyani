import apiClient from '@/lib/api-client';

export interface CustomerNamePhone {
    name: string;
    phone: string;
}

export interface UpdateNamePhoneRequest {
    name: string;
    phone: string;
}

export interface UpdateNamePhoneResponse {
    id: string;
    name: string;
    phone: string;
}

export const UserService = {
    // Get customer name and phone for the authenticated customer
    getNamePhone: async (): Promise<CustomerNamePhone> => {
        const response = await apiClient.get<CustomerNamePhone>('/users/customers/name-phone');
        return response.data;
    },

    // Update customer name and phone
    updateNamePhone: async (data: UpdateNamePhoneRequest): Promise<UpdateNamePhoneResponse> => {
        const response = await apiClient.patch<UpdateNamePhoneResponse>('/users/customers/name-phone', data);
        return response.data;
    },
};

