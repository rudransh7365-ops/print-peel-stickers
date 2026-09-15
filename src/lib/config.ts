/**
 * PRINT&PEEL site configuration.
 * The WhatsApp destination lives here only — it is never rendered on the site.
 * Replace the digits below with your number in international format (no + / spaces).
 */
export const WHATSAPP_NUMBER = "910000000000";

export const BRAND = {
  name: "PRINT&PEEL",
  tagline: "Print it. Peel it. Make it yours.",
};

/** Free delivery threshold in ₹ — change here and the whole site follows. */
export const FREE_DELIVERY_THRESHOLD = 230;

export const CURRENCY = "₹";

export const formatPrice = (n: number) => `${CURRENCY}${n}`;
