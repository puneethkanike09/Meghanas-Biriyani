"use client";

interface ProfileNavigationProps {
    activeTab: "profile" | "orders" | "address";
    onTabChange: (tab: "profile" | "orders" | "address") => void;
}

const navigationItems = [
    { id: "profile" as const, label: "Profile" },
    { id: "orders" as const, label: "Orders" },
    { id: "address" as const, label: "Address" },
    { id: "profile" as const, label: "Profile" },
    { id: "orders" as const, label: "Orders" },
    { id: "address" as const, label: "Address" },
    { id: "profile" as const, label: "Profile" },
    { id: "orders" as const, label: "Orders" },
    { id: "address" as const, label: "Address" },
    { id: "profile" as const, label: "Profile" },
    { id: "orders" as const, label: "Orders" },
    { id: "address" as const, label: "Address" },
    { id: "profile" as const, label: "Profile" },
    { id: "orders" as const, label: "Orders" },
    { id: "address" as const, label: "Address" },
];

export default function ProfileNavigation({ activeTab, onTabChange }: ProfileNavigationProps) {
    return (
        <>
            {/* Mobile/Tablet: Top tabs */}
            <div className="flex border-b border-gray-200 desktop:hidden">
                {navigationItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex-1 px-4 py-3 text-base font-semibold transition-colors relative ${activeTab === item.id
                            ? "text-midnight border-b-2 border-tango"
                            : "text-gray-700"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Desktop: Sidebar */}
            <aside className="hidden desktop:block desktop:w-[316px] desktop:flex-shrink-0 desktop:sticky desktop:top-28">
                <nav className="flex h-[calc(100vh-7rem)] flex-col overflow-y-auto border-r border-gray-200 custom-scrollbar">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex items-center p-3 text-left text-base transition-colors ${activeTab === item.id
                                ? "border-l-2 border-tango font-semibold text-midnight"
                                : "border-l-2 border-transparent font-normal text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
}

