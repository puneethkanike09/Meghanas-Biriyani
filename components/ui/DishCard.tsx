import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import StarRating from "./StarRating";
import VegSymbol from "./assets/icons/vegSymbol.svg";
import NonVegSymbol from "./assets/icons/nonvegSymbol.svg";

export interface DishCardProps {
    id: number;
    name: string;
    description: string;
    price: string;
    rating: number;
    reviews?: number;
    isVeg: boolean;
    image: string;
    variant?: "default" | "compact";
    imageHeight?: string;
    outOfStock?: boolean;
    onAdd?: () => void;
}

const VegIcon = () => (
    <Image
        src={VegSymbol}
        alt="Vegetarian"
        width={20}
        height={20}
        className="w-4 h-4 tablet:w-5 tablet:h-5"
    />
);

const NonVegIcon = () => (
    <Image
        src={NonVegSymbol}
        alt="Non-Vegetarian"
        width={20}
        height={20}
        className="w-4 h-4 tablet:w-5 tablet:h-5"
    />
);

export default function DishCard({
    name,
    description,
    price,
    rating,
    reviews,
    isVeg,
    image,
    variant = "default",
    imageHeight,
    outOfStock = false,
    onAdd,
}: DishCardProps) {
    // Default image heights based on variant
    const defaultImageHeight = variant === "compact"
        ? "h-[180px] tablet:h-[200px] desktop:h-[180px]"
        : "h-[180px] tablet:h-[200px] desktop:h-[220px]";

    return (
        <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition duration-300 border border-gray-200 hover:border-sunRay select-none">
            {/* Image */}
            <div className={`relative w-full ${imageHeight || defaultImageHeight}`}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className={`object-cover ${outOfStock ? "grayscale" : ""}`}
                />

                {/* Out of Stock Overlay */}
                {outOfStock && (
                    <div className="absolute inset-0 bg-[#00000080] flex items-center justify-center">
                        <Button
                            variant="default"
                            size="md"
                            className="cursor-default pointer-events-none"
                        >
                            Out of Stock
                        </Button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 tablet:p-5 desktop:p-4 flex flex-col flex-1">
                {/* Veg/Non-veg Icon & Name (for compact variant) or Icon & Rating Row (for default variant) */}
                {variant === "compact" ? (
                    <div className="flex flex-col items-start gap-2 mb-2">
                        {isVeg ? <VegIcon /> : <NonVegIcon />}
                        <h3 className="text-sm tablet:text-base desktop:text-[18px] font-semibold text-midnight leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.3]">
                            {name}
                        </h3>
                    </div>
                ) : (
                    <div className="flex items-center justify-between mb-3">
                        {isVeg ? <VegIcon /> : <NonVegIcon />}
                        <div className="flex items-center gap-1">
                            <StarRating rating={rating} variant="single" size="sm" />
                            {reviews && (
                                <span className="text-xs tablet:text-sm desktop:text-sm font-normal text-midnight leading-[1.4]">
                                    ({reviews})
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Name for default variant */}
                {variant === "default" && (
                    <div className="flex flex-col gap-2 mb-4">
                        <h3 className="text-base tablet:text-lg desktop:text-xl font-semibold text-midnight leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.3]">
                            {name}
                        </h3>
                        <p className="text-xs tablet:text-sm desktop:text-base text-gray-700 leading-[1.5] tablet:leading-[1.6] desktop:leading-[1.6] line-clamp-2">
                            {description}
                        </p>
                    </div>
                )}

                {/* Description for compact variant */}
                {variant === "compact" && (
                    <p className="text-xs tablet:text-sm desktop:text-base text-gray-700 mb-3 line-clamp-2 leading-[1.5] tablet:leading-[1.6] desktop:leading-[1.6]">
                        {description}
                    </p>
                )}

                {/* Rating for compact variant */}
                {variant === "compact" && (
                    <div className="mb-4">
                        <StarRating rating={rating} variant="single" size="sm" />
                    </div>
                )}

                {/* Price & Add Button */}
                <div className="flex items-center justify-between mt-auto">
                    <span className={`font-bold text-midnight leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2] ${variant === "compact"
                        ? "text-base tablet:text-lg desktop:text-xl"
                        : "text-lg tablet:text-xl desktop:text-2xl"
                        }`}>
                        {price}
                    </span>
                    <Button
                        variant="primary"
                        size="sm"
                        className={`${variant === "compact" ? "px-4 tablet:px-5 desktop:px-4" : "px-3 tablet:px-4 desktop:px-4"} ${outOfStock ? "bg-brand-200" : ""}`}
                        icon={<PlusIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />}
                        onClick={outOfStock ? undefined : onAdd}
                        disabled={outOfStock}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}

