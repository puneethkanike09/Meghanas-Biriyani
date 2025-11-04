"use client";

const VALUES = [
    {
        title: "Quality",
        description:
            "We never compromise on the quality of our ingredients or preparation methods.",
        icon: "🌟",
    },
    {
        title: "Tradition",
        description:
            "We preserve authentic recipes while innovating with modern techniques.",
        icon: "📖",
    },
    {
        title: "Service",
        description:
            "Customer satisfaction is at the heart of everything we do.",
        icon: "🤝",
    },
];

export default function ValuesSection() {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="section-container">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                    Our Values
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {VALUES.map((value) => (
                        <div
                            key={value.title}
                            className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg text-center"
                        >
                            <div className="text-4xl mb-4">{value.icon}</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
