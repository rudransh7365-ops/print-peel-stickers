import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DELIVERY_FEE_STANDARD, formatPrice, deliveryFeeForCity } from "@/lib/config";
import { downloadReceipt, formatOrderDate, orderText, printReceipt } from "@/lib/orders";
import { useStore, type CustomerProfile, type OrderRecord } from "@/lib/store";
import { openWhatsApp } from "@/lib/whatsapp";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Checkout — PRINT&PEEL" },
    { name: "description", content: "Enter your delivery details and confirm your PRINT&PEEL order on WhatsApp." },
    { property: "og:title", content: "Checkout — PRINT&PEEL" },
    { property: "og:description", content: "Confirm your order on WhatsApp." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CheckoutPage,
});

const EMPTY: CustomerProfile = { firstName: "", lastName: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", country: "India" };

function CheckoutPage() {
  const { cart, subtotal, freeDelivery, clearCart, hydrated, profile, saveProfile, saveOrder } = useStore();
  const [details, setDetails] = useState<CustomerProfile>(EMPTY);
  const [notes, setNotes] = useState("");
  const [order, setOrder] = useState<OrderRecord | null>(null);
  useEffect(() => { if (profile) setDetails(profile); }, [profile]);
  const city = details.city ?? "";
  const baseDelivery = city ? deliveryFeeForCity(city) : DELIVERY_FEE_STANDARD;
  const delivery = freeDelivery ? 0 : baseDelivery;
  const total = subtotal + delivery;
  const field = "w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-bold outline-none focus:border-accent";
  const customImages = (order?.items ?? cart).filter((item) => item.custom?.imageDataUrl);

  if (order) return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="border-4 border-ink bg-white p-6 hard-shadow">
        <h1 className="text-4xl">PRINT&amp;PEEL</h1>
        <p className="mb-6 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Order receipt · {order.id}<br />Date: {formatOrderDate(order.date)}</p>
        <ul className="mb-4 space-y-2 border-y-2 border-ink py-4 font-mono text-xs font-bold">{order.items.map((item) => <li key={item.key} className="flex justify-between gap-4"><span>{item.name} · {item.size} × {item.qty}</span><span>{formatPrice(item.price * item.qty)}</span></li>)}</ul>
        <div className="space-y-1 font-mono text-xs font-bold"><p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></p><p className="flex justify-between"><span>Delivery</span><span>{order.delivery ? formatPrice(order.delivery) : "FREE"}</span></p><p className="flex justify-between"><span>Tax</span><span>{formatPrice(order.tax)}</span></p></div>
        <div className="mt-4 flex justify-between border-t-2 border-ink pt-4 font-display text-2xl uppercase"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        <div className="mt-4 font-mono text-[11px] font-bold"><p>{order.customer.firstName} {order.customer.lastName}</p><p>{order.customer.phone}</p><p>{order.customer.email}</p><p>{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}, {order.customer.country}</p></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => printReceipt(order)} className="border-4 border-ink bg-neon-green px-5 py-3 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow press">Print receipt</button><button type="button" onClick={() => downloadReceipt(order)} className="border-4 border-ink bg-white px-5 py-3 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow press">Download receipt</button><Link to="/orders" className="border-4 border-ink bg-white px-5 py-3 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow press">View orders</Link></div>
      {customImages.length > 0 && <div className="mt-6 border-4 border-ink bg-paper p-5"><p className="mb-3 text-sm font-bold">Download custom designs and attach them in WhatsApp:</p><div className="flex flex-wrap gap-3">{customImages.map((item) => { const custom = item.custom; if (!custom?.imageDataUrl) return null; return <a key={item.key} href={custom.imageDataUrl} download={custom.imageName ?? "custom-design"} className="border-2 border-ink bg-white px-4 py-2 font-mono text-[10px] font-extrabold tracking-widest uppercase press">Download {custom.imageName ?? "design"}</a>; })}</div></div>}
    </div>
  );

  if (hydrated && cart.length === 0) return <div className="mx-auto max-w-2xl px-5 py-20 text-center"><h1 className="mb-6 text-5xl">NOTHING TO CHECK OUT</h1><Link to="/stickers" className="inline-block border-4 border-ink bg-accent px-6 py-3 font-display text-xl uppercase hard-shadow press">Shop stickers</Link></div>;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12"><h1 className="mb-10 text-6xl sm:text-7xl">CHECKOUT</h1><div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); const next: OrderRecord = { id: `PP-${Date.now().toString().slice(-6)}`, date: new Date().toISOString(), items: cart.map((item) => ({ ...item })), customer: details, subtotal, delivery, tax: 0, total }; saveProfile(details); saveOrder(next); setOrder(next); openWhatsApp(`${orderText(next)}${notes ? `\nNotes: ${notes}` : ""}\n\nPlease confirm my order.`); clearCart(); }}>
        {(Object.keys(EMPTY) as Array<keyof CustomerProfile>).map((key) => <label key={key} className={key === "address" ? "sm:col-span-2" : ""}><span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">{key.replace(/([A-Z])/g, " $1")}</span><input required={key !== "email"} type={key === "email" ? "email" : "text"} inputMode={key === "phone" ? "tel" : key === "pincode" ? "numeric" : undefined} value={details[key]} onChange={(event) => setDetails((prev) => ({ ...prev, [key]: event.target.value }))} className={field} /></label>)}
        <label className="sm:col-span-2"><span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">Order notes (optional)</span><textarea rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} className={field} /></label>
        <button type="submit" className="w-full border-4 border-ink bg-accent px-6 py-5 font-display text-2xl text-accent-foreground uppercase hard-shadow press sm:col-span-2">Place order on WhatsApp</button>
      </form>
      <aside className="h-fit border-4 border-ink bg-paper p-6 hard-shadow lg:sticky lg:top-28"><h2 className="mb-5 text-3xl">Order summary</h2><ul className="mb-4 space-y-2 font-mono text-xs font-bold">{cart.map((item) => <li key={item.key} className="flex justify-between gap-3"><span>{item.name} · {item.size} × {item.qty}</span><span>{formatPrice(item.price * item.qty)}</span></li>)}</ul><div className="space-y-2 border-t-2 border-ink pt-3 font-mono text-xs font-bold"><p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></p><p className="flex justify-between"><span>Delivery</span><span>{freeDelivery ? "FREE" : formatPrice(delivery)}</span></p><p className="flex justify-between"><span>Tax</span><span>{formatPrice(0)}</span></p></div><div className="mt-3 flex justify-between border-t-2 border-ink pt-3 font-display text-2xl uppercase"><span>Total</span><span>{formatPrice(total)}</span></div></aside>
    </div></div>
  );
}