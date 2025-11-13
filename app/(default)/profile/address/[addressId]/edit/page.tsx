import { notFound } from "next/navigation";
import AddressForm from "../../components/AddressForm";
import { INITIAL_ADDRESSES } from "../../data";

interface EditAddressPageProps {
    params: {
        addressId: string;
    };
}

export default function EditAddressPage({ params }: EditAddressPageProps) {
    const addressId = Number(params.addressId);

    if (Number.isNaN(addressId)) {
        notFound();
    }

    const address = INITIAL_ADDRESSES.find((item) => item.id === addressId);

    if (!address) {
        notFound();
    }

    return <AddressForm mode="edit" address={address} />;
}

