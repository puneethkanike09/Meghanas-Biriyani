import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";

const VISION_TEXT =
    "To be the unequivocal leader in the culinary landscape, delighting guests with unparalleled gourmet experiences that seamlessly blend innovation, tradition, and exceptional service.";

const MISSION_TEXT =
    'Empowering culinary passions, our mission is to create a gourmet haven where "We Can" explore, innovate, and savor together — fostering a community united by the love of exceptional food and hospitality.';

type GridImage = {
    src: string;
    alt: string;
    colSpan?: string;
    rowSpan?: string;
};

const GRID_IMAGES: GridImage[] = [
    {
        src: "/assets/homepage/images/top10.jpg",
        alt: "Signature biryani bowl",
        rowSpan: "row-span-2",
    },
    {
        src: "/assets/homepage/images/top10.jpg",
        alt: "Chef preparing spices",
    },
    {
        src: "/assets/homepage/images/top10.jpg",
        alt: "Plated Andhra cuisine",
        rowSpan: "row-span-2",
    },
    {
        src: "/assets/homepage/images/top10.jpg",
        alt: "Festive spread of dishes",
        rowSpan: "row-span-2",
    },
    {
        src: "/assets/homepage/images/top10.jpg",
        alt: "Fresh ingredients closeup",
    },
    {
        src: "/assets/homepage/images/top10.jpg",
        alt: "Comforting meal in bowl",
    },
    {
        src: "/assets/homepage/images/top10.jpg",
        alt: "Golden fried starters",
    },
];

export default function VisionMissionSection() {
    return (
        <section className="py-16 tablet:py-20 desktop:py-24 bg-white">
            <div className="section-container">
                <div className="max-w-[1000px] mx-auto grid grid-cols-2 tablet:grid-cols-3 gap-4 auto-rows-[160px] tablet:auto-rows-[180px] desktop:auto-rows-[200px]">
                    <GridImageBlock image={GRID_IMAGES[0]} />
                    <GridImageBlock image={GRID_IMAGES[1]} />

                    <VisionMissionCard title="Our Vision" description={VISION_TEXT} />

                    <GridImageBlock image={GRID_IMAGES[2]} />
                    <GridImageBlock image={GRID_IMAGES[3]} />
                    <GridImageBlock image={GRID_IMAGES[4]} />

                    <VisionMissionCard title="Our Mission" description={MISSION_TEXT} />

                    <GridImageBlock image={GRID_IMAGES[5]} />
                    <GridImageBlock image={GRID_IMAGES[6]} />
                </div>
            </div>
        </section>
    );
}

type VisionMissionCardProps = {
    title: string;
    description: string;
};

function VisionMissionCard({ title, description }: VisionMissionCardProps) {
    return (
        <Card className="col-span-2 tablet:col-span-1 row-span-2 bg-[#fff3eb] border-[#f5ac86] rounded-3xl flex items-center">
            <CardContent className="flex flex-col gap-3 p-6">
                <h3 className="text-2xl font-semibold text-grey-900 leading-tight">{title}</h3>
                <p className="text-base text-grey-700 leading-relaxed">{description}</p>
            </CardContent>
        </Card>
    );
}

type GridImageBlockProps = {
    image: GridImage;
};

function GridImageBlock({ image }: GridImageBlockProps) {
    return (
        <div className={`relative col-span-1 ${image.rowSpan ?? "row-span-1"} min-h-[160px] tablet:min-h-0`}>
            <Image
                src={image.src}
                alt={image.alt}
                fill
                className="rounded-2xl object-cover"
                sizes="(min-width: 1024px) 320px, (min-width: 768px) 33vw, 50vw"
                priority={image.rowSpan === "row-span-2"}
            />
        </div>
    );
}


