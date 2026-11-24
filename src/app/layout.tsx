import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CartToast } from "@/components/toast";
import { store } from "@/lib/store-config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${store.domain}`),
  title: { default: `${store.name}: Online Shopping in Pakistan`, template: `%s | ${store.name}` },
  description: "Shop gadgets, home and kitchen, fashion, beauty and more at CartWhim. Cash on Delivery and fast delivery all over Pakistan.",
  openGraph: { siteName: store.name, locale: "en_PK", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <CartProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
