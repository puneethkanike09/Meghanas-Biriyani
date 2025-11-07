import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

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
    onAdd?: () => void;
}

const VegIcon = () => (
    <div className="w-4 h-4 tablet:w-5 tablet:h-5 border-2 border-green-600 flex items-center justify-center">
        <div className="w-2 h-2 tablet:w-2.5 tablet:h-2.5 rounded-full bg-green-600"></div>
    </div>
);

const NonVegIcon = () => (
    <div className="w-4 h-4 tablet:w-5 tablet:h-5 border-2 border-red-600 flex items-center justify-center">
        <div className="w-2 h-2 tablet:w-2.5 tablet:h-2.5 rounded-full bg-red-600"></div>
    </div>
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
    onAdd,
}: DishCardProps) {
    // Default image heights based on variant
    const defaultImageHeight = variant === "compact" 
        ? "h-[180px] tablet:h-[200px] desktop:h-[180px]"
        : "h-[180px] tablet:h-[200px] desktop:h-[220px]";

    return (
        <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#E9EAEB]">
            {/* Image */}
            <div className={`relative w-full ${imageHeight || defaultImageHeight}`}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-4 tablet:p-5 desktop:p-4 flex flex-col flex-1">
                {/* Veg/Non-veg Icon & Name (for compact variant) or Icon & Rating Row (for default variant) */}
                {variant === "compact" ? (
                    <div className="flex flex-col items-start gap-2 mb-2">
                        {isVeg ? <VegIcon /> : <NonVegIcon />}
                        <h3 className="text-sm tablet:text-base desktop:text-[18px] font-semibold text-[#181D27] leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.3]">
                            {name}
                        </h3>
                    </div>
                ) : (
                    <div className="flex items-center justify-between mb-3">
                        {isVeg ? <VegIcon /> : <NonVegIcon />}
                        <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-primary" />
                            <span className="text-xs tablet:text-sm desktop:text-sm font-normal text-[#181D27] leading-[1.4]">
                                {rating} {reviews && `(${reviews})`}
                            </span>
                        </div>
                    </div>
                )}

                {/* Name for default variant */}
                {variant === "default" && (
                    <div className="flex flex-col gap-2 mb-4">
                        <h3 className="text-base tablet:text-lg desktop:text-xl font-semibold text-[#181D27] leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.3]">
                            {name}
                        </h3>
                        <p className="text-xs tablet:text-sm desktop:text-base text-[#414651] leading-[1.5] tablet:leading-[1.6] desktop:leading-[1.6] line-clamp-2">
                            {description}
                        </p>
                    </div>
                )}

                {/* Description for compact variant */}
                {variant === "compact" && (
                    <p className="text-xs tablet:text-sm desktop:text-base text-[#414651] mb-3 line-clamp-2 leading-[1.5] tablet:leading-[1.6] desktop:leading-[1.6]">
                        {description}
                    </p>
                )}

                {/* Rating for compact variant */}
                {variant === "compact" && (
                    <div className="flex items-center gap-1 mb-4">
                        <StarIcon className="w-4 h-4 text-primary" />
                        <span className="text-xs tablet:text-sm desktop:text-sm font-medium text-[#181D27] leading-[1.4] tablet:leading-[1.4] desktop:leading-[1.4]">
                            {rating}
                        </span>
                    </div>
                )}

                {/* Price & Add Button */}
                <div className="flex items-center justify-between mt-auto">
                    <span className={`font-bold text-[#181D27] leading-[1.3] tablet:leading-[1.2] desktop:leading-[1.2] ${
                        variant === "compact" 
                            ? "text-base tablet:text-lg desktop:text-xl"
                            : "text-lg tablet:text-xl desktop:text-2xl"
                    }`}>
                        {price}
                    </span>
                    <Button
                        variant="primary"
                        size="sm"
                        className={variant === "compact" ? "px-4 tablet:px-5 desktop:px-4" : "px-3 tablet:px-4 desktop:px-4"}
                        icon={<PlusIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />}
                        onClick={onAdd}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}

