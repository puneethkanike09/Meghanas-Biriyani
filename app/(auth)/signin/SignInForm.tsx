"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loader from "@/components/ui/Loader";
import { getErrorMessage, getSuccessMessage } from "@/lib/error-handler";

type AuthTab = "login" | "signup";

const tabOptions: Array<{ id: AuthTab; label: string }> = [
    { id: "login", label: "Login" },
    { id: "signup", label: "Sign Up" },
];

export default function SignInForm() {
    const router = useRouter();
    const { setTempAuthData, isAuthenticated, _hasHydrated } = useAuthStore();

    const [activeTab, setActiveTab] = useState<AuthTab>("login");
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: ""
    });

    const isLogin = activeTab === "login";

    useEffect(() => {
        if (isAuthenticated && _hasHydrated) {
            router.replace('/home');
        }
    }, [isAuthenticated, _hasHydrated, router]);

    // Show nothing or a loader while rehydrating or if authenticated (to prevent flash)
    if (!_hasHydrated || isAuthenticated) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                <Loader message="Authenticating..." />
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatPhone = (phone: string) => {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        // If it starts with 91 and is 12 digits, keep it. If 10 digits, add 91.
        if (cleaned.length === 10) return `+91${cleaned}`;
        if (cleaned.length === 12 && cleaned.startsWith('91')) return `+${cleaned}`;
        return `+${cleaned}`; // Fallback, let API validate or return error
    };

    const validateForm = () => {
        if (!formData.phone) {
            toast.error("Please enter your phone number");
            return false;
        }

        const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
        // Simple 10 digit check for now, allowing for +91 prefix logic handling
        const cleanedPhone = formData.phone.replace(/\D/g, '');
        if (cleanedPhone.length < 10) {
            toast.error("Please enter a valid phone number");
            return false;
        }

        if (!isLogin && !formData.name.trim()) {
            toast.error("Please enter your name");
            return false;
        }
        return true;
    };

    const handleSendOTP = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const formattedPhone = formatPhone(formData.phone);

        try {
            let response;
            if (isLogin) {
                response = await AuthService.requestLoginOtp({ phone: formattedPhone });
            } else {
                response = await AuthService.register({
                    phone: formattedPhone,
                    name: formData.name
                });
            }

            // Store temp data for OTP step
            setTempAuthData({
                phone: formattedPhone,
                name: isLogin ? undefined : formData.name,
                requestId: response.request_id,
                flow: isLogin ? 'LOGIN' : 'REGISTER'
            });

            // Use API success message if available, otherwise use default
            const successMsg = getSuccessMessage({ data: response }, "OTP sent successfully");
            toast.success(successMsg);
            router.push('/otp');
        } catch (error: any) {
            console.error("Auth error:", error);
            const errorMsg = getErrorMessage(error, "Failed to send OTP. Please try again.");
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
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

            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }}>
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
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
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
                        value={formData.phone}
                        onChange={handleInputChange}
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

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-auto py-2.5"
                    disabled={loading}
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
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


