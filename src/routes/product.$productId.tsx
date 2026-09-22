import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { PRODUCTS, getProduct } from "@/data/products";
import { formatPrice, FREE_DELIVERY_THRESHOLD } from "@/lib/config";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { StickerSizeConfirmation } from "@/components/StickerSizeConfirmation";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — PRINT&PEEL" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = `${product.name} — PRINT&PEEL`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted, pushRecent } = useStore();
  const [image, setImage] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setImage(0);
    setSizeIdx(0);
    setQty(1);
    pushRecent(product.id);
  }, [product.id, pushRecent]);

  const size = product.sizes[sizeIdx] ?? product.sizes[0]!;
  const saved = isWishlisted(product.id);
  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.types.some((t) => product.types.includes(t)),
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[10px] tracking-widest uppercase">
        <Link to="/" className="hover:text-accent">
          Home
        </Link>
        <span className="mx-2 opacity-40">/</span>
        <Link
          to={product.category === "posters" ? "/posters" : "/stickers"}
          className="hover:text-accent"
        >
          {product.category}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="border-4 border-ink bg-paper p-8 hard-shadow">
            <img
              src={product.images[image]}
              alt={product.name}
              width={800}
              height={800}
              className="mx-auto aspect-square w-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setImage(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={i === image}
                  className={`size-20 border-4 bg-white p-1 ${i === image ? "border-accent" : "border-ink"}`}
                >
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span
                key={t}
                className="border-2 border-ink bg-white px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-widest uppercase"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="mb-3 text-5xl sm:text-6xl">{product.name}</h1>
          <p className="mb-6 font-mono text-2xl font-extrabold">{formatPrice(size.price)}</p>
          <p className="mb-8 max-w-md text-sm font-medium text-muted-foreground">
            {product.description}
          </p>

          <fieldset className={product.category === "stickers" ? "mb-4" : "mb-6"}>
            <legend className="mb-3 font-mono text-[10px] font-extrabold tracking-widest uppercase">
              Size
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSizeIdx(i)}
                  aria-pressed={i === sizeIdx}
                  className={`border-2 border-ink px-4 py-2 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow-sm press ${
                    i === sizeIdx ? "bg-ink text-white" : "bg-white"
                  }`}
                >
                  {s.label} · {formatPrice(s.price)}
                </button>
              ))}
            </div>
          </fieldset>

          {product.category === "stickers" && (
            <StickerSizeConfirmation
              product={product}
              selectedIndex={sizeIdx}
              onSelect={setSizeIdx}
            />
          )}

          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[10px] font-extrabold tracking-widest uppercase">
              Qty
            </span>
            <div className="flex items-center border-2 border-ink">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid size-10 place-items-center border-r-2 border-ink"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <span className="w-12 text-center font-mono font-extrabold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="grid size-10 place-items-center border-l-2 border-ink"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                addToCart({
                  productId: product.id,
                  name: product.name,
                  image: product.images[0],
                  size: size.label,
                  price: size.price,
                  qty,
                })
              }
              className="flex-1 border-4 border-ink bg-accent px-6 py-4 font-display text-2xl text-accent-foreground uppercase hard-shadow press"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              className="grid size-[60px] place-items-center border-4 border-ink bg-white hard-shadow press"
            >
              <Heart className={`size-5 ${saved ? "fill-accent text-accent" : ""}`} aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-8 space-y-2 border-4 border-ink bg-paper p-5 text-xs font-bold">
            <li>{product.category === "posters" ? "Premium self-adhesive matte finish" : "Premium laminated finish · water & scratch resistant"}</li>
            <li>Free delivery from ₹{FREE_DELIVERY_THRESHOLD}</li>
            <li>Order is confirmed on WhatsApp before printing</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-4xl">You might also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
