"use client";

import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileNavigation from "./ProfileNavigation";
import { cn } from "@/lib/utils";

type TabType = "profile" | "orders" | "address";

const TAB_PATHS: Record<TabType, string> = {
    profile: "/profile",
    orders: "/profile/orders",
    address: "/profile/address",
};

function getActiveTab(pathname: string | null): TabType {
    if (!pathname) {
        return "profile";
    }

    if (pathname.startsWith("/profile/orders")) {
        return "orders";
    }

    if (pathname.startsWith("/profile/address")) {
        return "address";
    }

    return "profile";
}

interface ProfileLayoutClientProps {
    children: ReactNode;
}

export default function ProfileLayoutClient({ children }: ProfileLayoutClientProps) {
    const pathname = usePathname();
    const router = useRouter();
    const activeTab = getActiveTab(pathname);
    const isStandaloneAddressPage = useMemo(() => {
        if (!pathname) {
            return false;
        }

        if (pathname === "/profile/address") {
            return false;
        }

        return /^\/profile\/address\/(new|[^/]+\/edit)/.test(pathname);
    }, [pathname]);

    const handleTabChange = useCallback(
        (tab: TabType) => {
            const targetPath = TAB_PATHS[tab];

            if (pathname !== targetPath) {
                router.push(targetPath);
            }
        },
        [pathname, router]
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 tablet:pt-24 desktop:pt-28">
                <div
                    className={cn(
                        "section-container pb-10",
                        isStandaloneAddressPage && "max-w-none"
                    )}
                >
                    {isStandaloneAddressPage ? (
                        <div className="w-full desktop:pt-0">{children}</div>
                    ) : (
                        <div className="flex flex-col gap-8 desktop:flex-row desktop:items-start">
                            <ProfileNavigation
                                activeTab={activeTab}
                                onTabChange={handleTabChange}
                            />
                            <div className="w-full flex-1">
                                <div className="w-full desktop:pt-4">{children}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

