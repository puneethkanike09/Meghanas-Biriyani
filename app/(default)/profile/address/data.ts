export type AddressType = "home" | "office" | "other";

export interface AddressItem {
    id: string | number; // Support both string (UUID from API) and number (for backward compatibility)
    label: string;
    type: AddressType;
    houseNumber: string;
    street: string;
    landmark?: string;
    city: string;
    pincode: string;
}

export const ADDRESS_TYPE_OPTIONS: Array<{ value: AddressType; label: string }> = [
    { value: "home", label: "Home" },
    { value: "office", label: "Work" },
    { value: "other", label: "Other" },
];

export const ADDRESS_TYPE_ICON_MAP: Record<AddressType, { src: string; alt: string }> = {
    home: {
        src: "/assets/profile/icons/Home.svg",
        alt: "Home address",
    },
    office: {
        src: "/assets/profile/icons/Building.svg",
        alt: "Work address",
    },
    other: {
        src: "/assets/profile/icons/Location.svg",
        alt: "Saved location",
    },
};

export const INITIAL_ADDRESSES: AddressItem[] = [
    {
        id: 1,
        label: "Koncept Nest",
        type: "home",
        houseNumber: "A201",
        street: "Ganapathi Nagar, Banashankari Stage I",
        landmark: "Near Koncept Nest Entrance",
        city: "Bengaluru, Karnataka",
        pincode: "560026",
    },
    {
        id: 2,
        label: "Office",
        type: "office",
        houseNumber: "3rd Floor, B14",
        street: "MG Road, Ashok Nagar",
        landmark: "Opposite MG Road Metro Station",
        city: "Bengaluru, Karnataka",
        pincode: "560001",
    },
    {
        id: 3,
        label: "Cousin's Place",
        type: "other",
        houseNumber: "132/4",
        street: "Indiranagar 2nd Stage",
        landmark: "Beside Central Park",
        city: "Bengaluru, Karnataka",
        pincode: "560038",
    },
];

export function formatAddress(address: AddressItem): string {
    const segments = [
        address.houseNumber,
        address.street,
        address.city,
        address.pincode ? `${address.pincode}` : "",
    ];

    if (address.landmark) {
        segments.push(address.landmark);
    }

    return segments.filter(Boolean).join(", ");
}

