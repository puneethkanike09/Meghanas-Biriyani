"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { ADDRESS_TYPE_ICON_MAP, formatAddress, type AddressItem } from "../../profile/address/data";

interface DeliveryAddressCardProps {
    address: AddressItem;
    isSelected: boolean;
    isDeliverable: boolean;
    onSelect: () => void;
}

export default function DeliveryAddressCard({
    address,
    isSelected,
    isDeliverable,
    onSelect,
}: DeliveryAddressCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start gap-3">
                    <Image
                        src={ADDRESS_TYPE_ICON_MAP[address.type].src}
                        alt={ADDRESS_TYPE_ICON_MAP[address.type].alt}
                        width={20}
                        height={20}
                        className="mt-0.5 flex-shrink-0"
                    />
                    <div className="flex flex-1 min-w-0 flex-col gap-2">
                        <h3 className="text-base font-semibold text-midnight">
                            {address.label}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600">
                            {formatAddress(address)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pl-9">
                    {isSelected ? (
                        <Button
                            variant="selected"
                            className="h-auto px-3.5 py-2"
                            icon={
                                <Image
                                    src="/assets/cart/icons/Checkmark.svg"
                                    alt="Selected"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            }
                        >
                            Selected
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="primary"
                                onClick={onSelect}
                                disabled={!isDeliverable}
                                className="h-auto px-3.5 py-2"
                            >
                                Deliver Here
                            </Button>
                            {!isDeliverable && (
                                <span className="text-sm font-normal text-gray-600">
                                    Currently not deliverable
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

