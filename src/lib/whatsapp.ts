import { WHATSAPP_NUMBER } from "./config";
import type { CartItem, CustomerProfile } from "./store";
import { formatPrice } from "./config";

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export const enquiryMessage = (topic?: string) =>
  `Hi PRINT&PEEL, I have an enquiry about ${topic ?? "your stickers and self-adhesive posters"}.`;

export const complaintMessage = () => `Hi PRINT&PEEL, I need help with an order.`;

export function orderWhatsAppMessage(
  orderId: string,
  cart: CartItem[],
  customer: CustomerProfile,
  subtotal: number,
  delivery: number,
  total: number,
  mapsLink: string,
  paymentMethod: string,
  notes: string,
): string {
  const items = cart
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} — ${item.size} × ${item.qty} = ${formatPrice(item.price * item.qty)}`,
    )
    .join("\n");

  const lines = [
    `*PRINT&PEEL ORDER · ${orderId}*`,
    "",
    items,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery: ${delivery === 0 ? "FREE" : formatPrice(delivery)}`,
    `Total: ${formatPrice(total)}`,
    "",
    `*Customer details*`,
    `Name: ${customer.firstName} ${customer.lastName}`.trim(),
    `Phone: ${customer.phone}`,
    customer.email ? `Email: ${customer.email}` : "",
    `Address: ${customer.landmark ? `${customer.landmark}, ` : ""}${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}, ${customer.country}`,
    mapsLink ? `Map pin: ${mapsLink}` : "",
    "",
    `Payment: ${paymentMethod}`,
    notes ? `Notes: ${notes}` : "",
  ];

  return lines.filter(Boolean).join("\n");
}
