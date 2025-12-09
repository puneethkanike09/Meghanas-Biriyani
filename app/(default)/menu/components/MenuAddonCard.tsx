import Image from "next/image";
import StarRating from "@/components/ui/StarRating";
import VegSymbol from "@/components/ui/assets/icons/vegSymbol.svg";
import NonVegSymbol from "@/components/ui/assets/icons/nonvegSymbol.svg";
import AddDefaultIcon from "@/components/ui/assets/icons/AddOrange.svg";
import { cn } from "@/lib/utils";
import { Option } from "@/services/menu.service";

// Legacy interface for backward compatibility (used in cart page)
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
    addon: Option | MenuAddonItem;
    onAdd: (addon: Option | MenuAddonItem) => void;
    className?: string;
    isVeg?: boolean; // For Option type, we need to pass isVeg separately
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

export default function MenuAddonCard({ addon, onAdd, className = "", isVeg }: MenuAddonCardProps) {
    // Check if it's an Option type (has optionId) or legacy MenuAddonItem (has id as number)
    const isOption = 'optionId' in addon;
    
    const optionName = isOption ? addon.optionName : addon.name;
    const price = addon.price;
    const formattedPrice = typeof price === "number" ? `₹${price}` : price;
    const image = isOption ? "/assets/homepage/images/top10.jpg" : addon.image;
    const vegStatus = isOption ? (isVeg ?? false) : addon.isVeg;
    const outOfStock = isOption ? addon.isOutOfStock : false;
    const rating = isOption ? 0 : addon.rating;
    const reviews = isOption ? 0 : addon.reviews;

    return (
        <div
            className={cn(
                "bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-3 flex-1 min-w-[295px] w-full",
                className,
                outOfStock && "opacity-60"
            )}
        >
            <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                        src={image}
                        alt={optionName}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        {vegStatus ? <VegIcon /> : <NonVegIcon />}
                        {!isOption && (
                            <div className="flex items-center gap-1">
                                <StarRating rating={rating} variant="single" size="sm" />
                                <span className="text-xs font-normal text-midnight">
                                    ({reviews})
                                </span>
                            </div>
                        )}
                    </div>

                    <h4 className="text-base tablet:text-lg font-semibold text-midnight leading-tight line-clamp-1">
                        {optionName}
                    </h4>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-midnight">
                    {formattedPrice}
                </span>
                <button
                    className={cn(
                        "inline-flex h-9 min-w-[114px] items-center justify-center gap-2 px-[14px] rounded-[8px] font-semibold text-sm transition-colors",
                        outOfStock
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                            : "border border-tango text-tango bg-white cursor-pointer"
                    )}
                    onClick={() => !outOfStock && onAdd(addon)}
                    disabled={outOfStock}
                >
                    <Image
                        src={AddDefaultIcon}
                        alt="Add addon"
                        width={18}
                        height={18}
                        className="w-4 h-4"
                    />
                    {outOfStock ? "Out of Stock" : "Add"}
                </button>
            </div>
        </div>
    );
}

