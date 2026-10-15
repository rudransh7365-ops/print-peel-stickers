import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CreditCard, MapPin, Search, ShieldCheck } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { autocompleteAddress, placeDetails, reverseGeocode, type ResolvedAddress } from "@/lib/maps.functions";
import { toast } from "sonner";
import { DELIVERY_FEE_STANDARD, formatPrice, deliveryFeeForCity } from "@/lib/config";
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
  const [gps, setGps] = useState<{ lat: number; lon: number } | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ placeId: string; text: string }[]>([]);
  const sessionRef = useRef("");
  const reqRef = useRef(0);
  const debounceRef = useRef<number | undefined>(undefined);
  const autocompleteFn = useServerFn(autocompleteAddress);
  const detailsFn = useServerFn(placeDetails);
  const reverseFn = useServerFn(reverseGeocode);
  useEffect(() => { if (profile) setDetails(profile); }, [profile]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const required: [string, string | undefined][] = [
      ["First name", details.firstName], ["Phone", details.phone], ["Email", details.email],
      ["Address", details.address], ["City", details.city], ["State", details.state], ["PIN code", details.pincode],
    ];
    const missing = required.filter(([, v]) => !String(v ?? "").trim()).map(([k]) => k);
    if (missing.length) { toast.error("Please fill in all details", { description: `Missing: ${missing.join(", ")}` }); return; }
    if (!/^\d{10}$/.test(String(details.phone).replace(/\D/g, "").slice(-10))) { toast.error("Please enter a valid 10-digit phone number"); return; }
    if (!/^\d{6}$/.test(String(details.pincode).trim())) { toast.error("Please enter a valid 6-digit PIN code"); return; }
    if (cart.length === 0) { toast.error("Your cart is empty"); return; }
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
    const mapsLink = gps ? `https://www.google.com/maps?q=${gps.lat},${gps.lon}` : "";
    const fullAddress = `${details.landmark ? `${details.landmark}, ` : ""}${details.address}${mapsLink ? ` | Exact location: ${mapsLink}` : ""}`;
    const fullOrder = {
      customer_name: fullName,
      phone_no: String(details.phone || ""),
      email: String(details.email || ""),
      address: fullAddress,
      city: String(details.city || ""),
      state: String(details.state || ""),
      pincode: String(details.pincode || ""),
      items: `Order ${next.id}: ${itemsSummary}${notes ? ` | Notes: ${notes}` : ""}`,
      total: Number(next.total) || 0,
    };
    try {
      const { error } = await supabase.from("print peel studio").insert(fullOrder);
      if (error) {
        console.error("Supabase insert error:", error);
        toast.error("Could not save your order", {
          description: `${error.message}${error.code ? ` (code ${error.code})` : ""}${error.hint ? ` — ${error.hint}` : ""}`,
          duration: 10000,
        });
        setSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Supabase insert error:", err);
      toast.error("Could not save your order", {
        description: err instanceof Error ? err.message : String(err),
        duration: 10000,
      });
      setSubmitting(false);
      return;
    }
    toast.success("Order placed successfully!", { description: `Order ID ${next.id}` });
    saveProfile(details);
    saveOrder(next);
    setOrder(next);
    clearCart();
    setSubmitting(false);
  };

  const city = details.city ?? "";
  const applyResolved = (r: ResolvedAddress) => {
    setGps({ lat: r.lat, lon: r.lon });
    setDetails((prev) => ({
      ...prev,
      address: r.address || prev.address,
      city: r.city || prev.city,
      state: r.state || prev.state,
      pincode: r.pincode || prev.pincode,
      country: "India",
    }));
  };
  const useCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error("Location is not supported on this device"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const r = await reverseFn({ data: { lat: coords.latitude, lon: coords.longitude } });
        applyResolved({ ...r, lat: coords.latitude, lon: coords.longitude });
        toast.success("Address filled from your location", { description: "Please add your house no. & landmark below." });
      } catch (err) {
        setGps({ lat: coords.latitude, lon: coords.longitude });
        toast.error("Could not look up your address", { description: err instanceof Error ? err.message : undefined });
      } finally { setLocating(false); }
    }, () => { setLocating(false); toast.error("Please allow location access to use this"); }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  };
  const onSearchInput = (value: string) => {
    setQuery(value);
    window.clearTimeout(debounceRef.current);
    if (value.trim().length < 2) { setSuggestions([]); return; }
    if (!sessionRef.current) sessionRef.current = crypto.randomUUID();
    const reqId = ++reqRef.current;
    debounceRef.current = window.setTimeout(async () => {
      try {
        const list = await autocompleteFn({ data: { input: value, sessionToken: sessionRef.current } });
        if (reqId === reqRef.current) setSuggestions(list);
      } catch (err) {
        if (reqId === reqRef.current) { setSuggestions([]); toast.error(err instanceof Error ? err.message : "Search failed"); }
      }
    }, 300);
  };
  const pickSuggestion = async (s: { placeId: string; text: string }) => {
    setSuggestions([]); setQuery(s.text); setLocating(true);
    try {
      const r = await detailsFn({ data: { placeId: s.placeId, sessionToken: sessionRef.current } });
      applyResolved(r);
      toast.success("Address filled", { description: "Please add your house no. & landmark below." });
    } catch (err) {
      toast.error("Could not load this address", { description: err instanceof Error ? err.message : undefined });
    } finally { sessionRef.current = ""; setLocating(false); }
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
        <div className="mt-4 font-mono text-[11px] font-bold"><p>{order.customer.firstName} {order.customer.lastName}</p><p>{order.customer.phone}</p><p>{order.customer.email}</p><p>{order.customer.landmark ? `${order.customer.landmark}, ` : ""}{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}, {order.customer.country}</p></div>
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
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); void handleSubmit(e); }}>
        {(Object.keys(EMPTY) as Array<keyof CustomerProfile>).map((key) => (
          <Fragment key={key}>
            {key === "address" && (
              <div className="grid gap-3 sm:col-span-2">
                <button type="button" onClick={useCurrentLocation} disabled={locating} className="flex w-full items-center justify-center gap-3 border-4 border-ink bg-neon-green px-5 py-4 text-center font-mono text-xs font-extrabold tracking-widest uppercase hard-shadow press disabled:opacity-60">
                  <MapPin className="size-5 shrink-0" aria-hidden="true" />
                  <span>{locating ? "Finding your location…" : "Use my current location"}</span>
                </button>
                <label className="relative block">
                  <span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">Or search your colony / area in Gwalior</span>
                  <span className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden="true" />
                    <input type="text" value={query} onChange={(e) => onSearchInput(e.target.value)} placeholder="e.g. Amarkantak Colony" autoComplete="off" className={`${field} pl-9`} />
                  </span>
                  {suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full border-4 border-ink bg-white hard-shadow-sm">
                      {suggestions.map((s) => (
                        <li key={s.placeId}><button type="button" onClick={() => void pickSuggestion(s)} className="block w-full px-4 py-3 text-left text-sm font-bold hover:bg-paper">{s.text}</button></li>
                      ))}
                    </ul>
                  )}
                </label>
                {gps && <p className="font-mono text-[10px] font-extrabold tracking-widest uppercase text-muted-foreground">Exact pin saved: {gps.lat.toFixed(5)}, {gps.lon.toFixed(5)}</p>}
              </div>
            )}
            <label className={key === "address" || key === "landmark" ? "sm:col-span-2" : ""}><span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">{key === "landmark" ? "House / flat no. & landmark (so we reach your exact house)" : key.replace(/([A-Z])/g, " $1")}</span><input required={key !== "email"} type={key === "email" ? "email" : "text"} inputMode={key === "phone" ? "tel" : key === "pincode" ? "numeric" : undefined} placeholder={key === "landmark" ? "e.g. H.No. 42, near City Mall, Thatipur" : undefined} value={details[key]} onChange={(event) => setDetails((prev) => ({ ...prev, [key]: event.target.value }))} className={field} /></label>
          </Fragment>
        ))}
        <label className="sm:col-span-2"><span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">Order notes (optional)</span><textarea rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} className={field} /></label>
        <button type="submit" disabled={submitting} className="w-full border-4 border-ink bg-accent px-6 py-5 font-display text-2xl text-accent-foreground uppercase hard-shadow press sm:col-span-2 disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? "Placing order…" : "Place order"}</button>
      </form>
      <aside className="h-fit border-4 border-ink bg-paper p-6 hard-shadow lg:sticky lg:top-28"><h2 className="mb-5 text-3xl">Order summary</h2><ul className="mb-4 space-y-2 font-mono text-xs font-bold">{cart.map((item) => <li key={item.key} className="flex justify-between gap-3"><span>{item.name} · {item.size} × {item.qty}</span><span>{formatPrice(item.price * item.qty)}</span></li>)}</ul><div className="space-y-2 border-t-2 border-ink pt-3 font-mono text-xs font-bold"><p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></p><p className="flex justify-between"><span>Delivery</span><span>{freeDelivery ? "FREE" : formatPrice(delivery)}</span></p><p className="flex justify-between"><span>Tax</span><span>{formatPrice(0)}</span></p></div><div className="mt-3 flex justify-between border-t-2 border-ink pt-3 font-display text-2xl uppercase"><span>Total</span><span>{formatPrice(total)}</span></div></aside>
    </div></div>
  );
}
