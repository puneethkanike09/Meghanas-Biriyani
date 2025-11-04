import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-orange-600 to-yellow-500">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative section-container">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-5xl font-bold mb-6">Our Story</h1>
                        <p className="text-xl opacity-90">
                            A journey of passion, tradition, and authentic flavors
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-16">
                <div className="section-container">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                                Our Heritage
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Founded in 2000, Meghana&apos;s Biriyani has been serving authentic South Indian
                                cuisine to food lovers across the city. What started as a small
                                family kitchen has grown into one of the most beloved restaurants
                                in the region.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                We take pride in our traditional recipes, passed down through
                                generations, and our commitment to using only the freshest,
                                highest-quality ingredients in every dish we prepare.
                            </p>
                        </div>
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                            <Image
                                src="/about-heritage.jpg"
                                alt="Our heritage"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="section-container">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        Our Values
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
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
                        ].map((value) => (
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
        </div>
    );
}