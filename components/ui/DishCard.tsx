import Image from "next/image";
import StarRating from "./StarRating";
import VegSymbol from "./assets/icons/vegSymbol.svg";
import NonVegSymbol from "./assets/icons/nonvegSymbol.svg";
import AddDefaultIcon from "./assets/icons/AddDefualt.svg";
import AddIcon from "./assets/icons/Add.svg";
import SubtractIcon from "./assets/icons/Subtract.svg";

export interface DishCardProps {
    id: number;
    name: string;
    description: string;
    price: string | number;
    rating: number;
    reviews?: number;
    isVeg: boolean;
    image: string;
    variant?: "default" | "compact" | "expanded";
    imageHeight?: string;
    outOfStock?: boolean;
    onAdd?: () => void;
    onClick?: () => void;
    quantity?: number;
    onUpdateQuantity?: (change: number) => void;
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
    onClick,
    quantity,
    onUpdateQuantity,
}: DishCardProps) {
    // Default image heights based on variant
    const defaultImageHeight = variant === "compact"
        ? "h-[180px] tablet:h-[200px] desktop:h-[180px]"
        : "h-[180px] tablet:h-[200px] desktop:h-[220px]";

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAdd?.();
    };

    const handleQuantityChange = (e: React.MouseEvent, change: number) => {
        e.stopPropagation();
        onUpdateQuantity?.(change);
    };

    const formattedPrice = typeof price === 'number' ? `₹${price}` : price;

    // Expanded variant has different layout
    if (variant === "expanded") {
        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex flex-col tablet:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full tablet:w-1/2 h-[300px] tablet:h-[360px]">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className={`object-cover ${outOfStock ? "grayscale" : ""}`}
                        />
                        {outOfStock && (
                            <div className="absolute inset-0 bg-[#00000080] flex items-center justify-center">
                                <button
                                    className="inline-flex h-auto items-center justify-center px-4 py-2.5 whitespace-nowrap rounded-[8px] font-semibold text-[13px] desktop:text-sm bg-white text-black border border-gray-300 cursor-default pointer-events-none"
                                >
                                    Out of Stock
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col gap-4 p-4 tablet:p-6 flex-1 bg-white">
                        {/* Veg/Non-veg Icon & Rating */}
                        <div className="flex items-center justify-between">
                            {isVeg ? <VegIcon /> : <NonVegIcon />}
                            <div className="flex items-center gap-1">
                                <StarRating rating={rating} variant="single" size="md" />
                                <span className="text-sm font-normal text-midnight">
                                    ({reviews})
                                </span>
                            </div>
                        </div>

                        {/* Name */}
                        <h2 className="text-xl tablet:text-2xl font-semibold text-midnight leading-tight">
                            {name}
                        </h2>

                        {/* Description */}
                        <p className="text-base text-gray-600 leading-[1.5]">
                            {description}
                        </p>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Price & Add Button */}
                        <div className="flex items-center justify-between">
                            <span className="text-xl tablet:text-2xl font-semibold text-midnight">
                                {formattedPrice}
                            </span>

                            {quantity && quantity > 0 ? (
                                <div className="inline-flex h-9 items-center justify-between gap-2 px-3.5 bg-white rounded-lg border border-gray-300 shadow-sm min-w-[114px]">
                                    <button
                                        onClick={(e) => handleQuantityChange(e, -1)}
                                        className="w-5 h-5 flex items-center justify-center rounded transition-colors"
                                    >
                                        <Image
                                            src={SubtractIcon}
                                            alt="Decrease quantity"
                                            width={18}
                                            height={18}
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <span className="w-[30px] text-center text-sm font-semibold text-midnight">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={(e) => handleQuantityChange(e, 1)}
                                        className="w-5 h-5 flex items-center justify-center rounded transition-colors"
                                    >
                                        <Image
                                            src={AddIcon}
                                            alt="Increase quantity"
                                            width={18}
                                            height={18}
                                            className="w-4 h-4"
                                        />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className={`inline-flex h-9 items-center justify-center gap-2 px-[14px] rounded-[8px] font-semibold text-sm transition-colors min-w-[114px] ${outOfStock
                                        ? "bg-brand-200 text-white cursor-not-allowed"
                                        : "bg-tango text-white"
                                        }`}
                                    onClick={handleAddClick}
                                    disabled={outOfStock}
                                >
                                    <Image
                                        src={AddDefaultIcon}
                                        alt="Add item"
                                        width={18}
                                        height={18}
                                        className="w-4 h-4"
                                    />
                                    Add
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition duration-300 border border-gray-200 hover:border-sunRay select-none ${onClick ? 'cursor-pointer' : ''}`}
        >
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
                        <button
                            className="inline-flex h-auto items-center justify-center px-4 py-2.5 whitespace-nowrap rounded-[8px] font-semibold text-[13px] desktop:text-sm bg-white text-black border border-gray-300 cursor-default pointer-events-none"
                        >
                            Out of Stock
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 tablet:p-5 desktop:p-4 flex flex-col flex-1 gap-4">
                {/* Veg/Non-veg Icon & Name (for compact variant) or Icon & Rating Row (for default variant) */}
                {variant === "compact" ? (
                    <div className="flex flex-col items-start gap-2">
                        {isVeg ? <VegIcon /> : <NonVegIcon />}
                        <h3 className="text-sm tablet:text-base desktop:text-[18px] font-semibold text-midnight leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.3]">
                            {name}
                        </h3>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        {isVeg ? <VegIcon /> : <NonVegIcon />}
                        <div className="flex items-center gap-1">
                            <StarRating rating={rating} variant="single" size="sm" />
                            {reviews && (
                                <span className="text-xs tablet:text-sm desktop:text-sm font-normal text-midnight leading-5">
                                    ({reviews})
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Name for default variant */}
                {variant === "default" && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-base tablet:text-lg desktop:text-xl font-semibold text-midnight leading-normal whitespace-nowrap overflow-hidden text-ellipsis">
                            {name}
                        </h3>
                        <p className="text-sm tablet:text-base desktop:text-base text-gray-600 leading-[1.5] line-clamp-2">
                            {description}
                        </p>
                    </div>
                )}

                {/* Description for compact variant */}
                {variant === "compact" && (
                    <p className="text-xs tablet:text-sm desktop:text-base text-gray-600 line-clamp-2 leading-normal">
                        {description}
                    </p>
                )}

                {/* Rating for compact variant */}
                {variant === "compact" && (
                    <div>
                        <StarRating rating={rating} variant="single" size="sm" />
                    </div>
                )}

                {/* Price & Add Button / Quantity Controls */}
                <div className="flex items-center justify-between mt-auto">
                    <span className={`font-semibold text-midnight leading-normal ${variant === "compact"
                        ? "text-base tablet:text-lg desktop:text-xl"
                        : "text-lg tablet:text-xl desktop:text-2xl"
                        }`}>
                        {formattedPrice}
                    </span>

                    {quantity && quantity > 0 ? (
                        <div
                            className="inline-flex h-9 items-center justify-between gap-2 px-3.5 bg-white rounded-lg border border-gray-300 shadow-sm min-w-[114px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={(e) => handleQuantityChange(e, -1)}
                                className="w-5 h-5 flex items-center justify-center rounded transition-colors"
                            >
                                <Image
                                    src={SubtractIcon}
                                    alt="Decrease quantity"
                                    width={18}
                                    height={18}
                                    className="w-4 h-4"
                                />
                            </button>
                            <span className="w-[30px] text-center text-sm font-semibold text-midnight">
                                {quantity}
                            </span>
                            <button
                                onClick={(e) => handleQuantityChange(e, 1)}
                                className="w-5 h-5 flex items-center justify-center rounded transition-colors"
                            >
                                <Image
                                    src={AddIcon}
                                    alt="Increase quantity"
                                    width={18}
                                    height={18}
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                    ) : (
                        <button
                            className={`inline-flex h-9 items-center justify-center gap-2 px-[14px] rounded-[8px] font-semibold text-sm transition-colors min-w-[114px] ${outOfStock
                                ? "bg-brand-200 text-white cursor-not-allowed"
                                : "bg-tango text-white"
                                }`}
                            onClick={handleAddClick}
                            disabled={outOfStock}
                        >
                            <Image
                                src={AddDefaultIcon}
                                alt="Add item"
                                width={18}
                                height={18}
                                className="w-4 h-4"
                            />
                            Add
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

