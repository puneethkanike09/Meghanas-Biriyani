"use client";

import { useState } from "react";
import ProfileNavigation from "./components/ProfileNavigation";
import ProfileTab from "./components/ProfileTab";
import OrdersTab from "./components/OrdersTab";
import AddressTab from "./components/AddressTab";

type TabType = "profile" | "orders" | "address";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<TabType>("profile");

    return (
        <div className="min-h-screen bg-white pt-24 tablet:pt-24 desktop:pt-28">
            <div className="section-container pb-16">
                <div className="flex flex-col desktop:flex-row gap-0 desktop:gap-0">
                    {/* Navigation Sidebar */}
                    <ProfileNavigation
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Content Area */}
                    <div className="flex-1 desktop:pl-20">
                        <div className="w-full desktop:max-w-[980px]">
                            {activeTab === "profile" && <ProfileTab />}
                            {activeTab === "orders" && <OrdersTab />}
                            {activeTab === "address" && <AddressTab />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

