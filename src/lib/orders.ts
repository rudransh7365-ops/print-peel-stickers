import type { OrderRecord } from "./store";
import { formatPrice } from "./config";

export const formatOrderDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(date),
  );

export function orderText(order: OrderRecord) {
  const items = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} — ${item.size} × ${item.qty} = ${formatPrice(item.price * item.qty)}`,
    )
    .join("\n");
  return [
    `PRINT&PEEL ORDER · ${order.id}`,
    `Date: ${formatOrderDate(order.date)}`,
    "",
    items,
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Delivery: ${order.delivery === 0 ? "FREE" : formatPrice(order.delivery)}`,
    `Tax: ${formatPrice(order.tax)}`,
    `Total: ${formatPrice(order.total)}`,
    "",
    `${order.customer.firstName} ${order.customer.lastName}`.trim(),
    order.customer.phone,
    order.customer.email,
    `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
    order.customer.country,
  ]
    .filter(Boolean)
    .join("\n");
}

export function receiptHtml(order: OrderRecord) {
  const escape = (value: string) =>
    value.replace(/[&<>'"]/g, (character) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      };
      return entities[character] ?? character;
    });
  const rows = order.items
    .map(
      (item) =>
        `<tr><td>${escape(item.name)}<small>${escape(item.size)} × ${item.qty}</small></td><td>${formatPrice(item.price * item.qty)}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escape(order.id)} receipt</title><style>body{font-family:Arial,sans-serif;max-width:680px;margin:40px auto;padding:24px;color:#111}h1{font-size:36px;margin:0}p{line-height:1.5}table{width:100%;border-collapse:collapse;margin:24px 0}td{padding:12px 0;border-bottom:1px solid #111}td:last-child{text-align:right;font-weight:700}small{display:block;color:#666;margin-top:4px}.total{font-size:22px;font-weight:800;display:flex;justify-content:space-between}.meta{color:#555}</style></head><body><h1>PRINT&amp;PEEL</h1><p class="meta">Order ${escape(order.id)}<br>Date: ${escape(formatOrderDate(order.date))}</p><table>${rows}</table><p>Subtotal: ${formatPrice(order.subtotal)}<br>Delivery: ${order.delivery === 0 ? "FREE" : formatPrice(order.delivery)}<br>Tax: ${formatPrice(order.tax)}</p><p class="total"><span>Total</span><span>${formatPrice(order.total)}</span></p><p>${escape(`${order.customer.firstName} ${order.customer.lastName}`.trim())}<br>${escape(order.customer.phone)}<br>${escape(order.customer.address)}, ${escape(order.customer.city)}, ${escape(order.customer.state)} - ${escape(order.customer.pincode)}<br>${escape(order.customer.country)}</p><script>window.addEventListener('load',()=>window.print())</script></body></html>`;
}

export function downloadReceipt(order: OrderRecord) {
  const blob = new Blob([receiptHtml(order)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${order.id}-receipt.html`;
  link.click();
  URL.revokeObjectURL(url);
}

export function printReceipt(order: OrderRecord) {
  const popup = window.open("", "_blank", "noopener,noreferrer");
  if (!popup) return;
  popup.document.write(receiptHtml(order));
  popup.document.close();
}