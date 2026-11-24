import type { MetadataRoute } from "next";
import { store } from "@/lib/store-config";

// Lets shoppers "Add to Home Screen" so CartWhim opens like an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${store.name}: Online Shopping in Pakistan`,
    short_name: store.name,
    description: "Gadgets, home, fashion and more with Cash on Delivery all over Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#f2622e",
    lang: "en-PK",
    categories: ["shopping"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "Today's deals", url: "/products?tag=deal" },
      { name: "My orders", url: "/account" },
    ],
  };
}
