"use client";

export default function AboutHero() {
    return (
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
    );
}
