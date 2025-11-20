"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";

export default function OTPForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSignup = searchParams.get("signup") === "true";
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
        setCanResend(true);
    }, [timeLeft]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

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
            const lastFilledIndex = Math.min(pastedData.length - 1, 3);
            inputRefs.current[lastFilledIndex]?.focus();
        }
    };

    const handleResend = () => {
        setTimeLeft(30);
        setCanResend(false);
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
    };

    const handleConfirm = () => {
        const otpValue = otp.join("");
        if (otpValue.length === 4) {
            toast.success("Sign in successful", {
                description: "Welcome to Meghana Foods!",
            });
            router.push(isSignup ? "/select-delivery" : "/home");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className="mx-auto flex w-full max-w-[648px] flex-col gap-8">
            <header className="flex flex-col gap-3">
                <h1 className="text-2xl font-semibold text-midnight">
                    Enter OTP sent to your phone
                </h1>
            </header>

            <div className="flex flex-col gap-6">
                <div className="flex gap-3">
                    {otp.map((digit, index) => (
                        <div key={index} className="relative h-16 w-16">
                            <input
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="h-full w-full rounded-lg border border-gray-300 text-center text-5xl font-normal text-midnight transition-colors focus:border-tango focus:outline-none focus:ring-2 focus:ring-tango/20"
                                style={{ padding: 0, lineHeight: "64px" }}
                            />
                            {!digit && (
                                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-normal text-gray-300">
                                    0
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div>
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-base font-semibold text-tango hover:underline"
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <p className="text-base font-semibold text-tango">
                            Resend OTP in: {formatTime(timeLeft)} seconds
                        </p>
                    )}
                </div>

                <Button
                    type="button"
                    variant="primary"
                    onClick={handleConfirm}
                    className="h-auto w-full py-2.5"
                    disabled={otp.join("").length !== 4}
                >
                    Confirm OTP
                </Button>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="h-px flex-1 bg-gray-200" />
                    OR
                    <span className="h-px flex-1 bg-gray-200" />
                </div>

                <Button href="/home" variant="neutral">
                    Skip for Now
                </Button>
            </div>
        </div>
    );
}


