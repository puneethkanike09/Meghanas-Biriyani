"use client";

import { useCallback } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileNavigation from "./ProfileNavigation";

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
                <div className="section-container pb-10">
                    <div className="flex flex-col gap-8 desktop:flex-row desktop:items-start">
                        <ProfileNavigation
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                        />
                        <div className="flex-1 w-full">
                            <div className="w-full desktop:pt-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

