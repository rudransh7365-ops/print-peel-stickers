import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { PRODUCTS } from "@/data/products";
import type { Database } from "@/integrations/supabase/types";
import { DELIVERY_FEE_STANDARD, FREE_DELIVERY_THRESHOLD, deliveryFeeForCity } from "@/lib/config";
import { canonicalizeOrderItems } from "@/lib/diwali-offer";

const itemSchema = z.object({
  key: z.string().max(120).optional(),
  productId: z.string().min(1).max(160),
  name: z.string().max(200),
  image: z.string().max(2000).optional(),
  size: z.string().min(1).max(80),
  qty: z.number().int().min(1).max(99),
  freePosterGiftFor: z.number().int().min(0).max(99).optional(),
}).strict();

const checkoutSchema = z.object({
  orderId: z.string().regex(/^PP-[A-Z0-9-]{4,40}$/),
  items: z.array(itemSchema).min(1).max(200),
  customerName: z.string().trim().min(1).max(160),
  phone: z.string().trim().min(10).max(24),
  email: z.string().trim().email().max(255),
  address: z.string().trim().min(1).max(300),
  googleMapsLink: z.string().url().max(1000).refine((value) => {
    try {
      return new URL(value).hostname === "www.google.com" && new URL(value).pathname.startsWith("/maps");
    } catch {
      return false;
    }
  }, "Please capture your Google Maps location again."),
  city: z.string().trim().min(1).max(120),
  state: z.string().trim().min(1).max(120),
  pincode: z.string().trim().regex(/^\d{6}$/),
  paymentMethod: z.enum(["UPI", "Card", "Net banking"]),
  notes: z.string().max(1000),
});

export const placeDiwaliOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data }) => {
    const digits = data.phone.replace(/\D/g, "");
    if (digits.length < 10) throw new Error("Please enter a valid 10-digit phone number.");

    const catalog = PRODUCTS.map(({ id, name, category, sizes, images }) => ({ id, name, category, sizes, images }));
    const items = canonicalizeOrderItems(data.items, catalog);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryFeeForCity(data.city) || DELIVERY_FEE_STANDARD;
    const total = subtotal + delivery;

    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Order service is not available. Please try again shortly.");

    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const orderItems = items.map((item) => ({
      ...item,
      key: item.key ?? (item.freePosterGiftFor === undefined ? `${item.productId}-${item.size}` : `free-poster-${item.freePosterGiftFor}`),
    }));
    const itemRecord = JSON.stringify({ order_id: data.orderId, items: orderItems, notes: data.notes });
    const { error } = await supabase.from("orders").insert({
      customer_name: data.customerName,
      phone_no: digits.slice(-10),
      email: data.email,
      address: data.address,
      google_maps_link: data.googleMapsLink,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      items: itemRecord,
      subtotal,
      delivery_charge: delivery,
      total,
      payment_method: data.paymentMethod,
      is_free_delivery: delivery === 0,
    });
    if (error) {
      console.error("Guest order insert failed:", error.message, error.code);
      throw new Error("Could not save your order. Please try again.");
    }

    return { orderId: data.orderId, items: orderItems, subtotal, delivery, total };
  });