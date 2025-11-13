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
        <div className="min-h-screen bg-white">
            <div className="pt-24 tablet:pt-24 desktop:pt-28">
                <div className="section-container pb-16">
                    <div className="flex flex-col gap-8 desktop:flex-row desktop:items-start">
                        {/* Navigation Sidebar */}
                        <ProfileNavigation
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        {/* Content Area */}
                        <div className="flex-1 w-full desktop:pl-12">
                            <div className="w-full desktop:max-w-[980px] desktop:py-4">
                                {activeTab === "profile" && <ProfileTab />}
                                {activeTab === "orders" && <OrdersTab />}
                                {activeTab === "address" && <AddressTab />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

