"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-white">
            <div className="section-container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-black dark:text-white">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/logo.svg"
                                alt="Meghana's Biriyani"
                                width={40}
                                height={40}
                                className="w-10 h-10"
                            />
                        </Link>
                        <p className="text-gray-400">
                            Authentic South Indian cuisine, served with love since 2000.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/menu" className="text-gray-400 hover:text-white">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/legal/privacy"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/legal/terms"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>📍 123 Food Street</li>
                            <li>🏙️ Bangalore, Karnataka</li>
                            <li>📞 +91 98765 43210</li>
                            <li>📧 info@meghanasbiriyani.com</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} Meghana&apos;s Biriyani. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}