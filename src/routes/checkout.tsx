import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, FREE_DELIVERY_THRESHOLD } from "@/lib/config";
import { useStore, type CartItem } from "@/lib/store";
import { openWhatsApp } from "@/lib/whatsapp";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — PRINT&PEEL" },
      {
        name: "description",
        content: "Enter your delivery details and confirm your PRINT&PEEL order on WhatsApp.",
      },
      { property: "og:title", content: "Checkout — PRINT&PEEL" },
      { property: "og:description", content: "Confirm your order on WhatsApp." },
    ],
  }),
  component: CheckoutPage,
});

type Details = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
};

const EMPTY: Details = { name: "", phone: "", address: "", city: "", pincode: "", notes: "" };

function buildOrderMessage(cart: CartItem[], d: Details, subtotal: number, orderId: string) {
  const lines = cart.map(
    (i, n) =>
      `${n + 1}. ${i.name} — ${i.size} × ${i.qty} = ${formatPrice(i.price * i.qty)}` +
      (i.custom
        ? `\n   Shape: ${i.custom.shape}` +
          (i.custom.instructions ? `\n   Notes: ${i.custom.instructions}` : "") +
          `\n   Design file: ${i.custom.hasImage ? "will be attached in this chat" : "not uploaded"}`
        : ""),
  );
  const free = subtotal >= FREE_DELIVERY_THRESHOLD;
  return [
    `*PRINT&PEEL ORDER · ${orderId}*`,
    "",
    "*Items*",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery: ${free ? "FREE (order above ₹230)" : "Delivery charges apply"}`,
    "",
    "*Delivery details*",
    `Name: ${d.name}`,
    `Phone: ${d.phone}`,
    `Address: ${d.address}`,
    `City: ${d.city} - ${d.pincode}`,
    d.notes ? `Notes: ${d.notes}` : "",
    "",
    "Please confirm my order.",
  ]
    .filter(Boolean)
    .join("\n");
}

function CheckoutPage() {
  const { cart, subtotal, freeDelivery, clearCart, hydrated } = useStore();
  const [d, setD] = useState<Details>(EMPTY);
  const [order, setOrder] = useState<{ id: string; items: CartItem[]; total: number } | null>(null);

  const set = (k: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setD((prev) => ({ ...prev, [k]: e.target.value }));

  const field =
    "w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-bold outline-none focus:border-accent";

  const customImages = (order?.items ?? cart).filter((i) => i.custom?.imageDataUrl);

  if (order) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div id="receipt" className="border-4 border-ink bg-white p-6 hard-shadow">
          <h1 className="text-4xl">PRINT&amp;PEEL</h1>
          <p className="mb-6 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Order receipt · {order.id}
          </p>
          <ul className="mb-4 space-y-2 border-y-2 border-ink py-4 font-mono text-xs font-bold">
            {order.items.map((i) => (
              <li key={i.key} className="flex justify-between gap-4">
                <span>
                  {i.name} · {i.size} × {i.qty}
                </span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-display text-2xl uppercase">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="mt-4 font-mono text-[11px] font-bold">
            <p>{d.name}</p>
            <p>{d.phone}</p>
            <p>
              {d.address}, {d.city} - {d.pincode}
            </p>
          </div>
          <p className="mt-4 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Your order is confirmed on WhatsApp before printing.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="border-4 border-ink bg-neon-green px-5 py-3 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow press"
          >
            Print / save receipt
          </button>
          <Link
            to="/stickers"
            className="border-4 border-ink bg-white px-5 py-3 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow press"
          >
            Keep shopping
          </Link>
        </div>

        {customImages.length > 0 && (
          <div className="mt-6 border-4 border-ink bg-paper p-5">
            <p className="mb-3 text-sm font-bold">
              Download your custom design(s) and attach them in the WhatsApp chat:
            </p>
            <div className="flex flex-wrap gap-3">
              {customImages.map((i) => (
                <a
                  key={i.key}
                  href={i.custom!.imageDataUrl}
                  download={i.custom!.imageName ?? "custom-design"}
                  className="border-2 border-ink bg-white px-4 py-2 font-mono text-[10px] font-extrabold tracking-widest uppercase press"
                >
                  Download {i.custom!.imageName ?? "design"}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (hydrated && cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="mb-6 text-5xl">NOTHING TO CHECK OUT</h1>
        <Link
          to="/stickers"
          className="inline-block border-4 border-ink bg-accent px-6 py-3 font-mono text-[11px] font-extrabold tracking-widest uppercase text-accent-foreground hard-shadow press"
        >
          Shop stickers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="mb-10 text-6xl sm:text-7xl">CHECKOUT</h1>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const id = `PP-${Date.now().toString().slice(-6)}`;
            const message = buildOrderMessage(cart, d, subtotal, id);
            setOrder({ id, items: cart, total: subtotal });
            openWhatsApp(message);
            clearCart();
          }}
        >
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">
              Full name
            </span>
            <input required value={d.name} onChange={set("name")} className={field} />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">
              Phone number
            </span>
            <input
              required
              inputMode="tel"
              pattern="[0-9+\s-]{8,15}"
              value={d.phone}
              onChange={set("phone")}
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">
              Address
            </span>
            <textarea required rows={3} value={d.address} onChange={set("address")} className={field} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">
                City
              </span>
              <input required value={d.city} onChange={set("city")} className={field} />
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">
                Pincode
              </span>
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{4,8}"
                value={d.pincode}
                onChange={set("pincode")}
                className={field}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">
              Order notes (optional)
            </span>
            <textarea rows={2} value={d.notes} onChange={set("notes")} className={field} />
          </label>

          <button
            type="submit"
            className="w-full border-4 border-ink bg-accent px-6 py-5 font-display text-2xl text-accent-foreground uppercase hard-shadow press"
          >
            Place order on WhatsApp
          </button>
          <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
            Your order summary opens in WhatsApp so we can confirm it with you.
          </p>
        </form>

        <aside className="h-fit border-4 border-ink bg-paper p-6 hard-shadow lg:sticky lg:top-28">
          <h2 className="mb-5 text-3xl">Order summary</h2>
          <ul className="mb-4 space-y-2 font-mono text-xs font-bold">
            {cart.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span className="min-w-0">
                  {i.name} · {i.size} × {i.qty}
                </span>
                <span className="shrink-0">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t-2 border-ink pt-3 font-mono text-xs font-bold">
            <span>Delivery</span>
            <span className="text-right">
              {freeDelivery ? "FREE" : "Charges apply below ₹230"}
            </span>
          </div>
          <div className="mt-3 flex justify-between border-t-2 border-ink pt-3 font-display text-2xl uppercase">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
