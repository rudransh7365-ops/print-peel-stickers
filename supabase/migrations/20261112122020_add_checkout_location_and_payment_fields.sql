/*
# Add checkout location and payment fields

1. Purpose
- Keeps checkout connected to the existing public `orders` table while adding the fields the current checkout flow records.
- Stores the optional Google Maps location link when a shopper grants location access, without requiring it for checkout.
- Stores the selected payment method and free-delivery status for order operations.

2. Modified table
- `public.orders`
- Add `google_maps_link` (text, optional through an empty-string default) for the shopper's captured map pin.
- Add `payment_method` (text, default `UPI`) for the selected checkout method.
- Add `is_free_delivery` (boolean, default false) for the existing delivery rule.

3. Security
- No new table or policy is created.
- Existing RLS remains enabled and existing order policies remain unchanged.
- These fields are written only as part of the existing order insert flow.

4. Safety notes
- The changes are additive and idempotent.
- No existing rows, columns, or order data are removed.
*/

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS google_maps_link text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'UPI',
  ADD COLUMN IF NOT EXISTS is_free_delivery boolean NOT NULL DEFAULT false;
