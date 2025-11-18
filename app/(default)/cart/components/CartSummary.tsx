import Image from "next/image";
import Button from "@/components/ui/Button";

export interface ChargeLine {
    label: string;
    value: number;
    emphasize?: boolean;
    hasInfo?: boolean;
}

interface CartSummaryProps {
    charges: ChargeLine[];
    totalPayable: number;
}

export default function CartSummary({ charges, totalPayable }: CartSummaryProps) {
    return (
        <section className="flex flex-col w-full items-start gap-6  relative">
            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                {charges.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]"
                    >
                        <div className="flex items-center gap-1 relative">
                            <div
                                className={`relative w-fit mt-[-1.00px] ${item.emphasize
                                    ? "font-semibold text-midnight"
                                    : "font-normal text-gray-600"
                                    } text-xs tracking-[0] leading-[normal]`}
                            >
                                {item.label}
                            </div>
                            {item.hasInfo && (
                                <Image
                                    className="relative w-3 h-3"
                                    alt="Info"
                                    src="/assets/cart/icons/Info.svg"
                                    width={12}
                                    height={12}
                                />
                            )}
                        </div>
                        <div
                            className={`relative w-fit mt-[-1.00px] ${item.emphasize
                                ? "font-semibold text-midnight"
                                : "font-normal text-gray-600"
                                } text-xs text-right tracking-[0] leading-[normal]`}
                        >
                            ₹{item.value.toFixed(item.value % 1 === 0 ? 0 : 2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px w-full bg-gray-200 self-stretch" />

            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-semibold text-midnight text-xs tracking-[0] leading-[normal]">
                        To Pay
                    </div>
                    <div className="w-fit font-semibold text-midnight text-xs leading-[normal] relative mt-[-1.00px] tracking-[0]">
                        ₹{totalPayable.toFixed(totalPayable % 1 === 0 ? 0 : 2)}
                    </div>
                </div>
            </div>

            <div className="flex items-start self-stretch w-full relative flex-[0_0_auto] rounded-lg">
                <Button
                    variant="primary"
                    className="flex-1 bg-tango hover:bg-tango/90 items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-solid border-tango shadow-sm h-auto"
                >
                    <span className="w-fit font-semibold text-white text-sm whitespace-nowrap">
                        Yes! Let&apos;s Continue
                    </span>
                </Button>
            </div>
        </section>
    );
}

