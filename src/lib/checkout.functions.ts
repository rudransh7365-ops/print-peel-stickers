import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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

export const verifyOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const totals = calculateVerifiedOrder(data.items, data.city);
    return { ...totals, orderId: data.orderId };
  });

export type OrderInsertRow = {
  order_id: string;
  customer_name: string;
  phone_no: string;
  email: string;
  address: string;
  google_maps_link: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  items: unknown;
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  notes: string;
  payment_method: string;
  is_free_delivery: boolean;
};

export function buildOrderInsertRow(
  data: z.infer<typeof schema>,
  totals: ReturnType<typeof calculateVerifiedOrder>,
): OrderInsertRow {
  return {
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
  };
}
