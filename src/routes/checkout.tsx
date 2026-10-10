import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { DELIVERY_FEE_STANDARD, formatPrice, deliveryFeeForCity, isServiceableCity } from "@/lib/config";
import { downloadReceipt, formatOrderDate, printReceipt } from "@/lib/orders";
import { supabase } from "@/lib/supabase";
import { useStore, type CustomerProfile, type OrderRecord } from "@/lib/store";
import ronaldoManUtdImg from "@/assets/ronaldo.png";
import wastedImg from "@/assets/wasted.png";
import fetsLuckImg from "@/assets/fets_luck.png";
import shitJustGotRealImg from "@/assets/shit_just_got_real.png";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Checkout — PRINT&PEEL" },
    { name: "description", content: "Enter your delivery details and place your PRINT&PEEL order." },
    { property: "og:title", content: "Checkout — PRINT&PEEL" },
    { property: "og:description", content: "Place your order securely with PRINT&PEEL." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CheckoutPage,
});

const EMPTY: CustomerProfile = { firstName: "", lastName: "", phone: "", email: "", address: "", landmark: "", city: "", state: "", pincode: "", country: "India" };

const CHECKOUT_DESIGNS = [
  { src: ronaldoManUtdImg, alt: "Ronaldo Man Utd sticker design" },
  { src: wastedImg, alt: "Wasted GTA sticker design" },
  { src: fetsLuckImg, alt: "Fet's Luck sticker design" },
  { src: shitJustGotRealImg, alt: "Shit Just Got Real maths sticker design" },
];

function CheckoutPage() {
  const { cart, subtotal, freeDelivery, clearCart, hydrated, profile, saveProfile, saveOrder } = useStore();
  const [details, setDetails] = useState<CustomerProfile>(EMPTY);
  const [notes, setNotes] = useState("");
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  useEffect(() => { if (profile) setDetails(profile); }, [profile]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: OrderRecord = {
      id: `PP-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: cart.map((item) => ({ ...item })),
      customer: details,
      subtotal,
      delivery,
      tax: 0,
      total,
    };
    setSubmitting(true);
    const itemsSummary = next.items
      .map((item) => `${item.name} (${item.size}) x${item.qty}`)
      .join(", ");
    const fullName = `${details.firstName} ${details.lastName}`.trim();
    const fullOrder = {
      customer_name: fullName,
      phone_no: String(details.phone || ""),
      email: String(details.email || ""),
      address: String(details.address || ""),
      city: String(details.city || ""),
      state: String(details.state || ""),
      pin_code: String(details.pincode || ""),
      items: `Order ${next.id}: ${itemsSummary}${notes ? ` | Notes: ${notes}` : ""}`,
      total: next.total,
    };
    // Retry with only the columns the online table currently has, so an order is never lost.
    const legacyOrder = {
      customer_name: fullName,
      address: String(details.address || ""),
      city: String(details.city || ""),
      state: String(details.state || ""),
      pin_code: String(details.pincode || ""),
    };
    let { error } = await supabase.from("print peel studio").insert(fullOrder);
    if (error) {
      console.error("Supabase insert error:", error);
      const retry = await supabase.from("print peel studio").insert(legacyOrder);
      if (retry.error) console.error("Supabase insert error (fallback):", retry.error);
      error = retry.error;
    }
    if (error) {
      toast.error("Order saved on this device only", {
        description: "The online order store is unreachable — your order is still placed and saved in your order history.",
      });
    } else {
      toast.success("Order placed successfully!");
    }
    saveProfile(details);
    saveOrder(next);
    setOrder(next);
    clearCart();
    setSubmitting(false);
  };

  const city = details.city ?? "";
  const serviceable = !city.trim() || isServiceableCity(city);
  const useCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error("Location is not supported on this device"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`, { headers: { "Accept-Language": "en" } });
        const data = await res.json();
        const a = data.address ?? {};
        const street = [a.house_number, a.road, a.neighbourhood ?? a.suburb].filter(Boolean).join(", ");
        setDetails((prev) => ({
          ...prev,
          address: street || data.display_name || prev.address,
          city: a.city ?? a.town ?? a.village ?? a.county ?? prev.city,
          state: a.state ?? prev.state,
          pincode: a.postcode ?? prev.pincode,
          country: a.country ?? prev.country,
        }));
        toast.success("Address filled from your location");
      } catch {
        toast.error("Could not look up your address");
      } finally { setLocating(false); }
    }, () => { setLocating(false); toast.error("Please allow location access to use this"); }, { enableHighAccuracy: true, timeout: 15000 });
  };
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
      {customImages.length > 0 && <div className="mt-6 border-4 border-ink bg-paper p-5"><p className="mb-3 text-sm font-bold">Download your custom designs:</p><div className="flex flex-wrap gap-3">{customImages.map((item) => { const custom = item.custom; if (!custom?.imageDataUrl) return null; return <a key={item.key} href={custom.imageDataUrl} download={custom.imageName ?? "custom-design"} className="border-2 border-ink bg-white px-4 py-2 font-mono text-[10px] font-extrabold tracking-widest uppercase press">Download {custom.imageName ?? "design"}</a>; })}</div></div>}
    </div>
  );

  if (hydrated && cart.length === 0) return <div className="mx-auto max-w-2xl px-5 py-20 text-center"><h1 className="mb-6 text-5xl">NOTHING TO CHECK OUT</h1><Link to="/stickers" className="inline-block border-4 border-ink bg-accent px-6 py-3 font-display text-xl uppercase hard-shadow press">Shop stickers</Link></div>;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="mb-10 text-6xl sm:text-7xl">CHECKOUT</h1>
      <section className="mb-10 border-4 border-ink bg-neon-green p-5 hard-shadow" aria-labelledby="payment-title">
        <div className="flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center border-2 border-ink bg-white">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h2 id="payment-title" className="mb-2 text-2xl uppercase">Online payment only</h2>
            <p className="max-w-2xl text-sm font-bold leading-relaxed">
              We accept online payments only so every order stays simple and trackable. Place your order with confidence — we will confirm your details and share secure payment instructions before processing it.
            </p>
            <p className="mt-3 flex items-center gap-2 font-mono text-[10px] font-extrabold tracking-widest uppercase">
              <CreditCard className="size-4" aria-hidden="true" /> Safe checkout · Personal support · No cash on delivery
            </p>
          </div>
        </div>
      </section>
      <section className="mb-10" aria-labelledby="designs-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">Made to stick</p>
            <h2 id="designs-title" className="text-3xl uppercase">Fresh designs</h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs font-bold text-muted-foreground sm:block">A few customer favourites from the PRINT&amp;PEEL wall.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CHECKOUT_DESIGNS.map((design) => (
            <div key={design.src} className="aspect-square overflow-hidden border-4 border-ink bg-white hard-shadow-sm">
              <img src={design.src} alt={design.alt} loading="lazy" className="h-full w-full object-contain p-2" />
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { if (!serviceable) { e.preventDefault(); return; } void handleSubmit(e); }}>
        {(Object.keys(EMPTY) as Array<keyof CustomerProfile>).map((key) => (
          <Fragment key={key}>
            {key === "address" && (
              <button type="button" onClick={useCurrentLocation} disabled={locating} className="flex w-full items-center justify-center gap-3 border-4 border-ink bg-neon-green px-5 py-4 text-center font-mono text-xs font-extrabold tracking-widest uppercase hard-shadow press sm:col-span-2 disabled:opacity-60">
                <MapPin className="size-5 shrink-0" aria-hidden="true" />
                <span>{locating ? "Finding your location…" : "Use my current location"}</span>
              </button>
            )}
            <label className={key === "address" ? "sm:col-span-2" : ""}><span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">{key.replace(/([A-Z])/g, " $1")}</span><input required={key !== "email"} type={key === "email" ? "email" : "text"} inputMode={key === "phone" ? "tel" : key === "pincode" ? "numeric" : undefined} value={details[key]} onChange={(event) => setDetails((prev) => ({ ...prev, [key]: event.target.value }))} className={field} />{key === "city" && !serviceable && <span className="mt-2 block text-xs font-bold text-destructive">We are not servicing in this area yet — we will soon be available in your area!</span>}</label>
          </Fragment>
        ))}
        <label className="sm:col-span-2"><span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">Order notes (optional)</span><textarea rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} className={field} /></label>
        {serviceable ? (
          <button type="submit" disabled={submitting} className="w-full border-4 border-ink bg-accent px-6 py-5 font-display text-2xl text-accent-foreground uppercase hard-shadow press sm:col-span-2 disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? "Placing order…" : "Place order"}</button>
        ) : (
          <div role="alert" className="w-full border-4 border-ink bg-paper px-6 py-5 text-center sm:col-span-2"><p className="font-display text-2xl uppercase">Not servicing in this area</p><p className="mt-1 text-sm font-bold">We currently deliver only in Gwalior. We will soon be available in your area!</p></div>
        )}
      </form>
      <aside className="h-fit border-4 border-ink bg-paper p-6 hard-shadow lg:sticky lg:top-28"><h2 className="mb-5 text-3xl">Order summary</h2><ul className="mb-4 space-y-2 font-mono text-xs font-bold">{cart.map((item) => <li key={item.key} className="flex justify-between gap-3"><span>{item.name} · {item.size} × {item.qty}</span><span>{formatPrice(item.price * item.qty)}</span></li>)}</ul><div className="space-y-2 border-t-2 border-ink pt-3 font-mono text-xs font-bold"><p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></p><p className="flex justify-between"><span>Delivery</span><span>{freeDelivery ? "FREE" : formatPrice(delivery)}</span></p><p className="flex justify-between"><span>Tax</span><span>{formatPrice(0)}</span></p></div><div className="mt-3 flex justify-between border-t-2 border-ink pt-3 font-display text-2xl uppercase"><span>Total</span><span>{formatPrice(total)}</span></div></aside>
    </div></div>
  );
}