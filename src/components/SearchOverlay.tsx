import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { searchProducts } from "@/data/products";
import { formatPrice } from "@/lib/config";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = searchProducts(q);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      className="fixed inset-0 z-[100] bg-ink/90 p-4 pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-2xl border-4 border-ink bg-white hard-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-4 border-ink p-4">
          <Search className="size-5 shrink-0" aria-hidden="true" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stickers, posters, tags…"
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent font-bold outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid size-8 shrink-0 place-items-center border-2 border-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {q && results.length === 0 && (
            <p className="p-6 text-sm font-bold">No products matched “{q}”.</p>
          )}
          {!q && (
            <p className="p-6 font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
              Try “football”, “anime”, “poster”, “floral”
            </p>
          )}
          <ul>
            {results.map((p) => (
              <li key={p.id} className="border-b-2 border-ink/10 last:border-0">
                <Link
                  to="/product/$productId"
                  params={{ productId: p.id }}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 hover:bg-paper"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="size-14 shrink-0 border-2 border-ink bg-paper object-contain p-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold">{p.name}</span>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                      {p.category} · {p.tags.slice(0, 2).join(", ")}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs font-bold">
                    {formatPrice(p.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
