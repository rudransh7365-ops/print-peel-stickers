import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/config";
import { useStore } from "@/lib/store";

function badgeOf(p: Product) {
  if (p.bestSeller) return { label: "BEST SELLER", cls: "bg-accent text-accent-foreground" };
  if (p.trending) return { label: "TRENDING", cls: "bg-neon-blue text-ink" };
  if (p.limited) return { label: "LIMITED", cls: "bg-neon-purple text-white" };
  if (p.recentlyAdded) return { label: "NEW", cls: "bg-neon-green text-ink" };
  if (p.popular) return { label: "POPULAR", cls: "bg-ink text-white" };
  return null;
}

export function ProductCard({ product, dark = false }: { product: Product; dark?: boolean }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const badge = badgeOf(product);
  const saved = isWishlisted(product.id);
  const size = product.sizes[0];
  if (!size) return null;

  return (
    <article className="group relative">
      <div
        className={`relative mb-3 border-4 border-ink ${dark ? "bg-white" : "bg-paper"} hard-shadow`}
      >
        {badge && (
          <span
            className={`absolute -top-3 left-2 z-10 border-2 border-ink px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-tight ${badge.cls}`}
          >
            {badge.label}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className="absolute top-2 right-2 z-10 grid size-9 place-items-center border-2 border-ink bg-white transition-transform active:scale-90"
        >
          <Heart
            className={`size-4 transition-colors ${saved ? "fill-accent text-accent" : "text-ink"}`}
            aria-hidden="true"
          />
        </button>

        <Link
          to="/product/$productId"
          params={{ productId: product.id }}
          className="block aspect-square p-5"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="sticker mx-auto h-full w-full object-contain"
          />
        </Link>

        <button
          type="button"
          onClick={() =>
            addToCart({
              productId: product.id,
              name: product.name,
              image: product.images[0],
              size: size.label,
              price: size.price,
              qty: 1,
            })
          }
          className="absolute right-2 bottom-2 grid size-10 place-items-center border-2 border-ink bg-accent text-accent-foreground hard-shadow-sm press md:opacity-0 md:group-hover:opacity-100"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </div>

      <Link to="/product/$productId" params={{ productId: product.id }} className="block">
        <h3 className={`text-lg ${dark ? "text-white" : "text-ink"}`}>{product.name}</h3>
      </Link>
      <p
        className={`font-mono text-xs font-bold ${dark ? "text-white/60" : "text-muted-foreground"}`}
      >
        {formatPrice(size.price)}
        {product.sizes.length > 1 && <span className="opacity-60"> +</span>}
      </p>
    </article>
  );
}
