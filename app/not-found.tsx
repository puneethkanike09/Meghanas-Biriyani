import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function NotFound() {
    return (
        <section className="min-h-screen bg-white flex items-center">
            <div className="section-container flex flex-col-reverse desktop:flex-row items-center gap-10 tablet:gap-12 desktop:gap-16 w-full py-20 tablet:py-24 desktop:py-32">
                <div className="flex-1 flex flex-col gap-6 tablet:gap-7 desktop:gap-8 text-center desktop:text-left">
                    <div className="inline-flex items-center justify-center desktop:justify-start gap-2 rounded-full bg-lightOrange px-4 py-2 text-xs tablet:text-sm font-semibold text-tango">
                        404 — Page Not Found
                    </div>
                    <h1 className="text-3xl tablet:text-4xl desktop:text-[48px] font-semibold text-midnight leading-tight">
                        Looks like this page took a wrong turn.
                    </h1>
                    <p className="text-base tablet:text-lg desktop:text-[18px] font-normal text-gray-600 leading-relaxed max-w-xl mx-auto desktop:mx-0">
                        Don&apos;t worry, the biryanis are still hot and waiting for you. Let&apos;s get you back to the flavours you love.
                    </p>
                    <div className="flex flex-col tablet:flex-row items-center desktop:items-start gap-4 tablet:gap-5">
                        <Link
                            href="/"
                            className={cn(
                                "inline-flex h-auto items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap rounded-[8px] font-semibold text-[13px] desktop:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                "bg-white text-black border border-gray-300 hover:bg-gray-100",
                                "w-full tablet:w-auto"
                            )}
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/menu"
                            className={cn(
                                "inline-flex h-auto items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap rounded-[8px] font-semibold text-[13px] desktop:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                "bg-black text-white hover:bg-gray-800",
                                "w-full tablet:w-auto"
                            )}
                        >
                            Explore Menu
                        </Link>
                    </div>
                </div>
                <div className="flex-1 max-w-[480px] w-full">
                    <div className="relative aspect-square tablet:aspect-[4/3]">
                        <Image
                            src="/assets/homepage/images/top10.jpg"
                            alt="Confused chef illustration"
                            fill
                            className="rounded-3xl object-cover shadow-lg"
                            priority
                        />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-white/0 pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}

