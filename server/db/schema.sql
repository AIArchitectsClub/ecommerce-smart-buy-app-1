CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL,
  emoji TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  shipping_full_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  payment_last4 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed'
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  line_total NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

INSERT INTO products (id, name, category, price, description, stock_quantity, emoji) VALUES
  ('wireless-headphones', 'Wireless Over-Ear Headphones', 'Electronics', 79.99, 'Noise-cancelling, 30-hour battery life, USB-C charging.', 24, '🎧'),
  ('smart-watch', 'Smart Fitness Watch', 'Electronics', 129.99, 'Heart rate monitor, GPS, 7-day battery, water resistant.', 15, '⌚'),
  ('bluetooth-speaker', 'Portable Bluetooth Speaker', 'Electronics', 39.99, 'Compact speaker with rich bass and 12-hour playtime.', 30, '🔊'),
  ('phone-charger', 'Fast USB-C Charger (30W)', 'Electronics', 19.99, 'Compact fast charger compatible with most phones and tablets.', 50, '🔌'),
  ('cotton-tshirt', 'Classic Cotton T-Shirt', 'Clothing', 14.99, '100% cotton, breathable, machine washable, unisex fit.', 60, '👕'),
  ('denim-jacket', 'Denim Jacket', 'Clothing', 54.99, 'Classic fit denim jacket with button closures.', 18, '🧥'),
  ('running-shoes', 'Running Shoes', 'Clothing', 64.99, 'Lightweight cushioned sole, breathable mesh upper.', 22, '👟'),
  ('coffee-maker', 'Drip Coffee Maker', 'Home & Kitchen', 44.99, '12-cup capacity, programmable timer, auto shut-off.', 12, '☕'),
  ('nonstick-pan-set', 'Non-Stick Pan Set (3-Piece)', 'Home & Kitchen', 59.99, 'Durable non-stick coating, oven-safe up to 400°F.', 10, '🍳'),
  ('led-desk-lamp', 'LED Desk Lamp', 'Home & Kitchen', 27.99, 'Adjustable brightness, 3 color modes, USB charging port.', 35, '💡'),
  ('throw-blanket', 'Fleece Throw Blanket', 'Home & Kitchen', 22.99, 'Soft plush fleece, machine washable, 50x60 inches.', 40, '🛋️'),
  ('scifi-novel', 'The Last Horizon (Sci-Fi Novel)', 'Books', 12.99, 'A gripping tale of exploration at the edge of known space.', 45, '📘'),
  ('cookbook', 'Everyday Cookbook', 'Books', 24.99, '200 easy recipes for weeknight dinners.', 20, '📗'),
  ('productivity-book', 'Deep Focus: A Productivity Guide', 'Books', 16.99, 'Practical strategies for focused, meaningful work.', 33, '📙'),
  ('yoga-mat', 'Non-Slip Yoga Mat', 'Sports & Outdoors', 25.99, 'Extra thick cushioning, non-slip surface, carrying strap included.', 28, '🧘'),
  ('camping-tent', '2-Person Camping Tent', 'Sports & Outdoors', 89.99, 'Waterproof, easy setup, includes carry bag.', 8, '⛺'),
  ('water-bottle', 'Insulated Water Bottle (32oz)', 'Sports & Outdoors', 18.99, 'Keeps drinks cold for 24 hours or hot for 12 hours.', 55, '🧴'),
  ('basketball', 'Official Size Basketball', 'Sports & Outdoors', 29.99, 'Indoor/outdoor composite leather basketball.', 17, '🏀')
ON CONFLICT (id) DO NOTHING;
