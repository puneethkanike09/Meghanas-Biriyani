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
    street_locality_area: string;
    landmark?: string;
    city: string;
    pincode: string;
    address_type: 'HOME' | 'WORK' | 'OTHER';
    location?: string;
}

export interface AddressListResponse {
    addresses: Address[];
}


export const AddressService = {
    addAddress: async (addressData: AddressRequest): Promise<Address> => {
        const response = await apiClient.post<Address>('/users/customers/addresses', addressData);
        return response.data;
    },

    // Get all addresses for the authenticated customer
    getAddresses: async (): Promise<AddressListResponse> => {
        const response = await apiClient.get<AddressListResponse>('/users/customers/addresses');
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
