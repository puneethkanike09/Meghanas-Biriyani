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
            <div className="flex items-start justify-center gap-4 overflow-x-auto custom-scrollbar desktop:justify-start desktop:gap-6">
                {steps.map((step, index) => {
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";

                    return (
                        <div key={step.number} className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-2 text-center desktop:flex-row desktop:text-left desktop:items-start desktop:gap-2">
                                {isCompleted ? (
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-tropical-green bg-tropical-green">
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
                                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-base font-semibold ${isCurrent
                                            ? "border-tango bg-tango text-white"
                                            : "border-gray-300 bg-white text-gray-500"
                                            }`}
                                    >
                                        {step.number}
                                    </div>
                                )}
                                <span
                                    className={`text-sm tablet:text-base text-center desktop:text-left desktop:pt-1.5 ${isCompleted
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
                                <div
                                    className="h-px w-10 tablet:w-16 desktop:w-20 bg-gray-500 mt-5"
                                    aria-hidden
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}