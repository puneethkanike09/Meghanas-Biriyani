"use client";

import Link from "next/link";
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
    return (
        <footer className="bg-midnight dark:bg-gray-900">
            <div className="section-container py-8 tablet:py-12 desktop:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:gap-12 desktop:grid-cols-4 desktop:gap-16">
                    {/* Brand Section */}
                    <div className="space-y-4 tablet:space-y-5 desktop:space-y-4">
                        <h3 className="text-lg tablet:text-xl desktop:text-base font-bold tablet:font-bold desktop:font-semibold text-white leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.2]">
                            Meghana Foods
                        </h3>
                        <p className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6]">
                            Authentic South Indian cuisine delivered fresh to
                            your doorstep. Experience the rich flavors of
                            traditional cooking.
                        </p>
                        {/* Social Media Icons */}
                        <div className="flex gap-3 tablet:gap-4 desktop:gap-3 pt-2">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                                aria-label="Facebook"
                            >
                                <svg
                                    className="w-4 h-4 tablet:w-[18px] tablet:h-[18px] desktop:w-5 desktop:h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <svg
                                    className="w-4 h-4 tablet:w-[18px] tablet:h-[18px] desktop:w-5 desktop:h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </Link>
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                <svg
                                    className="w-4 h-4 tablet:w-[18px] tablet:h-[18px] desktop:w-5 desktop:h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 tablet:space-y-5 desktop:space-y-4">
                        <h3 className="text-lg tablet:text-xl desktop:text-base font-bold tablet:font-bold desktop:font-semibold text-white leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.2]">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/menu"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/offers"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Offers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/catering"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Catering Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/franchise"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Franchise
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4 tablet:space-y-5 desktop:space-y-4">
                        <h3 className="text-lg tablet:text-xl desktop:text-base font-bold tablet:font-bold desktop:font-semibold text-white leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.2]">
                            Customer Service
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/help"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Help & Support
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/track-order"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/refund"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="space-y-4 tablet:space-y-5 desktop:space-y-4">
                        <h3 className="text-lg tablet:text-xl desktop:text-base font-bold tablet:font-bold desktop:font-semibold text-white leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.2]">
                            Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPinIcon className="w-4 h-4 tablet:w-[18px] tablet:h-[18px] desktop:w-5 desktop:h-5 text-gray-300 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6]">
                                    Bangalore, Karnataka, India
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <PhoneIcon className="w-4 h-4 tablet:w-[18px] tablet:h-[18px] desktop:w-5 desktop:h-5 text-gray-300 dark:text-gray-400 flex-shrink-0" />
                                <a
                                    href="tel:+919876543210"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <EnvelopeIcon className="w-4 h-4 tablet:w-[18px] tablet:h-[18px] desktop:w-5 desktop:h-5 text-gray-300 dark:text-gray-400 flex-shrink-0" />
                                <a
                                    href="mailto:contact@meghanafoods.com"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors break-all leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    contact@meghanafoods.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 tablet:mt-12 pt-6 tablet:pt-8 border-t border-gray-600 dark:border-gray-700">
                    <div className="flex flex-col gap-4 tablet:flex-row tablet:justify-between tablet:items-center">
                        <p className="text-xs tablet:text-sm text-gray-400 dark:text-gray-500 text-center tablet:text-left leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]">
                            © {new Date().getFullYear()} Meghana Foods. All rights reserved.
                        </p>
                        <p className="text-xs tablet:text-sm text-gray-400 dark:text-gray-500 text-center tablet:text-right leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]">
                            Designed & Developed by Pace Wisdom Solutions Pvt Ltd
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}