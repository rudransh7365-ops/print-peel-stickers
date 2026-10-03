/*
# Create orders table for storing customer order details

1. New Tables
- `orders`
  - `id` (uuid, primary key, auto-generated)
  - `order_id` (text, the human-readable order reference like PP-123456)
  - `customer_name` (text, not null — customer's full name)
  - `phone_no` (text, not null — customer's phone number)
  - `email` (text, nullable — customer's email)
  - `address` (text, nullable — shipping address)
  - `city` (text, nullable — shipping city)
  - `state` (text, nullable — shipping state)
  - `pincode` (text, nullable — shipping pincode)
  - `country` (text, nullable — shipping country)
  - `items` (jsonb, nullable — array of cart line items)
  - `subtotal` (numeric, default 0)
  - `delivery` (numeric, default 0)
  - `tax` (numeric, default 0)
  - `total` (numeric, default 0)
  - `notes` (text, nullable — optional order notes)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`.
- This is a single-tenant storefront with no sign-in screen, so anon + authenticated
  can INSERT new orders. SELECT/UPDATE/DELETE are restricted to authenticated only
  (the store owner via Supabase dashboard), preventing public access to order data.

3. Notes
- The storefront frontend uses the anon key and only ever inserts orders.
- The store owner can view/manage orders through the Supabase dashboard as an authenticated user.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text,
  customer_name text NOT NULL,
  phone_no text NOT NULL,
  email text,
  address text,
  city text,
  state text,
  pincode text,
  country text,
  items jsonb,
  subtotal numeric DEFAULT 0,
  delivery numeric DEFAULT 0,
  tax numeric DEFAULT 0,
  total numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_orders" ON orders;
CREATE POLICY "auth_select_orders"
ON orders FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders"
ON orders FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders"
ON orders FOR DELETE
TO authenticated
USING (true);