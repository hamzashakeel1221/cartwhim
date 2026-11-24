# CartWhim

Online store for Pakistan, built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4.

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

## Run it

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

## Where to change things

| What | File |
|---|---|
| Store name, WhatsApp number, delivery fee, free delivery limit | `src/lib/store-config.ts` |
| Products and categories | `src/lib/catalog.ts` |
| Suppliers | `src/lib/suppliers.ts` |
| Brand colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |

Each product has a `supplier` (id from `suppliers.ts`), an optional `supplierSku` (the supplier's product code) and an optional `cost` (what the supplier charges you). These are never shown to shoppers. Real photos go in `public/products/` and are listed in the product's `images` array; until then a branded placeholder is shown.

## Before going live

- Orders are saved to `.data/orders.json`. That is fine on a VPS but not on Vercel/serverless, where the disk is wiped. Move orders to a database (Postgres via Neon or Supabase) before launching there.
- Put your real WhatsApp Business number and support email in `store-config.ts`.
- JazzCash / Easypaisa / card payments are shown as "coming soon".
