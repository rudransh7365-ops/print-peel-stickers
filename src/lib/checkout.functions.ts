import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { calculateVerifiedOrder } from "@/lib/checkout-rules";

const schema = z.object({
  orderId: z.string().regex(/^PP-\d{6}$/),
  items: z
    .array(
      z
        .object({
          key: z.string().max(200).optional(),
          productId: z.string().min(1).max(160),
          size: z.string().min(1).max(80),
          qty: z.number().int().min(1).max(99),
        })
        .strict(),
    )
    .min(1)
    .max(100),
  customerName: z.string().trim().min(1).max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d()\s-]{10,24}$/),
  email: z.string().trim().email().max(255),
  address: z.string().trim().min(1).max(500),
  googleMapsLink: z
    .string()
    .url()
    .max(1000)
    .refine((value) => {
      try {
        const url = new URL(value);
        return (
          url.protocol === "https:" &&
          url.hostname === "www.google.com" &&
          url.pathname.startsWith("/maps")
        );
      } catch {
        return false;
      }
    }, "Invalid map link.")
    .or(z.literal("")),
  city: z.string().trim().min(1).max(120),
  state: z.string().trim().min(1).max(120),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/),
  paymentMethod: z.enum(["UPI", "Card", "Net banking"]),
  notes: z.string().max(1000),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const totals = calculateVerifiedOrder(data.items, data.city);
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (url && key) {
      const supabase = createClient<Database>(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (input, init) => {
            const headers = new Headers(init?.headers);
            if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
              headers.delete("Authorization");
            headers.set("apikey", key);
            return fetch(input, { ...init, headers });
          },
        },
      });

      const { error } = await supabase.from("orders").insert({
        order_id: data.orderId,
        customer_name: data.customerName,
        phone_no: data.phone.replace(/\D/g, "").slice(-10),
        email: data.email,
        address: data.address,
        google_maps_link: data.googleMapsLink,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: "India",
        items: { order_id: data.orderId, items: totals.items, notes: data.notes },
        subtotal: totals.subtotal,
        delivery: totals.delivery,
        tax: 0,
        total: totals.total,
        notes: `${data.paymentMethod}${data.notes ? ` — ${data.notes}` : ""}`,
        payment_method: data.paymentMethod,
        is_free_delivery: totals.delivery === 0,
      });
      if (error) {
        console.error("Guest order insert failed:", error.message, error.code);
        throw new Error("Could not save your order. Please try again.");
      }
    } else {
      console.warn("Supabase env vars not set — order saved to device only.");
    }
    return { ...totals, orderId: data.orderId };
  });
