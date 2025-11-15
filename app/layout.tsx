import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${proximaNova.variable} ${geistSans.variable} ${geistMono.variable} font-proxima-nova antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
