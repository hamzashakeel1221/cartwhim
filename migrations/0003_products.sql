-- Products added from the admin (/admin/products). The built-in catalog in src/lib/catalog.ts keeps working;
-- these rows are shown alongside it.
CREATE TABLE products (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  supplier TEXT NOT NULL,
  supplier_sku TEXT,
  cost INTEGER,
  price INTEGER NOT NULL,
  compare_at INTEGER,
  stock INTEGER NOT NULL DEFAULT 20,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  tags TEXT NOT NULL DEFAULT '[]',       -- JSON array: trending | deal | new
  scroll3d INTEGER NOT NULL DEFAULT 1,   -- show the 3D scroll section on the product page
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_products_created ON products (created_at);

-- Product photos uploaded from the admin. Works for admin products AND for products in catalog.ts (matched by slug).
-- The browser resizes photos before upload: `data` is up to ~1400px wide, `thumb` is ~560px wide (for product cards).
CREATE TABLE product_photos (
  id TEXT PRIMARY KEY,
  product_slug TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  mime TEXT NOT NULL,
  data BLOB NOT NULL,
  thumb BLOB,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_product_photos_slug ON product_photos (product_slug, position);
