/**
 * PRINT&PEEL site configuration.
 * The WhatsApp destination lives here only — it is never rendered on the site.
 * Replace the digits below with your number in international format (no + / spaces).
 */
export const WHATSAPP_NUMBER = "918517022565";

export const BRAND = {
  name: "PRINT&PEEL",
  tagline: "Print it. Peel it. Make it yours.",
};

/** Free delivery threshold in ₹ — change here and the whole site follows. */
export const FREE_DELIVERY_THRESHOLD = 180;
export const DELIVERY_FEE_LOCAL = 50;
export const DELIVERY_FEE_STANDARD = 90;

export const CURRENCY = "₹";

export const formatPrice = (n: number) => `${CURRENCY}${n}`;

/** Returns the delivery fee based on the customer's city. */
export function deliveryFeeForCity(city: string): number {
  const lower = city.trim().toLowerCase();
  if (lower.includes("gwl") || lower.includes("gwalior")) return DELIVERY_FEE_LOCAL;
  return DELIVERY_FEE_STANDARD;
}
