-- Automatic HHC fulfilment and order tracking.
-- hhc_push: pending (not sent yet), sending, sent, failed, skipped (no HHC items, or auto-send turned off)
ALTER TABLE orders ADD COLUMN hhc_push TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN hhc_order_id INTEGER;
ALTER TABLE orders ADD COLUMN hhc_error TEXT;
ALTER TABLE orders ADD COLUMN hhc_status TEXT;        -- HHC's own status name, e.g. "In Transit"
ALTER TABLE orders ADD COLUMN hhc_tracking TEXT;
ALTER TABLE orders ADD COLUMN hhc_courier TEXT;
ALTER TABLE orders ADD COLUMN hhc_cost INTEGER;       -- what HHC charges you for the order (products + shipping)
ALTER TABLE orders ADD COLUMN hhc_profit INTEGER;     -- your profit as HHC calculates it
ALTER TABLE orders ADD COLUMN hhc_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN updated_at TEXT;
CREATE INDEX idx_orders_hhc_push ON orders (hhc_push);
CREATE INDEX idx_orders_hhc_order ON orders (hhc_order_id);
CREATE INDEX idx_orders_phone ON orders (phone_last10);
CREATE INDEX idx_orders_status ON orders (status);

-- Unit cost at the time of the order, for profit estimates before HHC reports the real figure.
ALTER TABLE order_items ADD COLUMN cost INTEGER;

-- Small key/value store for admin settings and bookkeeping (auto-send switch, last status sync time).
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
