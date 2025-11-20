import Image from "next/image";
import StarRating from "@/components/ui/StarRating";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";
import AddDefaultIcon from "@/components/ui/assets/icons/AddOrange.svg";
import { cn } from "@/lib/utils";

export interface MenuAddonItem {
    id: number;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    isVeg: boolean;
    image: string;
    description?: string;
}

interface MenuAddonCardProps {
    addon: MenuAddonItem;
    onAdd: (addon: MenuAddonItem) => void;
    className?: string;
}

const VegIcon = () => (
    <Image
        src={VegSymbol}
        alt="Vegetarian"
        width={20}
        height={20}
        className="w-5 h-5"
    />
);

const NonVegIcon = () => (
    <Image
        src={NonVegSymbol}
        alt="Non-Vegetarian"
        width={20}
        height={20}
        className="w-5 h-5"
    />
);

export default function MenuAddonCard({ addon, onAdd, className = "" }: MenuAddonCardProps) {
    const formattedPrice = typeof addon.price === "number" ? `₹${addon.price}` : addon.price;

    return (
        <div
            className={cn(
                "bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-3 flex-1 min-w-[295px] w-full",
                className
            )}
        >
            <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                        src={addon.image}
                        alt={addon.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        {addon.isVeg ? <VegIcon /> : <NonVegIcon />}
                        <div className="flex items-center gap-1">
                            <StarRating rating={addon.rating} variant="single" size="sm" />
                            <span className="text-xs font-normal text-midnight">
                                ({addon.reviews})
                            </span>
                        </div>
                    </div>

                    <h4 className="text-base tablet:text-lg font-semibold text-midnight leading-tight line-clamp-1">
                        {addon.name}
                    </h4>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-midnight">
                    {formattedPrice}
                </span>
                <button
                    className="inline-flex h-9 min-w-[114px] items-center justify-center gap-2 px-[14px] rounded-[8px] font-semibold text-sm transition-colors border border-tango text-tango bg-white cursor-pointer"
                    onClick={() => onAdd(addon)}
                >
                    <Image
                        src={AddDefaultIcon}
                        alt="Add addon"
                        width={18}
                        height={18}
                        className="w-4 h-4"
                    />
                    Add
                </button>
            </div>
        </div>
    );
}

