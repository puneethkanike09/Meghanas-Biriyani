"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type AuthTab = "login" | "signup";

const tabOptions: Array<{ id: AuthTab; label: string }> = [
    { id: "login", label: "Login" },
    { id: "signup", label: "Sign Up" },
];

export default function SignInPage() {
    const [activeTab, setActiveTab] = useState<AuthTab>("login");
    const isLogin = activeTab === "login";

    return (
        <div className="section-container flex min-h-screen items-center justify-center py-12 tablet:py-16">
            <div className="mx-auto flex w-full max-w-[648px] flex-col gap-8 px-4 tablet:px-0">
                <header className="flex flex-col gap-3">
                    <h1 className="text-2xl font-semibold text-midnight">
                        Welcome to Meghana Foods
                    </h1>
                    <p className="text-base text-gray-700">
                        {isLogin
                            ? "Login to get personalized recommendations and track your orders."
                            : "Create an account to unlock personalized recommendations and faster checkout."}
                    </p>
                </header>

                <div className="rounded-full bg-gray-200 p-1">
                    <div className="grid grid-cols-2 gap-1">
                        {tabOptions.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`rounded-full px-4 py-2 text-center text-lg font-semibold transition-colors ${activeTab === tab.id ? "bg-white text-midnight shadow-sm" : "text-gray-600"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <form className="flex flex-col gap-6">
                    {activeTab === "signup" && (
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="full-name"
                                className="text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <Input
                                id="full-name"
                                name="fullName"
                                placeholder="Enter your name"
                                startIcon={
                                    <Image
                                        src="/assets/profile/icons/Person.svg"
                                        alt="User"
                                        width={20}
                                        height={20}
                                        className="h-5 w-5"
                                    />
                                }
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="phone-number"
                            className="text-sm font-medium text-gray-700"
                        >
                            Phone number
                        </label>
                        <Input
                            id="phone-number"
                            name="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            startIcon={
                                <Image
                                    src="/assets/profile/icons/Phone.svg"
                                    alt="Phone"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            }
                        />
                    </div>

                    <Button type="button" variant="primary" className="w-full h-auto py-2.5">
                        Send OTP
                    </Button>
                </form>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="h-px flex-1 bg-gray-200" />
                    OR
                    <span className="h-px flex-1 bg-gray-200" />
                </div>

                <Button
                    href="/home"
                    variant="neutral"
                    className="w-full h-auto py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                    Skip for Now
                </Button>
            </div>
        </div>
    );
}

