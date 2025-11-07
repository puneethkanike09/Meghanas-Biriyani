import Image from "next/image";
import StarIconFilled from "./assets/icons/starIcon.svg";
import StarIconUnfilled from "./assets/icons/Star2Icon.svg";

export interface StarRatingProps {
    rating: number;
    maxRating?: number;
    variant?: "single" | "multiple";
    size?: "sm" | "md" | "lg";
    showNumber?: boolean;
}

export default function StarRating({
    rating,
    maxRating = 5,
    variant = "multiple",
    size = "md",
    showNumber = false,
}: StarRatingProps) {
    const sizeClasses = {
        sm: "w-3 h-3 tablet:w-3.5 tablet:h-3.5 desktop:w-4 desktop:h-4",        // Mobile: 12px, Tablet: 14px, Desktop: 16px
        md: "w-3 h-3 tablet:w-3.5 tablet:h-3.5 desktop:w-4 desktop:h-4",        // Mobile: 12px, Tablet: 14px, Desktop: 16px
        lg: "w-4 h-4 tablet:w-[18px] tablet:h-[18px] desktop:w-5 desktop:h-5", // Mobile: 16px, Tablet: 18px, Desktop: 20px
    };

    // Single star variant - just show 1 star with the rating number
    if (variant === "single") {
        return (
            <div className="flex items-center gap-1">
                <Image
                    src={StarIconFilled}
                    alt="Star"
                    className={sizeClasses[size]}
                />
                <span className="text-xs tablet:text-sm desktop:text-sm font-normal text-midnight leading-[1.4]">
                    {rating}
                </span>
            </div>
        );
    }

    // Multiple stars variant - show all stars with filled/unfilled states
    return (
        <div className="flex items-center gap-1">
            <div className="flex gap-1">
                {Array.from({ length: maxRating }, (_, index) => index + 1).map((star) => (
                    <Image
                        key={star}
                        src={star <= rating ? StarIconFilled : StarIconUnfilled}
                        alt="Star"
                        className={sizeClasses[size]}
                    />
                ))}
            </div>
            {showNumber && (
                <span className="text-xs tablet:text-sm desktop:text-sm font-medium text-midnight leading-[1.4]">
                    {rating}
                </span>
            )}
        </div>
    );
}
