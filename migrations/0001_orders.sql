-- Orders placed on the storefront (Cash on Delivery)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'placed',
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_last10 TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  payment TEXT NOT NULL DEFAULT 'cod',
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL
);
CREATE INDEX idx_orders_created_at ON orders (created_at);

-- One row per product in an order. `supplier` says which dropshipping supplier fulfils it.
CREATE TABLE order_items (
  order_id TEXT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  supplier TEXT NOT NULL,
  supplier_sku TEXT,
  PRIMARY KEY (order_id, slug)
);
CREATE INDEX idx_order_items_supplier ON order_items (supplier);
