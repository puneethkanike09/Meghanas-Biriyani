"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import FilterBar from "./components/FilterBar";
import FilterBarSkeleton from "./components/FilterBarSkeleton";
import MenuItemsList from "./components/MenuItemsList";
import ShoppingCart from "./components/ShoppingCart";
import { MenuService, MenuItem } from "@/services/menu.service";
import { useCartStore } from "@/store/useCartStore";
import { useMenuStore } from "@/store/useMenuStore";
import DishCardSkeleton from "@/components/ui/DishCardSkeleton";
import CategoryHeadingSkeleton from "@/components/ui/CategoryHeadingSkeleton";

function MenuPageContent() {
    const { categories: storedCategories, fetchCategories, loading: categoriesLoading, selectedCategoryId: storeSelectedCategoryId, setSelectedCategoryId: setStoreSelectedCategoryId } = useMenuStore();

    // Initialize with store value if available, otherwise default to "all"
    const [selectedCategoryId, setSelectedCategoryId] = useState(() => storeSelectedCategoryId || "all");
    const [expandedDishId, setExpandedDishId] = useState<string | null>(null);
    const [showOptionSetsForId, setShowOptionSetsForId] = useState<string | null>(null);

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const hasClearedStore = useRef(false);

    const addItem = useCartStore((state) => state.addItem);

    // Transform stored categories for local usage (adding "All" option)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([{ id: "all", name: "All" }]);

    useEffect(() => {
        if (storedCategories.length > 0) {
            setCategories([
                { id: "all", name: "All" },
                ...storedCategories.map((c) => ({ id: c.categoryId, name: c.name }))
            ]);
        }
    }, [storedCategories]);

    // Fetch Categories on Mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Update selected category when store changes (even if already on page)
    useEffect(() => {
        if (storeSelectedCategoryId && storeSelectedCategoryId !== selectedCategoryId) {
            setSelectedCategoryId(storeSelectedCategoryId);
            // Don't clear the store selection - keep it for MenuHamburger to show
        }
    }, [storeSelectedCategoryId, selectedCategoryId]);

    // Sync local selectedCategoryId back to store so MenuHamburger can show it
    useEffect(() => {
        if (selectedCategoryId && selectedCategoryId !== "all") {
            setStoreSelectedCategoryId(selectedCategoryId);
        }
    }, [selectedCategoryId, setStoreSelectedCategoryId]);

    // Scroll to top when category changes
    useEffect(() => {
        // Scroll to top of the page instantly when category changes
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }, [selectedCategoryId]);

    // Fetch Items when Category Changes
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const params = selectedCategoryId === "all" ? {} : { categoryId: selectedCategoryId };
                const itemsResponse = await MenuService.getMenuItems(params);
                setMenuItems(itemsResponse.items);
            } catch (error) {
                console.error("Failed to fetch menu items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [selectedCategoryId]);

    const handleCardClick = (itemId: string) => {
        const isCurrentlyExpanded = expandedDishId === itemId;

        // Toggle expansion
        setExpandedDishId(isCurrentlyExpanded ? null : itemId);
        // Close option sets when expanding
        setShowOptionSetsForId(null);

        // Scroll to the card when expanding (not when collapsing)
        if (!isCurrentlyExpanded) {
            // Use setTimeout to ensure DOM has updated with expanded card
            setTimeout(() => {
                const cardElement = document.getElementById(`dish-card-${itemId}`);
                if (cardElement) {
                    // Calculate offset to account for sticky navbar and filter bar
                    const navbarHeight = 88; // Mobile/Tablet
                    const filterBarHeight = 60; // Approximate filter bar height
                    const offset = navbarHeight + filterBarHeight + 20; // Extra 20px padding

                    const elementPosition = cardElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'auto'
                    });
                }
            }, 100);
        }
    };

    const handleAddClick = (item: MenuItem) => {
        // DishCard handles cart addition internally.
        // This callback is kept for logging or future analytics.
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Filter Bar - Sticky below navbar */}
            <div className="sticky top-[88px] tablet:top-[88px] desktop:top-[96px] z-40 bg-white before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-160px] before:h-[200px] before:bg-white before:-z-10 tablet:before:top-[-160px] tablet:before:h-[220px] desktop:before:top-[-180px] desktop:before:h-[240px]">
                {categoriesLoading ? (
                    <FilterBarSkeleton />
                ) : (
                    <FilterBar
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={(categoryId) => {
                            setSelectedCategoryId(categoryId);
                            // Update store selection when user manually selects
                            if (categoryId !== "all") {
                                setStoreSelectedCategoryId(categoryId);
                            } else {
                                setStoreSelectedCategoryId(null);
                            }
                        }}
                    />
                )}
            </div>

            {/* Main Content - Proper spacing and scroll behavior */}
            <div className="section-container pt-24 tablet:pt-[104px] desktop:pt-[100px] pb-16 tablet:pb-16 desktop:pb-16">
                <div className="flex flex-col desktop:flex-row gap-6 desktop:gap-8 items-start">
                    {/* Menu Items Section - Scrollable */}
                    <div className="flex-1 w-full desktop:basis-[70%] desktop:max-w-[70%]">
                        {loading ? (
                            <div className="flex flex-col gap-8">
                                {[...Array(2)].map((_, sectionIndex) => (
                                    <section key={sectionIndex} className="flex flex-col gap-4">
                                        {/* Category Heading Skeleton */}
                                        <CategoryHeadingSkeleton />
                                        {/* Items Grid Skeleton */}
                                        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
                                            {[...Array(6)].map((_, i) => (
                                                <DishCardSkeleton key={i} />
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <MenuItemsList
                                items={menuItems}
                                categories={categories}
                                expandedDishId={expandedDishId}
                                showOptionSetsForId={showOptionSetsForId}
                                onCardClick={handleCardClick}
                                onAddClick={handleAddClick}
                            />
                        )}
                    </div>

                    {/* Shopping Cart - Sticky on desktop, Full Height */}
                    <div className="w-full desktop:basis-[30%] desktop:max-w-[30%] desktop:sticky desktop:top-[168px] desktop:h-[calc(100vh-188px)]">
                        <ShoppingCart />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white">
                <div className="sticky top-[88px] tablet:top-[88px] desktop:top-[96px] z-40 bg-white">
                    <FilterBarSkeleton />
                </div>
                <div className="section-container pt-24 tablet:pt-[104px] desktop:pt-[100px] pb-16">
                    <div className="flex flex-col gap-8">
                        {[...Array(2)].map((_, sectionIndex) => (
                            <section key={sectionIndex} className="flex flex-col gap-4">
                                <CategoryHeadingSkeleton />
                                <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
                                    {[...Array(6)].map((_, i) => (
                                        <DishCardSkeleton key={i} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        }>
            <MenuPageContent />
        </Suspense>
    );
}
