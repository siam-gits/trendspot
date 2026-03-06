import type { Metadata, Viewport } from "next";
import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LiveChat } from "@/components/LiveChat";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "TrendSpot Store – Discover Trending Products",
    template: "%s | TrendSpot Store",
  },
  description:
    "A modern portfolio demo e-commerce app. Browse trending products, manage your cart, and checkout. Built with Next.js, MongoDB, and Stripe.",
  keywords: ["e-commerce", "demo", "Next.js", "portfolio", "shopping"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${outfit.variable} font-sans antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <LiveChat />
        </Providers>
      </body>
    </html>
  );
}
