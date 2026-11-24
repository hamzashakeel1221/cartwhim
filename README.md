# CartWhim

Online store for Pakistan, built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4. Hosted on **Cloudflare Workers** (via the OpenNext adapter) with orders stored in **Cloudflare D1**.

## What's included

- Home page with hero, categories, trending and deals
- Catalog with search, category filter and sorting
- Product pages with discount, stock, Buy now and "Order on WhatsApp"
- Cart saved in the browser, free delivery progress bar
- Checkout with Cash on Delivery, Pakistani mobile number validation and city list
- Order confirmation and order tracking by order number + phone
- Admin orders page at `/admin/orders` (password protected) that splits every order by supplier
- Multiple dropshipping suppliers (HHC Dropshipping, Oshi Dropshipping, add more in `src/lib/suppliers.ts`)
- SEO: page titles, Open Graph, Product structured data with PKR prices

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

## Deploy to Cloudflare (first time)

You need a free Cloudflare account.

1. Log in: `npx wrangler login`
2. Create the database: `npx wrangler d1 create cartwhim`. Copy the `database_id` it prints into `wrangler.jsonc` (replace the zeros) and commit.
3. Create the tables: `npm run db:migrate:remote`
4. Set the admin password: `npx wrangler secret put ADMIN_PASSWORD`
5. Deploy: `npm run deploy`. The site goes live at `https://cartwhim.<your-subdomain>.workers.dev`.
6. Custom domain: in the Cloudflare dashboard open **Workers & Pages → cartwhim → Settings → Domains & Routes** and add `cartwhim.pk` / `www.cartwhim.pk`. The domain's DNS must be on Cloudflare (point the domain's nameservers to Cloudflare at your registrar).

### Auto deploy on every push (optional)

In the dashboard, open **Workers & Pages → cartwhim → Settings → Build**, connect the GitHub repo `cartwhim`, and set:

- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`

Whenever you add a new file in `migrations/`, run `npm run db:migrate:remote` once.

## Admin

Orders: `/admin/orders` (browser asks for a password: any username, password = `ADMIN_PASSWORD`). Each order is split by supplier and you can change its status (placed, confirmed, dispatched, delivered, cancelled). Customers see the status on `/track-order`.

## Not done yet

- Put your real WhatsApp Business number and support email in `store-config.ts`.
- JazzCash / Easypaisa / card payments are shown as "coming soon".
