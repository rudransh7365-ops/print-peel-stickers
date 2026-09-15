import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — PRINT&PEEL" },
      { name: "description", content: "The stickers and posters you saved for later." },
      { property: "og:title", content: "Wishlist — PRINT&PEEL" },
      { property: "og:description", content: "Your saved stickers and posters." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, hydrated } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
        Saved for later
      </p>
      <h1 className="mb-10 text-6xl sm:text-7xl">WISHLIST</h1>

      {!hydrated ? null : items.length === 0 ? (
        <div className="border-4 border-ink bg-paper p-10 text-center">
          <p className="mb-6 font-bold">Nothing saved yet. Tap the heart on any design.</p>
          <Link
            to="/stickers"
            className="inline-block border-4 border-ink bg-accent px-6 py-3 font-mono text-[11px] font-extrabold tracking-widest uppercase text-accent-foreground hard-shadow press"
          >
            Browse stickers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
