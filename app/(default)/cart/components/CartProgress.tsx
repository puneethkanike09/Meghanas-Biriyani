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
            className="w-full  bg-white py-3 tablet:py-4"
        >
            <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar">
                {steps.map((step, index) => {
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";

                    return (
                        <div key={step.number} className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-base font-semibold ${isCompleted || isCurrent
                                        ? "border-tango bg-tango text-white"
                                        : "border-gray-300 bg-white text-gray-500"
                                        }`}
                                >
                                    {step.number}
                                </div>
                                <span
                                    className={`text-sm font-semibold ${isCompleted || isCurrent ? "text-midnight" : "text-gray-500"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden tablet:block h-px w-16 bg-gray-200" aria-hidden />
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}

