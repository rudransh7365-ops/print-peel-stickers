import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Download, Eye, Printer, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/config";
import { downloadReceipt, formatOrderDate, orderText, printReceipt } from "@/lib/orders";
import { useStore, type OrderRecord } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — PRINT&PEEL" },
      { name: "description", content: "View, download and reorder your saved PRINT&PEEL orders." },
      { property: "og:title", content: "Your Orders — PRINT&PEEL" },
      { property: "og:description", content: "View, download and reorder your saved orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders, reorder, hydrated } = useStore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const categories = orders.flatMap((order) => order.items.map((item) => PRODUCTS.find((product) => product.id === item.productId)?.category).filter(Boolean));
  const favorite = categories.length ? [...new Set(categories)].sort((a, b) => categories.filter((category) => category === b).length - categories.filter((category) => category === a).length)[0] : null;

  const action = "grid size-10 place-items-center border-2 border-ink bg-white hard-shadow-sm press";
  const copy = async (order: OrderRecord) => { await navigator.clipboard.writeText(orderText(order)); toast.success("Order details copied"); };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">Saved on this device</p>
      <h1 className="mb-8 text-6xl sm:text-7xl">YOUR ORDERS</h1>
      {hydrated && orders.length > 0 && (
        <dl className="mb-10 grid grid-cols-2 border-4 border-ink bg-paper sm:grid-cols-4">
          {[['Total orders', String(orders.length)], ['Total spent', formatPrice(totalSpent)], ['Favorite', favorite ?? '—'], ['Latest', formatOrderDate(orders[0]?.date ?? new Date().toISOString())]].map(([label, value]) => (
            <div key={label} className="border-ink p-4 odd:border-r-2 sm:border-r-2 sm:last:border-r-0"><dt className="font-mono text-[9px] font-extrabold tracking-widest uppercase text-muted-foreground">{label}</dt><dd className="mt-1 text-lg font-extrabold capitalize">{value}</dd></div>
          ))}
        </dl>
      )}
      {!hydrated ? null : orders.length === 0 ? (
        <div className="border-4 border-ink bg-paper p-10 text-center"><p className="mb-6 font-bold">No completed orders yet.</p><Link to="/stickers" className="inline-block border-4 border-ink bg-accent px-6 py-3 font-display text-xl uppercase hard-shadow press">Shop stickers</Link></div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="border-4 border-ink bg-white p-5 hard-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-2xl">{order.id}</h2><p className="font-mono text-[10px] font-bold text-muted-foreground">{formatOrderDate(order.date)}</p></div><p className="font-display text-2xl">{formatPrice(order.total)}</p></div>
              <p className="mt-3 text-sm font-bold">{order.items.length} design{order.items.length === 1 ? '' : 's'} · {order.items.reduce((sum, item) => sum + item.qty, 0)} item{order.items.reduce((sum, item) => sum + item.qty, 0) === 1 ? '' : 's'}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setExpanded(expanded === order.id ? null : order.id)} className={action} title="View receipt" aria-label="View receipt"><Eye className="size-4" /></button>
                <button type="button" onClick={() => printReceipt(order)} className={action} title="Print receipt" aria-label="Print receipt"><Printer className="size-4" /></button>
                <button type="button" onClick={() => downloadReceipt(order)} className={action} title="Download receipt" aria-label="Download receipt"><Download className="size-4" /></button>
                <button type="button" onClick={() => copy(order)} className={action} title="Copy order details" aria-label="Copy order details"><Copy className="size-4" /></button>
                <button type="button" onClick={() => { reorder(order); navigate({ to: "/cart" }); }} className="ml-auto inline-flex items-center gap-2 border-2 border-ink bg-neon-green px-4 py-2 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow-sm press"><RefreshCw className="size-4" /> Reorder</button>
              </div>
              {expanded === order.id && <div className="mt-5 border-t-2 border-ink pt-4"><pre className="whitespace-pre-wrap font-mono text-xs font-bold">{orderText(order)}</pre></div>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}