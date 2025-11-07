"use client";

import Link from "next/link";
import Image from "next/image";
import {
    MapPinIcon,
    MagnifyingGlassIcon,
    UserIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
    return (
        <div className="fixed top-2 tablet:top-4 left-0 right-0 z-50 section">
            <nav className="mx-auto bg-white dark:bg-white rounded-xl shadow-sm py-2 px-3 tablet:py-3 tablet:px-4 desktop:py-4 desktop:px-6">
                <div className="flex items-center justify-between gap-2 tablet:gap-4 desktop:gap-10">
                    {/* Left Section */}
                    <div className="flex items-center gap-2 tablet:gap-4 desktop:gap-8 desktop:flex-1">
                        {/* Logo */}
                        <Link href="/" className="flex items-center flex-shrink-0">
                            <Image
                                src="/assets/navbar/images/logo.svg"
                                alt="Meghana's Foods"
                                width={120}
                                height={40}
                                className="h-8 tablet:h-9 desktop:h-10 w-auto"
                            />
                        </Link>

                        {/* Location */}
                        <div className="hidden tablet:flex items-center gap-2 min-w-0">
                            <MapPinIcon className="w-4 h-4 tablet:w-5 tablet:h-5 text-gray-600 flex-shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] tablet:text-xs text-gray-500">Deliver To</span>
                                <span className="text-xs tablet:text-sm font-semibold text-gray-900 truncate">
                                    708, 6th Main Rd, SBI Staff Colony, H...
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-end gap-2 tablet:gap-4 desktop:gap-6 desktop:flex-1">
                        {/* Search Bar */}
                        <div className="hidden desktop:flex flex-1 max-w-md">
                            <div className="relative w-full">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for dishes, cuisines..."
                                    className="w-full px-4 py-2 pl-10 rounded-xl border-none bg-gray-100 text-black placeholder:gray-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Icons Section */}
                        <div className="flex items-center gap-2 tablet:gap-3 desktop:gap-4">
                            {/* Search Icon (Mobile/Tablet only) */}
                            <button className="desktop:hidden p-1.5 tablet:p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <MagnifyingGlassIcon className="w-5 h-5 tablet:w-6 tablet:h-6 text-gray-700" />
                            </button>

                            {/* Profile Icon */}
                            <button className="p-1.5 tablet:p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <UserIcon className="w-5 h-5 tablet:w-6 tablet:h-6 text-gray-700" />
                            </button>

                            {/* Cart Icon */}
                            <button className="p-1.5 tablet:p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                                <ShoppingCartIcon className="w-5 h-5 tablet:w-6 tablet:h-6 text-gray-700" />
                            </button>

                            {/* Theme Toggle */}
                            {/* <ThemeToggle /> */}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}