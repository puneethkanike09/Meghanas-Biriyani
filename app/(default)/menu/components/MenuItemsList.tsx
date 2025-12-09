"use client";

import { MenuItem } from "@/services/menu.service";
import DishCard from "@/components/ui/DishCard";
import { useCartStore } from "@/store/useCartStore";

interface MenuItemsListProps {
    items: MenuItem[];
    categories: { id: string; name: string }[];
    expandedDishId: string | null;
    showOptionSetsForId: string | null;
    onCardClick: (itemId: string) => void;
    onAddClick: (item: MenuItem) => void;
}

export default function MenuItemsList({
    items,
    categories,
    expandedDishId,
    showOptionSetsForId,
    onCardClick,
    onAddClick,
}: MenuItemsListProps) {
    const { items: cartItems, addItem } = useCartStore();

    // Helper to check if item is vegetarian based on tags
    const isVegetarian = (item: MenuItem) => {
        // Check if "Vegetarian" tag exists in itemTagIds
        return item.itemTagIds?.includes("Vegetarian") || false;
    };

    // Create category lookup map
    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
    }, {} as Record<string, string>);

    // Group items by categoryId
    const groupedItems = items.reduce((acc, item) => {
        const category = item.categoryId || "Other";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
        <div className="flex flex-col gap-8">
            {Object.entries(groupedItems).map(([categoryId, categoryItems]) => {
                const categoryName = categoryMap[categoryId] || "Other";

                return (
                    <section key={categoryId} className="flex flex-col gap-4">
                        {/* Category Header */}
                        <h2 className="text-xl tablet:text-2xl font-semibold text-midnight">
                            {categoryName} ({categoryItems.length})
                        </h2>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
                            {categoryItems.map((item) => {
                                const isExpanded = expandedDishId === item.itemId;
                                const cartItem = cartItems.find(c => c.item_id === item.itemId);

                                return (
                                    <div
                                        key={item.itemId}
                                        className={isExpanded ? "col-span-1 tablet:col-span-2 desktop:col-span-3" : ""}
                                    >
                                        <DishCard
                                            id={item.itemId}
                                            name={item.itemName}
                                            description={item.extraInfo?.protein ? `Protein: ${item.extraInfo.protein}g, Calories: ${item.calorieCount || 0}` : ""}
                                            price={item.price}
                                            rating={4.5}
                                            reviews={0}
                                            isVeg={isVegetarian(item)}
                                            image={item.imageURL && item.imageURL.trim() ? item.imageURL : "/assets/homepage/images/top10.jpg"}
                                            outOfStock={item.isOutOfStock || item.status !== "Active"}
                                            variant={isExpanded ? "expanded" : "default"}
                                            onClick={isExpanded ? undefined : () => onCardClick(item.itemId)}
                                            onAdd={() => onAddClick(item)}
                                            quantity={cartItem?.quantity || 0}
                                            onUpdateQuantity={(change) => addItem(item.itemId, (cartItem?.quantity || 0) + change)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })}

            {items.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No items found in this category</p>
                </div>
            )}
        </div>
    );
}
