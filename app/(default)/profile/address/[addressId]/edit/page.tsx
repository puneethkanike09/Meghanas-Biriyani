import { notFound } from "next/navigation";
import AddressForm from "../../components/AddressForm";
import { INITIAL_ADDRESSES } from "../../data";

interface EditAddressPageProps {
    params: Promise<{
        addressId: string;
    }>;
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
    const { addressId: addressIdParam } = await params;
    const addressId = Number(addressIdParam);

    if (Number.isNaN(addressId)) {
        notFound();
    }

    const address = INITIAL_ADDRESSES.find((item) => item.id === addressId);

    if (!address) {
        notFound();
    }

    return <AddressForm mode="edit" address={address} />;
}

