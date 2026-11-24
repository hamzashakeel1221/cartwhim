import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Pre-rendered pages (home, product pages) are served straight from Cloudflare's static assets.
// If you later add ISR / revalidation, switch to the R2 incremental cache:
// https://opennext.js.org/cloudflare/caching
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});

// `npm run build` runs the OpenNext build (so Cloudflare's default build command works),
// so OpenNext itself must call `next build` directly instead of `npm run build`.
export default { ...config, buildCommand: "npx next build" };
