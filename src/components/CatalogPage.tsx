import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { PRODUCTS, STICKER_TYPES, type Category } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { DeliveryProgress } from "./DeliveryProgress";

const SORTS = [
  { id: "trending", label: "Trending" },
  { id: "newest", label: "Newest" },
  { id: "best", label: "Best sellers" },
  { id: "popular", label: "Most ordered" },
  { id: "low", label: "Price ↑" },
  { id: "high", label: "Price ↓" },
] as const;

export function CatalogPage({
  category,
  title,
  kicker,
}: {
  category: Category;
  title: ReactNode;
  kicker: string;
}) {
  const base = useMemo(() => PRODUCTS.filter((p) => p.category === category), [category]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("trending");

  const sizes = useMemo(
    () => Array.from(new Set(base.flatMap((p) => p.sizes.map((s) => s.label)))),
    [base],
  );
  const types = useMemo(
    () => STICKER_TYPES.filter((t) => base.some((p) => p.types.includes(t))),
    [base],
  );

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = base.filter((p) => {
      const matchQ =
        !s ||
        [p.name, p.description, ...p.tags, ...p.types].join(" ").toLowerCase().includes(s);
      const matchType = !type || p.types.includes(type);
      const matchSize = !size || p.sizes.some((x) => x.label === size);
      return matchQ && matchType && matchSize;
    });
    list = [...list];
    switch (sort) {
      case "newest":
        list.sort((a, b) => Number(!!b.recentlyAdded) - Number(!!a.recentlyAdded));
        break;
      case "best":
        list.sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller));
        break;
      case "popular":
        list.sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
        break;
      case "low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "high":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => Number(!!b.trending) - Number(!!a.trending));
    }
    return list;
  }, [base, q, type, size, sort]);

  const pill = (active: boolean) =>
    `shrink-0 border-2 border-ink px-4 py-2 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow-sm press ${
      active ? "bg-ink text-white" : "bg-white"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
        {kicker}
      </p>
      <h1 className="mb-8 text-6xl sm:text-7xl">{title}</h1>

      <div className="mb-6 flex items-center gap-3 border-4 border-ink bg-paper px-4 py-3">
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search this collection…"
          aria-label="Search this collection"
          className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button type="button" onClick={() => setType(null)} className={pill(!type)}>
          All
        </button>
        {types.map((t) => (
          <button key={t} type="button" onClick={() => setType(t)} className={pill(type === t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button type="button" onClick={() => setSize(null)} className={pill(!size)}>
          Any size
        </button>
        {sizes.map((s) => (
          <button key={s} type="button" onClick={() => setSize(s)} className={pill(size === s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="mb-10 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {SORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSort(s.id)}
            aria-pressed={sort === s.id}
            className={`shrink-0 border-b-4 pb-1 font-mono text-[10px] font-extrabold tracking-widest uppercase ${
              sort === s.id ? "border-accent" : "border-transparent text-muted-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="border-4 border-ink bg-paper p-8 text-center font-bold">
          Nothing matched those filters yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div className="mt-14">
        <DeliveryProgress />
      </div>
    </div>
  );
}
