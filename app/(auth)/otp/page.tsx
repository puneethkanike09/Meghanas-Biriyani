"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function OTPPage() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow single digit
        if (value.length > 1) return;

        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 4);
        if (/^\d{1,4}$/.test(pastedData)) {
            const newOtp = [...otp];
            for (let i = 0; i < 4; i++) {
                newOtp[i] = pastedData[i] || "";
            }
            setOtp(newOtp);
            // Focus the last filled input or the last input
            const lastFilledIndex = Math.min(pastedData.length - 1, 3);
            inputRefs.current[lastFilledIndex]?.focus();
        }
    };

    const handleResend = () => {
        setTimeLeft(30);
        setCanResend(false);
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
        // Here you would typically call an API to resend OTP
    };

    const handleConfirm = () => {
        const otpValue = otp.join("");
        if (otpValue.length === 4) {
            // Here you would typically verify the OTP with your backend
            // For now, just navigate to home
            router.push("/home");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className="section-container flex min-h-screen items-center justify-center py-12 tablet:py-16">
            <div className="mx-auto flex w-full max-w-[648px] flex-col gap-8 px-4 tablet:px-0">
                <header className="flex flex-col gap-3">
                    <h1 className="text-2xl font-semibold text-midnight">
                        Enter OTP sent to your phone
                    </h1>
                </header>

                <div className="flex flex-col gap-6">
                    {/* OTP Input Fields */}
                    <div className="flex gap-3">
                        {otp.map((digit, index) => (
                            <div key={index} className="relative w-16 h-16">
                                <input
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-full h-full rounded-lg border border-gray-300 text-center text-5xl font-normal text-midnight focus:border-tango focus:outline-none focus:ring-2 focus:ring-tango/20 transition-colors"
                                    style={{ padding: 0, lineHeight: '64px' }}
                                />
                                {!digit && (
                                    <span className="absolute inset-0 flex items-center justify-center text-5xl font-normal text-gray-300 pointer-events-none">
                                        0
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Resend OTP */}
                    <div>
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-tango font-semibold text-base hover:underline"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <p className="text-tango text-base font-semibold">
                                Resend OTP in: {formatTime(timeLeft)} seconds
                            </p>
                        )}
                    </div>

                    {/* Confirm OTP Button */}
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleConfirm}
                        className="w-full h-auto py-2.5"
                        disabled={otp.join("").length !== 4}
                    >
                        Confirm OTP
                    </Button>

                    {/* OR Separator */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="h-px flex-1 bg-gray-200" />
                        OR
                        <span className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Skip for Now Button */}
                    <Button
                        href="/home"
                        variant="neutral"
                        className="w-full h-auto py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        Skip for Now
                    </Button>
                </div>
            </div>
        </div>
    );
}

