# CartWhim

Online store for Pakistan, built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4. Hosted on **Cloudflare Workers** (via the OpenNext adapter) with orders stored in **Cloudflare D1**.

## What's included

- Home page with hero, categories, trending and deals
- Catalog with search, category filter and sorting
- Product pages with discount, stock, Buy now and "Order on WhatsApp"
- Cart saved in the browser, free delivery progress bar
- Checkout with Cash on Delivery, Pakistani mobile number validation and city list
- Order confirmation and order tracking by order number + phone
- Customer accounts: sign up / log in with email or mobile number, order history, saved delivery address that fills checkout automatically. Guest orders placed earlier with the same mobile number are linked when the account is created
- Mobile-first design: app-style bottom tab bar, slide-out cart with free delivery progress, sticky "Buy now" bar on product pages, swipeable product rows, flash deals with countdown, wishlist and recently viewed, delivery date estimate by city, "Add to Home Screen" support
- SEO: category landing pages (`/category/...`), "Price in Pakistan" product titles, canonical URLs, sitemap.xml, robots.txt, structured data (Product with PKR price, shipping and return policy, Breadcrumbs, FAQ, Organization, site search), auto-generated share images for WhatsApp/Facebook, search and filter pages kept out of Google
- Admin orders page at `/admin/orders` (password protected) that splits every order by supplier
- Multiple dropshipping suppliers (HHC Dropshipping, Oshi Dropshipping, add more in `src/lib/suppliers.ts`)

## Run it locally

```bash
npm install
cp .dev.vars.example .dev.vars   # set ADMIN_PASSWORD
cp .dev.vars .env.local          # same values, used by `next dev`
npm run db:migrate:local         # creates the local D1 database
npm run dev                      # http://localhost:3000 (fast refresh)
npm run preview                  # runs the real Cloudflare build locally
```

## Where to change things

| What | File |
|---|---|
| Store name, WhatsApp number, delivery fee, free delivery limit | `src/lib/store-config.ts` |
| Products and categories | `src/lib/catalog.ts` |
| Suppliers | `src/lib/suppliers.ts` |
| Brand colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| Database tables | `migrations/` |

Each product has a `supplier` (id from `suppliers.ts`), an optional `supplierSku` (the supplier's product code) and an optional `cost` (what the supplier charges you). These are never shown to shoppers. Real photos go in `public/products/` and are listed in the product's `images` array; until then a branded placeholder is shown.

## Deploy to Cloudflare

Same setup as LaunchWright: Cloudflare builds and deploys straight from GitHub on every push to `main`.

1. In the [Cloudflare dashboard](https://dash.cloudflare.com) open **Workers & Pages → Create → Import a repository** and pick `cartwhim`.
2. Project name: `cartwhim` (must match `name` in `wrangler.jsonc`).
3. Build command: `npm run build` (the default is fine)
4. Deploy command: `npm run cf-deploy`
   (deploys the Worker, creates the `cartwhim` D1 database automatically on the first deploy, then applies any new files in `migrations/`)
5. Click **Deploy**. The site goes live at `https://cartwhim.<your-subdomain>.workers.dev`.
6. After the first deploy, open the Worker's **Settings → Variables and secrets**, add a secret `ADMIN_PASSWORD`, and redeploy. It is kept on later deploys.
7. When you buy the domain, add `cartwhim.pk` and `www.cartwhim.pk` under **Settings → Domains & Routes** (the domain's nameservers must point to Cloudflare).

Deploying from your own computer instead: `npx wrangler login`, then `npm run deploy`.

## Admin

Orders: `/admin/orders` (browser asks for a password: any username, password = `ADMIN_PASSWORD`). Each order is split by supplier and you can change its status (placed, confirmed, dispatched, delivered, cancelled). Customers see the status on `/track-order`.

## SEO checklist after going live

1. Add the site to [Google Search Console](https://search.google.com/search-console) and submit `https://cartwhim.pk/sitemap.xml`. Put the verification code in the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` variable.
2. Create a Google Business Profile for CartWhim.
3. Use real product photos (several per product) and write your own descriptions; don't copy the supplier's text.
4. **Replace the sample ratings and review counts** in `catalog.ts` with real customer reviews, or remove them. Google penalises made-up ratings in structured data.

## Not done yet

- Put your real WhatsApp Business number and support email in `store-config.ts`.
- JazzCash / Easypaisa / card payments are shown as "coming soon".

## Adding products with photos (3D scroll pages)

Open `/admin/products` (same password as Orders) and press **Add product**. Fill in the details, add 3 to 8 photos
and save. Photos are resized in your browser and stored in Cloudflare D1, so no extra storage service is needed.
Any product with 3 or more photos gets a 3D scroll section on its own page (untick "Show 3D scroll animation" to turn it
off). Built-in products can get photos too, from the **Photos** link in the same list.

Run the new migration once on the live database before using it:

```bash
npm run db:migrate:remote   # production
npm run db:migrate:local    # local dev
```

## Importing products from HHC Dropshipping

CartWhim talks to HHC's developer API, so you can import HHC products (with photos, cost and stock) from `/admin/hhc`.

1. In HHC, open **Tools → Integration & Apps** and press **Create App**. Copy the app key.
2. In Cloudflare, open **Workers & Pages → cartwhim → Settings → Variables and Secrets** and add a **secret** named
   `HHC_APP_KEY` with that key. (Never put the key in the code or share it in chat.)
3. Open `/admin/hhc`, press **Link key to website** once, then search HHC and press **Import to CartWhim** on any product.

Imported products get HHC as their supplier and the HHC product id as their supplier code (`1234`, or `1234-v99` for a
variation), so the Orders page shows exactly which HHC product to book. Press **Update stock & costs from HHC** daily:
it refreshes cost and stock, sets stock to 0 for anything HHC no longer has, and warns you if HHC's cost has reached your
price. Your prices are never changed automatically.

Photos are HHC's own photos, copied as they are. Tick **Light photo touch-up** before importing to put each photo on a
clean white square and make it slightly brighter and sharper. It never crops or changes how the product looks.
