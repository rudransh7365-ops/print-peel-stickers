import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/config";
import { useStore } from "@/lib/store";
import { DeliveryProgress } from "@/components/DeliveryProgress";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — PRINT&PEEL" },
      { name: "description", content: "Review your stickers and posters before checkout." },
      { property: "og:title", content: "Your Cart — PRINT&PEEL" },
      { property: "og:description", content: "Review your stickers and posters before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, removeFromCart, clearCart, subtotal, freeDelivery, hydrated } = useStore();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="mb-10 text-6xl sm:text-7xl">YOUR CART</h1>

      {!hydrated ? null : cart.length === 0 ? (
        <div className="border-4 border-ink bg-paper p-10 text-center">
          <p className="mb-6 font-bold">Your cart is empty.</p>
          <Link
            to="/stickers"
            className="inline-block border-4 border-ink bg-accent px-6 py-3 font-mono text-[11px] font-extrabold tracking-widest uppercase text-accent-foreground hard-shadow press"
          >
            Shop stickers
          </Link>
        </div>
      ) : (
        <>
          <ul className="mb-8 space-y-4">
            {cart.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-4 border-4 border-ink bg-white p-3 hard-shadow"
              >
                <div className="grid size-20 shrink-0 place-items-center border-2 border-ink bg-paper p-1">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="font-mono text-[8px] tracking-widest uppercase">Custom</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg">{item.name}</h2>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    {item.size}
                    {item.custom && ` · ${item.custom.shape}`}
                  </p>
                  {item.custom?.instructions && (
                    <p className="mt-1 text-[11px] font-bold">{item.custom.instructions}</p>
                  )}
                  <p className="mt-1 font-mono text-sm font-extrabold">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex items-center border-2 border-ink">
                    <button
                      type="button"
                      onClick={() => setQty(item.key, item.qty - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="grid size-8 place-items-center border-r-2 border-ink"
                    >
                      <Minus className="size-3" aria-hidden="true" />
                    </button>
                    <span className="w-9 text-center font-mono text-sm font-extrabold">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(item.key, item.qty + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="grid size-8 place-items-center border-l-2 border-ink"
                    >
                      <Plus className="size-3" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.key)}
                    aria-label={`Remove ${item.name}`}
                    className="grid size-8 place-items-center border-2 border-ink bg-white"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mb-8">
            <DeliveryProgress />
          </div>

          <div className="border-4 border-ink bg-paper p-6 hard-shadow">
            <div className="mb-2 flex justify-between font-mono text-sm font-extrabold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="mb-4 flex justify-between gap-4 font-mono text-xs font-bold text-muted-foreground">
              <span>Delivery</span>
              <span className="text-right">
                {freeDelivery ? "FREE" : "Delivery charges apply below ₹230"}
              </span>
            </div>
            <div className="mb-6 flex justify-between border-t-2 border-ink pt-4 font-display text-2xl uppercase">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/checkout"
                className="flex-1 border-4 border-ink bg-accent px-6 py-4 text-center font-display text-xl text-accent-foreground uppercase hard-shadow press"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="border-4 border-ink bg-white px-6 py-4 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow press"
              >
                Clear cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
