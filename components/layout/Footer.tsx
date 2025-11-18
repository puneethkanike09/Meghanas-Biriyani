"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-900">
            <div className="section-container py-8 tablet:py-12 desktop:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:gap-12 desktop:grid-cols-4 desktop:gap-16">
                    {/* Brand Section */}
                    <div className="space-y-4 tablet:space-y-5 desktop:space-y-4">
                        <Image
                            src="/assets/footer/icons/Logo.svg"
                            alt="Meghana Foods"
                            width={125}
                            height={48}
                            className="object-cover"
                        />
                        <p className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6]">
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
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                                aria-label="Facebook"
                            >
                                <Image
                                    src="/assets/footer/icons/facebook.svg"
                                    alt="Facebook"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <Image
                                    src="/assets/footer/icons/instagram.svg"
                                    alt="Instagram"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </Link>
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                <Image
                                    src="/assets/footer/icons/twitter.svg"
                                    alt="Twitter"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
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
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/menu"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/offers"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Offers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/catering"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Catering Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/franchise"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
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
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Help & Support
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/track-order"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms-and-conditions"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/refund"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
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
                                <Image
                                    src="/assets/footer/icons/Location.svg"
                                    alt="Location"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                                />
                                <span className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6]">
                                    Bangalore, Karnataka, India
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Image
                                    src="/assets/footer/icons/Call.svg"
                                    alt="Phone"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 flex-shrink-0"
                                />
                                <a
                                    href="tel:+919876543210"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Image
                                    src="/assets/footer/icons/Mail.svg"
                                    alt="Email"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 flex-shrink-0"
                                />
                                <a
                                    href="mailto:contact@meghanafoods.com"
                                    className="text-sm tablet:text-[15px] desktop:text-[14px] font-normal text-gray-300 hover:text-white transition-colors break-all leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]"
                                >
                                    contact@meghanafoods.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 tablet:mt-12 pt-6 tablet:pt-8 border-t border-gray-600">
                    <div className="flex flex-col gap-4 tablet:flex-row tablet:justify-between tablet:items-center">
                        <p className="text-xs tablet:text-sm text-gray-400 text-center tablet:text-left leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]">
                            © {new Date().getFullYear()} Meghana Foods. All rights reserved.
                        </p>
                        <div className="flex items-center justify-center tablet:justify-end gap-2">
                            <span className="text-xs tablet:text-sm text-gray-400 leading-[1.5] tablet:leading-[1.4] desktop:leading-[1.4]">
                                Designed & Developed by
                            </span>
                            <Image
                                src="/assets/footer/icons/Pacewisdom_logo.svg"
                                alt="Pacewisdom"
                                width={102}
                                height={24}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}