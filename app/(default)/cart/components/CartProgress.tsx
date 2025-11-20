import Image from "next/image";

export interface CartProgressStep {
    number: number;
    label: string;
    status: "completed" | "current" | "upcoming";
}

interface CartProgressProps {
    steps: CartProgressStep[];
}

export default function CartProgress({ steps }: CartProgressProps) {
    return (
        <nav
            aria-label="Checkout progress"
            className="w-full bg-white py-3 tablet:py-4"
        >
            <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar">
                {steps.map((step, index) => {
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";

                    return (
                        <div key={step.number} className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                {isCompleted ? (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-tropical-green bg-tropical-green">
                                        <Image
                                            src="/assets/cart/icons/Checkmark.svg"
                                            alt="Completed"
                                            width={20}
                                            height={20}
                                            className="h-5 w-5"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-base font-semibold ${isCurrent
                                            ? "border-tango bg-tango text-white"
                                            : "border-gray-300 bg-white text-gray-500"
                                            }`}
                                    >
                                        {step.number}
                                    </div>
                                )}
                                <span
                                    className={`text-base whitespace-nowrap ${isCompleted
                                        ? "font-normal text-midnight"
                                        : isCurrent
                                            ? "font-semibold text-midnight"
                                            : "font-normal text-gray-700"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="w-20 h-px bg-gray-200" aria-hidden />
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}

