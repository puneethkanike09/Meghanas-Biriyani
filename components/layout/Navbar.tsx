"use client";

import Link from "next/link";
import Image from "next/image";

const ICONS = {
    location: "/assets/navbar/icons/Location.svg",
    search: "/assets/navbar/icons/Search.svg",
    profile: "/assets/navbar/icons/Person.svg",
    cart: "/assets/navbar/icons/Cart.svg",
};

export default function Navbar() {
    return (
        <div className="fixed top-4 tablet:top-4 left-0 right-0 z-50 section">
            <nav className="mx-auto rounded-2xl bg-white py-3 px-4 shadow-md tablet:rounded-xl tablet:py-3 tablet:px-4 desktop:py-4 desktop:px-6">
                <div className="flex items-center justify-between gap-3 tablet:gap-4 desktop:gap-10">
                    {/* Left Section */}
                    <div className="flex items-center gap-2 tablet:gap-4 desktop:gap-8 desktop:flex-1">
                        {/* Logo */}
                        <Link href="/" className="flex flex-shrink-0 items-center">
                            <Image
                                src="/assets/navbar/images/logo.svg"
                                alt="Meghana's Foods"
                                width={132}
                                height={44}
                                className="h-9 w-auto tablet:h-9 desktop:h-10"
                                priority
                            />
                        </Link>

                        {/* Location */}
                        <div className="hidden min-w-0 items-center gap-2 tablet:flex">
                            <Image
                                src={ICONS.location}
                                alt="Location pin"
                                width={24}
                                height={24}
                                className="h-4 w-4 text-gray-600 tablet:h-5 tablet:w-5"
                            />
                            <div className="flex min-w-0 flex-col">
                                <span className="text-[10px] text-gray-500 tablet:text-xs">Deliver To</span>
                                <span className="truncate text-xs font-semibold text-gray-900 tablet:text-sm">
                                    708, 6th Main Rd, SBI Staff Colony, H...
                                </span>
                            </div>
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
                            <button className="rounded-full p-2 transition-colors tablet:p-2.5 desktop:hidden">
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
                            <button className="relative rounded-full p-2 transition-colors tablet:p-2.5">
                                <Image
                                    src={ICONS.cart}
                                    alt="View cart"
                                    width={28}
                                    height={28}
                                    className="h-6 w-6 tablet:h-6 tablet:w-6"
                                />
                            </button>

                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}