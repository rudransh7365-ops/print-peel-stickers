import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/config";

export const Route = createFileRoute("/custom")({
  head: () => ({
    meta: [
      { title: "Create Your Own Sticker — PRINT&PEEL" },
      {
        name: "description",
        content:
          "Upload your own design, pick a shape and size, and turn it into a premium laminated sticker.",
      },
      { property: "og:title", content: "Create Your Own Sticker — PRINT&PEEL" },
      {
        property: "og:description",
        content: "Upload your design and turn it into a physical sticker.",
      },
    ],
  }),
  component: CustomPage,
});

const SHAPES = ["Square", "Rectangle", "Triangle", "Circle", "Custom"];
const SIZES = ["3 × 3 inch", "5 × 8 inch", "1/4 A4", "1/2 A4", "A4"];
const CUSTOM_PRICE = 40;

function CustomPage() {
  const { addToCart } = useStore();
  const [shape, setShape] = useState(SHAPES[0]!);
  const [size, setSize] = useState(SIZES[0]!);
  const [customSize, setCustomSize] = useState("");
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState<{ name: string; dataUrl: string } | null>(null);

  const finalSize = size === "Custom" ? customSize : size;

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFile({ name: f.name, dataUrl: String(reader.result) });
    reader.readAsDataURL(f);
  };

  const pill = (active: boolean) =>
    `border-2 border-ink px-4 py-2 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow-sm press ${
      active ? "bg-ink text-white" : "bg-white"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
        Create your own
      </p>
      <h1 className="mb-10 text-6xl sm:text-8xl">
        YOUR DESIGN.
        <br />
        <span className="bg-neon-green px-2">YOUR STICKER.</span>
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            addToCart({
              name: "Custom Sticker",
              size: finalSize || "Custom size",
              price: CUSTOM_PRICE,
              qty,
              image: file?.dataUrl,
              custom: {
                shape,
                size: finalSize || "Custom size",
                instructions,
                hasImage: !!file,
                ...(file ? { imageName: file.name, imageDataUrl: file.dataUrl } : {}),
              },
            });
          }}
        >
          <div>
            <h2 className="mb-3 text-2xl">1 · Upload design</h2>
            <label className="flex cursor-pointer items-center gap-4 border-4 border-dashed border-ink bg-paper p-6">
              <Upload className="size-6 shrink-0" aria-hidden="true" />
              <span className="min-w-0 text-sm font-bold">
                {file ? file.name : "Choose an image from your device"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
            {file && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={file.dataUrl}
                  alt="Your uploaded design"
                  className="size-24 border-4 border-ink bg-white object-contain p-1"
                />
                <a
                  href={file.dataUrl}
                  download={file.name}
                  className="border-2 border-ink bg-white px-4 py-2 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow-sm press"
                >
                  Download custom image
                </a>
              </div>
            )}
          </div>

          <fieldset>
            <legend className="mb-3 font-display text-2xl uppercase">2 · Shape</legend>
            <div className="flex flex-wrap gap-2">
              {SHAPES.map((s) => (
                <button key={s} type="button" onClick={() => setShape(s)} className={pill(shape === s)}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 font-display text-2xl uppercase">3 · Size</legend>
            <div className="flex flex-wrap gap-2">
              {[...SIZES, "Custom"].map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} className={pill(size === s)}>
                  {s}
                </button>
              ))}
            </div>
            {size === "Custom" && (
              <input
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="e.g. 4 × 6 inch"
                aria-label="Custom size"
                className="mt-3 w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-bold outline-none"
              />
            )}
          </fieldset>

          <div>
            <h2 className="mb-3 text-2xl">4 · Quantity</h2>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              aria-label="Quantity"
              className="w-28 border-4 border-ink bg-paper px-4 py-3 font-mono font-extrabold outline-none"
            />
          </div>

          <div>
            <h2 className="mb-3 text-2xl">5 · Instructions</h2>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="e.g. Matte finish, white border"
              aria-label="Additional instructions"
              className="w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-bold outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full border-4 border-ink bg-accent px-6 py-5 font-display text-2xl text-accent-foreground uppercase hard-shadow press"
          >
            Add custom sticker to cart
          </button>
        </form>

        <aside className="h-fit border-4 border-ink bg-paper p-6 hard-shadow lg:sticky lg:top-28">
          <h2 className="mb-5 text-3xl">Custom sticker</h2>
          <dl className="space-y-3 font-mono text-xs font-bold">
            <div>
              <dt className="tracking-widest uppercase text-muted-foreground">Shape</dt>
              <dd className="text-base">{shape}</dd>
            </div>
            <div>
              <dt className="tracking-widest uppercase text-muted-foreground">Size</dt>
              <dd className="text-base">{finalSize || "—"}</dd>
            </div>
            <div>
              <dt className="tracking-widest uppercase text-muted-foreground">Quantity</dt>
              <dd className="text-base">{qty}</dd>
            </div>
            <div>
              <dt className="tracking-widest uppercase text-muted-foreground">Instructions</dt>
              <dd className="text-base whitespace-pre-wrap">{instructions || "—"}</dd>
            </div>
            <div>
              <dt className="tracking-widest uppercase text-muted-foreground">Design file</dt>
              <dd className="text-base">{file ? file.name : "Not uploaded yet"}</dd>
            </div>
            <div className="border-t-2 border-ink pt-3">
              <dt className="tracking-widest uppercase text-muted-foreground">Price each</dt>
              <dd className="text-base">{formatPrice(CUSTOM_PRICE)}</dd>
            </div>
          </dl>
          <p className="mt-5 border-2 border-ink bg-white p-3 text-[11px] font-bold">
            WhatsApp can&apos;t pick up files from your device automatically. Download your design
            and attach it to the chat before sending the order.
          </p>
        </aside>
      </div>
    </div>
  );
}
