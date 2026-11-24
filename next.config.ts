import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {};

export default nextConfig;

// Makes Cloudflare bindings (the D1 database) available during `next dev`.
initOpenNextCloudflareForDev();
