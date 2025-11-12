"use client";

import { useState } from "react";
import FilterBar from "./components/FilterBar";
import MenuItemsList from "./components/MenuItemsList";
import ShoppingCart from "./components/ShoppingCart";

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    isVeg: boolean;
    image: string;
    category: string;
    outOfStock?: boolean;
    addOns?: MenuItem[];
}

export interface CartItem extends MenuItem {
    quantity: number;
}

// Sample menu data - you can replace this with API data
const MENU_ITEMS: MenuItem[] = [
    {
        id: 1,
        name: "Chicken Biryani",
        description: "This biryani comes with two pieces of chicken, raita, gravy and is cooked in our freshly prepared spice blend. It is moderately spicy and serves two. Bringing the swad and spicyness of Hyderabadi flavours and the paragraph continues here.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        category: "Recommended",
        addOns: [
            {
                id: 101,
                name: "Lemon Dry Chicken",
                description: "Fresh lemon and our in-house andra spice mix",
                price: 349,
                rating: 4.5,
                reviews: 58,
                isVeg: false,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },
            {
                id: 102,
                name: "Golden Baby Corn",
                description: "Crispy baby corn with special seasoning",
                price: 299,
                rating: 4.5,
                reviews: 58,
                isVeg: true,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },
            {
                id: 103,
                name: "Golden Baby Corn",
                description: "Crispy baby corn with special seasoning",
                price: 299,
                rating: 4.5,
                reviews: 58,
                isVeg: true,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },


        ],
    },
    {
        id: 2,
        name: "Paneer Butter Masala",
        description: "Fresh pieces of paneer are coated in our in-house andra spice missala and cooked to perfection with butter and cream.",
        price: 349,
        rating: 4.5,
        reviews: 59,
        isVeg: true,
        image: "/assets/homepage/images/top10.jpg",
        category: "Recommended",
        addOns: [
            {
                id: 101,
                name: "Lemon Masala Chicken",
                description: "Fresh lemon and our in-house andra spice mix",
                price: 349,
                rating: 4.5,
                reviews: 58,
                isVeg: false,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },
            {
                id: 102,
                name: "Golden Baby Corn",
                description: "Crispy baby corn with special seasoning",
                price: 299,
                rating: 4.5,
                reviews: 58,
                isVeg: true,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },
            {
                id: 103,
                name: "Golden Baby Corn",
                description: "Crispy baby corn with special seasoning",
                price: 299,
                rating: 4.5,
                reviews: 58,
                isVeg: true,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },

        ],
    },
    {
        id: 3,
        name: "Mutton Keema Biryani",
        description: "Minced mutton is cooked with our in-house andra spice mix and this biryani is served with gravy and raita. It is moderately spicy and will serve two.",
        price: 470,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        category: "Top 10 - Bestsellers",
        addOns: [
            {
                id: 101,
                name: "Lemon Masala Chicken",
                description: "Fresh lemon and our in-house andra spice mix",
                price: 349,
                rating: 4.5,
                reviews: 58,
                isVeg: false,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },
            {
                id: 102,
                name: "Golden Baby Corn",
                description: "Crispy baby corn with special seasoning",
                price: 299,
                rating: 4.5,
                reviews: 58,
                isVeg: true,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },
            {
                id: 103,
                name: "Golden Baby Corn",
                description: "Crispy baby corn with special seasoning",
                price: 299,
                rating: 4.5,
                reviews: 58,
                isVeg: true,
                image: "/assets/homepage/images/top10.jpg",
                category: "Add-ons",
            },

        ],

    },
    {
        id: 4,
        name: "Prawns Biryani",
        description: "This biryani is topped with 12-13 pieces of prawns are marinated and cooked in our in-house andra spice mix. It serves two people and is moderately spicy.",
        price: 470,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        category: "Top 10 - Bestsellers",
    },
    {
        id: 5,
        name: "Meghana Chicken 555",
        description: "Boneless, long strips of chicken are pan-fried with our freshly made andra spice mix, garlic, fresh chilies, and curry leaves. It is pretty spicy.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        category: "Top 10 - Bestsellers",
        outOfStock: true,
    },
    {
        id: 6,
        name: "Lemon Chicken",
        description: "Fresh lemon and our in-house andra spice mix are used to cook boneless pieces of chicken for this dish. It is moderately spicy and is pan-fried to perfection.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: false,
        image: "/assets/homepage/images/top10.jpg",
        category: "Top 10 - Bestsellers",
    },
    {
        id: 7,
        name: "Chilly Gobi",
        description: "This is a spicy dish. Pieces of gobi are cooked with our in-house andra spice mix and finished in a pan with a lot of fresh green chilies.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: true,
        image: "/assets/homepage/images/top10.jpg",
        category: "Starters",
    },
    {
        id: 8,
        name: "Gobi 65",
        description: "The gobi is coated and fried in our freshly made andra spice mix with curry leaves. This is a moderately spicy dish.",
        price: 349,
        rating: 4.5,
        reviews: 58,
        isVeg: true,
        image: "/assets/homepage/images/top10.jpg",
        category: "Starters",
    },
];

export default function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expandedDishId, setExpandedDishId] = useState<number | null>(null);
    const [showAddOnsForId, setShowAddOnsForId] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    // Filter menu items based on selected category
    const filteredItems = selectedCategory === "All"
        ? MENU_ITEMS
        : MENU_ITEMS.filter(item => item.category === selectedCategory);

    // Get unique categories from menu items
    const categories = ["All", ...Array.from(new Set(MENU_ITEMS.map(item => item.category)))];

    const handleCardClick = (itemId: number) => {
        // Toggle expansion
        setExpandedDishId(expandedDishId === itemId ? null : itemId);
        // Close add-ons when expanding
        setShowAddOnsForId(null);
    };

    const handleAddClick = (item: MenuItem) => {
        // Always add to cart first
        addItemToCart(item);

        // If item has add-ons, show them below as suggestions
        if (item.addOns && item.addOns.length > 0) {
            setShowAddOnsForId(item.id);
            // Keep expanded view open if it's the same item, close it if different
            // This way clicking Add on expanded card keeps it expanded
        }
    };

    const addItemToCart = (item: MenuItem, quantity: number = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + quantity }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity }];
            }
        });
    };

    const updateCartItemQuantity = (itemId: number, change: number) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity + change;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Filter Bar - Sticky below navbar */}
            <div className="sticky top-[88px] tablet:top-[88px] desktop:top-[96px] z-40 bg-white before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-160px] before:h-[200px] before:bg-white before:-z-10 tablet:before:top-[-160px] tablet:before:h-[220px] desktop:before:top-[-180px] desktop:before:h-[240px]">
                <FilterBar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>

            {/* Main Content - Proper spacing and scroll behavior */}
            <div className="section-container pt-24 tablet:pt-[104px] desktop:pt-[100px] pb-16 tablet:pb-16 desktop:pb-16">
                <div className="flex flex-col desktop:flex-row gap-6 desktop:gap-8 items-start">
                    {/* Menu Items Section - Scrollable */}
                    <div className="flex-1 w-full">
                        <MenuItemsList
                            items={filteredItems}
                            expandedDishId={expandedDishId}
                            showAddOnsForId={showAddOnsForId}
                            onCardClick={handleCardClick}
                            onAddClick={handleAddClick}
                            onAddToCart={addItemToCart}
                            cart={cart}
                            onUpdateQuantity={updateCartItemQuantity}
                        />
                    </div>

                    {/* Shopping Cart - Sticky on desktop, Full Height */}
                    <div className="w-full desktop:w-[400px] desktop:sticky desktop:top-[168px] desktop:h-[calc(100vh-188px)]">
                        <ShoppingCart
                            items={cart}
                            onUpdateQuantity={updateCartItemQuantity}
                            onClearCart={clearCart}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

