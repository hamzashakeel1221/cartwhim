import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    localPatterns: [{ pathname: "/api/photo/**" }, { pathname: "/**", search: "" }],
    // Product photos hosted by HHC Dropshipping (used by the HHC products in lib/hhc-products.ts).
    remotePatterns: [{ protocol: "https", hostname: "hhcnewapp.blr1.cdn.digitaloceanspaces.com", pathname: "/uploads/**" }],
  },
};

export default nextConfig;

// Makes Cloudflare bindings (the D1 database) available during `next dev`.
initOpenNextCloudflareForDev();
