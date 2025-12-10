import apiClient from '@/lib/api-client';

export interface AddressRequest {
    label: string;
    houseFlatDoorNumber: string;
    streetLocalityArea: string;
    landmark?: string;
    city: string;
    pincode: string;
    addressType: 'HOME' | 'WORK' | 'OTHER';
}

export interface Address {
    id: string;
    label: string;
    house_flat_door_number: string;
    appartment_road_area: string;
    landmark?: string;
    city: string;
    pincode: string;
    address_type: string;
    location?: string;
}


export const AddressService = {
    addAddress: async (addressData: AddressRequest): Promise<Address> => {
        const response = await apiClient.post<Address>('/users/customers/addresses', addressData);
        return response.data;
    },

    // Placeholder for future methods
    getAddresses: async (): Promise<Address[]> => {
        const response = await apiClient.get<Address[]>('/users/customers/addresses');
        return response.data;
    },

    updateAddress: async (id: string, addressData: Partial<AddressRequest>): Promise<Address> => {
        const response = await apiClient.patch<Address>(`/users/customers/addresses/${id}`, addressData);
        return response.data;
    },

    deleteAddress: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/customers/addresses/${id}`);
    },
};
