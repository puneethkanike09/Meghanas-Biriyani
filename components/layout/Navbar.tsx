"use client";

import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle";
import Image from "next/image";
import {
    MapPinIcon,
    MagnifyingGlassIcon,
    UserIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
    return (
        <div className="fixed top-4 left-0 right-0 z-50 section">
            <nav className="mx-auto bg-white dark:bg-white rounded-xl shadow-lg py-4 px-6">
                <div className="flex items-center justify-between gap-8">
                    {/* Left Section */}
                    <div className="flex items-center justify-between gap-8 flex-1">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/assets/navbar/icons/logo.svg"
                                alt="Meghana's Foods"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </Link>

                        {/* Location */}
                        <div className="hidden md:flex items-center gap-2">
                            <MapPinIcon className="w-5 h-5 text-gray-600" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Deliver To</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    708, 6th Main Rd, SBI Staff Colony, H...
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-between gap-6 flex-1">
                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md">
                            <div className="relative w-full">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for dishes, cuisines..."
                                    className="w-full px-4 py-2 pl-10 rounded-xl border-none bg-inputBgColor text-black placeholder:inputPlaceholderColor focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Icons Section */}
                        <div className="flex items-center gap-4">
                            {/* Profile Icon */}
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <UserIcon className="w-6 h-6 text-gray-700" />
                            </button>

                            {/* Cart Icon */}
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                                <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
                            </button>

                            {/* Theme Toggle */}
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}