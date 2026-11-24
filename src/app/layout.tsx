import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CartToast } from "@/components/toast";
import { WishlistProvider } from "@/components/wishlist-provider";
import { JsonLd, organizationLd, siteUrl } from "@/lib/seo";
import { store } from "@/lib/store-config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });

const description =
  "Online shopping in Pakistan for gadgets, home & kitchen, fashion, beauty and more. Best prices, Cash on Delivery nationwide, fast delivery and 7 day easy returns.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${store.name}: Online Shopping in Pakistan | Cash on Delivery`, template: `%s | ${store.name}` },
  description,
  applicationName: store.name,
  keywords: ["online shopping Pakistan", "cash on delivery", "online store Pakistan", "gadgets", "home and kitchen", "CartWhim"],
  alternates: { canonical: "/" },
  openGraph: { siteName: store.name, locale: "en_PK", type: "website", url: "/", title: `${store.name}: Online Shopping in Pakistan`, description },
  twitter: { card: "summary_large_image", title: `${store.name}: Online Shopping in Pakistan`, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: store.name, statusBarStyle: "default" },
  // Paste the codes from Google Search Console / Bing Webmaster Tools here after you verify the domain.
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
};

export const viewport: Viewport = {
  themeColor: "#f2622e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <JsonLd data={organizationLd()} />
        <CartProvider>
          <WishlistProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
            <Header />
            <main id="main" className="min-h-[60vh]">{children}</main>
            <Footer />
            <CartDrawer />
            <BottomNav />
            <CartToast />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
