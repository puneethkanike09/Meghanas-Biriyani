"use client";

import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle";
import Image from "next/image";

export default function Navbar() {
    return (
        <div className="fixed top-4 left-0 right-0 z-50 section">
            <nav className="mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg py-4 px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo.svg"
                            alt="Meghana's Biriyani"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                        />
                        
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
                        >
                            Home
                        </Link>
                        <Link
                            href="/menu"
                            className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
                        >
                            Menu
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Right Section: Search & Theme */}
                    <div className="flex items-center space-x-4">
                        <input
                            type="search"
                            placeholder="Search dishes..."
                            className="hidden md:block px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <ThemeToggle />
                    </div>
                </div>
            </nav>
        </div>
    );
}