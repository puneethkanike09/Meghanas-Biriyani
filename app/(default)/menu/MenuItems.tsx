"use client";

const MENU_ITEMS = [
    {
        category: "Signature Biryanis",
        items: [
            {
                name: "Special Chicken Biryani",
                description: "Aromatic basmati rice cooked with tender chicken and special spices",
                price: "₹299",
                isSpicy: true,
                isPopular: true,
            },
            {
                name: "Mutton Biryani",
                description: "Traditional biryani with tender mutton pieces and fragrant rice",
                price: "₹349",
                isSpicy: true,
                isPopular: true,
            },
            {
                name: "Veg Biryani",
                description: "Fresh vegetables cooked with aromatic rice and special masalas",
                price: "₹249",
                isSpicy: false,
            },
        ],
    },
    {
        category: "Starters",
        items: [
            {
                name: "Chicken 65",
                description: "Spicy deep-fried chicken with curry leaves and aromatic spices",
                price: "₹249",
                isSpicy: true,
            },
            {
                name: "Paneer Tikka",
                description: "Grilled cottage cheese marinated in spiced yogurt",
                price: "₹229",
                isSpicy: false,
                isPopular: true,
            },
        ],
    },
];

export default function MenuItems() {
    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="section-container">
                {MENU_ITEMS.map((category) => (
                    <div key={category.category} className="mb-12">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                            {category.category}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {category.items.map((item) => (
                                <div
                                    key={item.name}
                                    className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {item.name}
                                            {item.isSpicy && (
                                                <span className="ml-2 text-red-500" title="Spicy">
                                                    🌶️
                                                </span>
                                            )}
                                        </h3>
                                        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                            {item.price}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                                    {item.isPopular && (
                                        <span className="inline-block mt-2 text-sm px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 rounded">
                                            Popular Choice 🔥
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}