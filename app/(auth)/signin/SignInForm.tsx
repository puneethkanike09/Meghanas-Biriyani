"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type AuthTab = "login" | "signup";

const tabOptions: Array<{ id: AuthTab; label: string }> = [
    { id: "login", label: "Login" },
    { id: "signup", label: "Sign Up" },
];

export default function SignInForm() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AuthTab>("login");
    const isLogin = activeTab === "login";

    const handleSendOTP = () => {
        // Here you would typically validate and send OTP to the phone number
        // For now, just navigate to OTP page with signup state
        const isSignup = activeTab === "signup";
        router.push(`/otp${isSignup ? "?signup=true" : ""}`);
    };

    return (
        <div className="mx-auto flex w-full max-w-[648px] flex-col gap-8">
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
                <div className="relative grid grid-cols-2">
                    <span
                        aria-hidden
                        className={`absolute inset-y-0 left-0 w-1/2 rounded-full bg-white transition-transform duration-300 ease-out ${isLogin ? "translate-x-0" : "translate-x-full"}`}
                    />
                    {tabOptions.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative z-10 rounded-full px-4 py-2 text-center text-lg font-semibold transition-colors duration-300 cursor-pointer ${activeTab === tab.id ? "text-midnight" : "text-gray-600"
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

                <Button type="button" variant="primary" className="w-full h-auto py-2.5" onClick={handleSendOTP}>
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
            >
                Skip for Now
            </Button>
        </div>
    );
}

