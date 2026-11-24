-- Customer accounts
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  phone_last10 TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  city TEXT,
  address TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_customers_phone ON customers (phone_last10);

-- Login sessions. Only a SHA-256 hash of the cookie token is stored.
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_sessions_customer ON sessions (customer_id);

-- Failed login attempts, for simple brute-force protection.
CREATE TABLE login_attempts (
  key TEXT NOT NULL,
  at TEXT NOT NULL
);
CREATE INDEX idx_login_attempts_key ON login_attempts (key, at);

ALTER TABLE orders ADD COLUMN customer_id TEXT REFERENCES customers (id);
CREATE INDEX idx_orders_customer ON orders (customer_id);
