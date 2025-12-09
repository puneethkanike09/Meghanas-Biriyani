"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar from "./components/FilterBar";
import FilterBarSkeleton from "./components/FilterBarSkeleton";
import MenuItemsList from "./components/MenuItemsList";
import ShoppingCart from "./components/ShoppingCart";
import { MenuService, MenuItem } from "@/services/menu.service";
import { useCartStore } from "@/store/useCartStore";
import DishCardSkeleton from "@/components/ui/DishCardSkeleton";
import CategoryHeadingSkeleton from "@/components/ui/CategoryHeadingSkeleton";

function MenuPageContent() {
    const searchParams = useSearchParams();
    const filterParam = searchParams.get('filter');

    const [selectedCategoryId, setSelectedCategoryId] = useState("all");
    const [expandedDishId, setExpandedDishId] = useState<string | null>(null);
    const [showOptionSetsForId, setShowOptionSetsForId] = useState<string | null>(null);

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([{ id: "all", name: "All" }]);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const { addItem } = useCartStore();

    // Fetch Categories on Mount
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const categoriesResponse = await MenuService.getCategories();
                const categoryList = [
                    { id: "all", name: "All" },
                    ...categoriesResponse.categories.map((c: any) => ({ id: c.categoryId, name: c.name }))
                ];
                setCategories(categoryList);

                // If there's a filter param, select that category
                if (filterParam) {
                    setSelectedCategoryId(filterParam);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [filterParam]);

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
        // Toggle expansion
        setExpandedDishId(expandedDishId === itemId ? null : itemId);
        // Close option sets when expanding
        setShowOptionSetsForId(null);
    };

    const handleAddClick = (item: MenuItem) => {
        // DishCard handles cart addition internally.
        // This callback is kept for logging or future analytics.
        console.log("Item added from MenuItemsList:", item.itemId);
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
                        onSelectCategory={setSelectedCategoryId}
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
