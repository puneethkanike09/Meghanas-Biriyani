import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuHamburger from "@/components/ui/MenuHamburger";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
                <MenuHamburger />
            </div>
        </>
    );
}

