import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuHamburger from "@/components/ui/MenuHamburger";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const proximaNova = localFont({
  src: [
    {
      path: './fonts/Proxima Nova Thin.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/ProximaNova-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Proxima Nova Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Proxima Nova Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Proxima Nova Extrabold.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-proxima-nova',
});

export const metadata: Metadata = {
  title: "Meghana's Biriyani - Authentic South Indian Cuisine",
  description: "Experience the rich flavors of traditional Indian food, delivered fresh to your doorstep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const isDark = theme === 'dark' || 
                    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${proximaNova.variable} ${geistSans.variable} ${geistMono.variable} font-proxima-nova antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
          <MenuHamburger />
        </div>
      </body>
    </html>
  );
}
