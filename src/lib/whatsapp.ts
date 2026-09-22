import { WHATSAPP_NUMBER } from "./config";

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export const enquiryMessage = (topic?: string) =>
  `Hi PRINT&PEEL, I have an enquiry about ${topic ?? "your stickers and self-adhesive posters"}.`;

export const complaintMessage = () =>
  `Hi PRINT&PEEL, I need help with an order.`;
