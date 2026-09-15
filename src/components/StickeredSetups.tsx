import { Link } from "@tanstack/react-router";
import laptop from "@/assets/setup-laptop.jpg";
import bottle from "@/assets/setup-bottle.jpg";
import notebook from "@/assets/setup-notebook.jpg";
import wall from "@/assets/setup-wall.jpg";
import { PRODUCTS } from "@/data/products";

type Placement = { productId: string; style: string };

type Scene = {
  label: string;
  object: string;
  photo: string;
  placements: Placement[];
};

/**
 * Setup scenes: a real object photo with the ACTUAL sticker artwork placed on it
 * (scaled, rotated and shadowed to sit on the surface). Swap `photo` later for a
 * real lifestyle photograph and the same sticker placements still apply.
 */
const SCENES: Scene[] = [
  {
    label: "Laptop",
    object: "Laptop lid",
    photo: laptop,
    placements: [
      { productId: "gojo-run-sticker-1", style: "left-[22%] top-[42%] w-[26%] rotate-[-8deg]" },
      {
        productId: "limited-edition-sticker-1",
        style: "left-[52%] top-[54%] w-[30%] rotate-[6deg]",
      },
    ],
  },
  {
    label: "Water bottle",
    object: "Bottle",
    photo: bottle,
    placements: [
      {
        productId: "ronaldo-chibi-sticker-1",
        style: "left-[40%] top-[38%] w-[19%] rotate-[3deg]",
      },
      { productId: "neymar-jr-sticker-1", style: "left-[41%] top-[58%] w-[18%] rotate-[-4deg]" },
    ],
  },
  {
    label: "Notebook",
    object: "Notebook cover",
    photo: notebook,
    placements: [
      { productId: "tulip-envelope-sticker-1", style: "left-[30%] top-[40%] w-[26%] rotate-[-6deg]" },
      {
        productId: "hibiscus-bloom-sticker-1",
        style: "left-[52%] top-[58%] w-[22%] rotate-[10deg]",
      },
    ],
  },
  {
    label: "Wall",
    object: "Desk wall",
    photo: wall,
    placements: [
      { productId: "rengoku-flame-sticker-1", style: "left-[44%] top-[26%] w-[24%] rotate-[4deg]" },
      {
        productId: "dreadlock-boy-sticker-1",
        style: "left-[68%] top-[48%] w-[22%] rotate-[-7deg]",
      },
    ],
  },
];

export function StickeredSetups() {
  return (
    <div className="flex snap-x gap-5 overflow-x-auto px-5 pb-4 no-scrollbar">
      {SCENES.map((scene) => (
        <figure key={scene.label} className="w-[78vw] shrink-0 snap-start sm:w-[340px]">
          <div className="relative aspect-4/5 overflow-hidden border-4 border-white bg-white/5">
            <img
              src={scene.photo}
              alt={`${scene.object} shown with PRINT&PEEL stickers applied`}
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
            />
            {scene.placements.map((pl) => {
              const product = PRODUCTS.find((p) => p.id === pl.productId);
              if (!product) return null;
              return (
                <img
                  key={pl.productId}
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className={`absolute ${pl.style} drop-shadow-[3px_5px_6px_rgba(0,0,0,0.45)]`}
                />
              );
            })}
            <span className="absolute bottom-2 left-2 border-2 border-ink bg-white px-2 py-0.5 font-mono text-[8px] font-extrabold tracking-widest uppercase text-ink">
              Mockup · not a customer photo
            </span>
          </div>
          <figcaption className="mt-3 flex items-center justify-between gap-2">
            <span className="font-display text-xl text-white uppercase">{scene.label}</span>
            <span className="flex gap-1">
              {scene.placements.map((pl) => {
                const product = PRODUCTS.find((p) => p.id === pl.productId);
                if (!product) return null;
                return (
                  <Link
                    key={pl.productId}
                    to="/product/$productId"
                    params={{ productId: product.id }}
                    aria-label={product.name}
                    className="size-9 border-2 border-white bg-white p-0.5"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </Link>
                );
              })}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
