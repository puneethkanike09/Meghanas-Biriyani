import StarRating from "./StarRating";

export interface ReviewCardProps {
    id: number;
    rating: number;
    text: string;
    author: string;
}

export default function ReviewCard({ rating, text, author }: ReviewCardProps) {
    return (
        <div className="bg-white rounded-xl p-5 tablet:p-6 desktop:p-6 h-full flex flex-col border border-gray-200">
            {/* Review Text */}
            <p className="text-sm tablet:text-[15px] desktop:text-base text-gray-700 leading-[1.6] tablet:leading-[1.6] desktop:leading-[1.6] mb-6 flex-grow">
                {text}
            </p>

            {/* Author and Rating */}
            <div className="flex flex-col gap-2">
                <StarRating rating={rating} variant="multiple" size="md" />
                <span className="text-base tablet:text-[17px] desktop:text-lg font-semibold text-gray-700 leading-[1.4] tablet:leading-[1.3] desktop:leading-[1.3]">
                    {author}
                </span>
            </div>
        </div>
    );
}

