CREATE TABLE public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone_no text not null,
  email text not null,
  address text not null,
  google_maps_link text not null default '',
  city text not null,
  state text not null,
  pincode text not null,
  items text not null,
  subtotal numeric(10,2) not null default 0,
  delivery_charge numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  payment_method text not null default 'UPI',
  is_free_delivery boolean not null default false
);

GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can place orders"
  ON public.orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can place orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);