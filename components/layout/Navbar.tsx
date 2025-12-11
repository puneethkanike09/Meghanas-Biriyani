"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";
import { AddressService } from "@/services/address.service";
import { ADDRESS_TYPE_ICON_MAP, formatAddress, type AddressItem, type AddressType } from "@/app/(default)/profile/address/data";
import { cn } from "@/lib/utils";

const ICONS = {
    location: "/assets/navbar/icons/Location.svg",
    search: "/assets/navbar/icons/Search.svg",
    profile: "/assets/navbar/icons/Person.svg",
    cart: "/assets/navbar/icons/Cart.svg",
};

export default function Navbar() {
    const { cartCount } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const count = cartCount();
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(null);
    const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const addressDropdownRef = useRef<HTMLDivElement>(null);

    // Only render badge after client-side hydration to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setIsLoadingAddresses(true);
                const response = await AddressService.getAddresses();

                // Map API response to UI format
                const mappedAddresses: AddressItem[] = response.addresses.map((addr) => ({
                    id: addr.id,
                    label: addr.label,
                    type: (addr.address_type.toLowerCase() === 'work' ? 'office' : addr.address_type.toLowerCase()) as AddressType,
                    houseNumber: addr.house_flat_door_number,
                    street: addr.street_locality_area,
                    landmark: addr.landmark,
                    city: addr.city,
                    pincode: addr.pincode,
                }));

                setAddresses(mappedAddresses);

                // Auto-select first address if available
                if (mappedAddresses.length > 0 && !selectedAddress) {
                    setSelectedAddress(mappedAddresses[0]);
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        fetchAddresses();
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        if (!isAddressDropdownOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                addressDropdownRef.current &&
                !addressDropdownRef.current.contains(event.target as Node)
            ) {
                setIsAddressDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAddressDropdownOpen]);


    return (
        <div className="fixed top-0 left-0 right-0 z-50 desktop:top-4 desktop:px-16">
            <nav className="w-full mx-auto desktop:rounded-2xl bg-white py-3 shadow-md  tablet:py-3 desktop:py-4">
                <div className="px-4 tablet:px-8 desktop:px-8 flex items-center justify-between gap-3 tablet:gap-4 desktop:gap-10">
                    {/* Left Section */}
                    <div className="flex items-center gap-2 tablet:gap-4 desktop:gap-8 desktop:flex-1">
                        {/* Logo */}
                        <Link href="/home" className="flex shrink-0 items-center">
                            <Image
                                src="/assets/navbar/images/logo.svg"
                                alt="Meghana's Foods"
                                width={132}
                                height={44}
                                className="h-9 w-auto tablet:h-9 desktop:h-10"
                                priority
                            />
                        </Link>

                        {/* Location Dropdown */}
                        <div className="hidden min-w-0 items-center gap-2 tablet:flex relative" ref={addressDropdownRef}>
                            <button
                                onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
                                className="flex min-w-0 items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <Image
                                    src={ICONS.location}
                                    alt="Location pin"
                                    width={24}
                                    height={24}
                                    className="h-4 w-4 text-gray-600 tablet:h-5 tablet:w-5 shrink-0"
                                />
                                <div className="flex min-w-0 flex-col text-left">
                                    <span className="text-[10px] text-gray-500 tablet:text-xs">Deliver To</span>
                                    {isLoadingAddresses ? (
                                        <span className="text-xs font-semibold text-gray-900 tablet:text-sm">Loading...</span>
                                    ) : selectedAddress ? (
                                        <span className="truncate text-xs font-semibold text-gray-900 tablet:text-sm">
                                            {formatAddress(selectedAddress).length > 40
                                                ? `${formatAddress(selectedAddress).substring(0, 40)}...`
                                                : formatAddress(selectedAddress)
                                            }
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold text-gray-900 tablet:text-sm">Select Address</span>
                                    )}
                                </div>
                                <ChevronDownIcon
                                    className={cn(
                                        "h-4 w-4 text-gray-600 transition-transform shrink-0",
                                        isAddressDropdownOpen && "rotate-180"
                                    )}
                                />
                            </button>

                            {/* Address Dropdown */}
                            {isAddressDropdownOpen && !isLoadingAddresses && addresses.length > 0 && (
                                <div className="absolute top-full left-0 mt-2 w-80 max-h-[400px] overflow-y-auto custom-scrollbar bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                                    <div className="p-2">
                                        {addresses.map((address) => {
                                            const isSelected = selectedAddress?.id === address.id;
                                            return (
                                                <button
                                                    key={address.id}
                                                    onClick={() => {
                                                        setSelectedAddress(address);
                                                        setIsAddressDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer",
                                                        isSelected
                                                            ? "bg-tango/10 border border-tango"
                                                            : "hover:bg-gray-50 border border-transparent"
                                                    )}
                                                >
                                                    <Image
                                                        src={ADDRESS_TYPE_ICON_MAP[address.type].src}
                                                        alt={ADDRESS_TYPE_ICON_MAP[address.type].alt}
                                                        width={20}
                                                        height={20}
                                                        className="mt-0.5 shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn(
                                                                "text-sm font-semibold",
                                                                isSelected ? "text-tango" : "text-midnight"
                                                            )}>
                                                                {address.label}
                                                            </span>
                                                            {isSelected && (
                                                                <span className="text-xs text-tango font-medium">Selected</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600 line-clamp-2">
                                                            {formatAddress(address)}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-end gap-3 tablet:gap-4 desktop:gap-6 desktop:flex-1">
                        {/* Search Bar */}
                        <div className="hidden max-w-md flex-1 desktop:flex">
                            <div className="relative w-full">
                                <Image
                                    src={ICONS.search}
                                    alt="Search icon"
                                    width={20}
                                    height={20}
                                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search for dishes, cuisines..."
                                    className="w-full rounded-xl border-none bg-gray-100 px-4 py-2 pl-10 text-black focus:outline-none placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Icons Section */}
                        <div className="flex items-center gap-2 tablet:gap-3 desktop:gap-4">
                            {/* Search Icon (Mobile/Tablet only) */}
                            <button className="rounded-full p-2 transition-colors tablet:p-2.5 desktop:hidden cursor-pointer">
                                <Image
                                    src={ICONS.search}
                                    alt="Open search"
                                    width={28}
                                    height={28}
                                    className="h-6 w-6 tablet:h-6 tablet:w-6"
                                />
                            </button>

                            {/* Profile Icon */}
                            <Link href="/profile" className="rounded-full p-2 transition-colors tablet:p-2.5">
                                <Image
                                    src={ICONS.profile}
                                    alt="User profile"
                                    width={28}
                                    height={28}
                                    className="h-6 w-6 tablet:h-6 tablet:w-6"
                                />
                            </Link>

                            {/* Cart Icon */}
                            <Link href="/cart" className="relative rounded-full p-2 transition-colors tablet:p-2.5">
                                <Image
                                    src={ICONS.cart}
                                    alt="View cart"
                                    width={28}
                                    height={28}
                                    className="h-6 w-6 tablet:h-6 tablet:w-6"
                                />
                                {mounted && count > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                                        {count}
                                    </span>
                                )}
                            </Link>

                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}