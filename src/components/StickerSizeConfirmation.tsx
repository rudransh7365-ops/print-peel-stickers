import { Check } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/config";

export function StickerSizeConfirmation({
  product,
  selectedIndex,
  onSelect,
}: {
  product: Product;
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="mb-8 border-4 border-ink bg-paper p-5" aria-labelledby="sticker-size-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] font-extrabold tracking-widest uppercase text-accent">
            Sticker size confirmation
          </p>
          <h2 id="sticker-size-heading" className="mt-1 text-2xl">
            See how much space it fills
          </h2>
        </div>
        <span className="border-2 border-ink bg-white px-2 py-1 font-mono text-[9px] font-extrabold uppercase">
          Selected: {product.sizes[selectedIndex]?.label}
        </span>
      </div>

      <div className="grid grid-cols-2 items-end gap-4">
        {product.sizes.map((size, index) => {
          const selected = selectedIndex === index;
          const previewSize = index === 0 ? "size-28 sm:size-32" : "size-36 sm:size-44";

          return (
            <button
              key={size.label}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={selected}
              className={`relative flex min-w-0 flex-col items-center border-2 p-3 transition-colors press ${
                selected ? "border-ink bg-neon-green" : "border-ink bg-white"
              }`}
            >
              {selected && (
                <span className="absolute top-2 right-2 grid size-6 place-items-center border-2 border-ink bg-ink text-white">
                  <Check className="size-3" aria-hidden="true" />
                </span>
              )}
              <span
                className={`${previewSize} grid max-w-full place-items-center border-2 border-dashed border-ink bg-paper p-3`}
                aria-hidden="true"
              >
                <img src={product.images[0]} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="mt-3 font-mono text-[10px] font-extrabold uppercase">
                {size.label} · {formatPrice(size.price)}
              </span>
              <span className="mt-1 text-center text-[10px] font-bold text-muted-foreground">
                Your sticker will fit inside this area
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 font-mono text-[9px] font-bold uppercase text-muted-foreground">
        Preview is a relative size comparison. Final cut follows the artwork shape.
      </p>
    </section>
  );
}