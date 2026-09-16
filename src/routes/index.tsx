import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS, getProduct } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { FloatingStickers } from "@/components/FloatingStickers";
import { StickeredSetups } from "@/components/StickeredSetups";
import { QualityStrip } from "@/components/QualityStrip";
import { FaqList } from "@/components/FaqList";
import { DeliveryProgress } from "@/components/DeliveryProgress";
import { useStore } from "@/lib/store";
import { enquiryMessage, openWhatsApp } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PRINT&PEEL — Premium Stickers & Posters" },
      {
        name: "description",
        content:
          "Bold laminated stickers and posters for laptops, bottles and walls. Anime, football, cars, typography and your own custom designs.",
      },
      { property: "og:title", content: "PRINT&PEEL — Premium Stickers & Posters" },
      {
        property: "og:description",
        content: "Bold laminated stickers and posters. Print it. Peel it. Make it yours.",
      },
    ],
  }),
  component: Home,
});

const REVIEWS = [
  { name: "Aditi", text: "Colours are so sharp. Been on my bottle for months, zero peeling." },
  { name: "Rohan", text: "Ordered the Gojo one. Quality is way better than what I expected." },
  { name: "Kabir", text: "Sent my own design and got it back as a proper sticker. Legit." },
];

function Home() {
  const { recent, hydrated } = useStore();
  const featured = PRODUCTS.filter((p) => p.featured);
  const trending = PRODUCTS.filter((p) => p.trending);
  const best = PRODUCTS.filter((p) => p.bestSeller);
  const fresh = PRODUCTS.filter((p) => p.recentlyAdded);
  const recentProducts = hydrated
    ? recent.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p)
    : [];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-4 border-ink bg-paper">
        <FloatingStickers />
        <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <p className="mb-4 inline-block border-2 border-ink bg-neon-green px-3 py-1 font-mono text-[10px] font-extrabold tracking-widest uppercase">
            Premium laminated · Water resistant
          </p>
          <h1 className="max-w-4xl text-[15vw] leading-[0.85] sm:text-8xl lg:text-9xl">
            STICK IT
            <br />
            <span className="text-accent">LOUD.</span>
            <br />
            PEEL IT <span className="bg-neon-blue px-2">PROUD.</span>
          </h1>
          <p className="mt-8 max-w-md text-base font-bold">
            Anime, football, cars, typography — or your own artwork. Printed on premium laminated
            vinyl and thick matte paper.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/stickers"
              className="border-4 border-ink bg-accent px-8 py-4 font-display text-2xl text-accent-foreground uppercase hard-shadow press"
            >
              Shop stickers
            </Link>
            <Link
              to="/custom"
              className="border-4 border-ink bg-white px-8 py-4 font-display text-2xl uppercase hard-shadow press"
            >
              Make your own
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <SectionHead kicker="Handpicked" title="FEATURED DROPS" to="/stickers" />
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {featured.map((p) => (
            <Reveal key={p.id}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRENDING (dark) */}
      <section className="border-y-4 border-ink bg-ink px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHead dark kicker="Moving fast" title="TRENDING NOW" to="/stickers" />
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {trending.map((p) => (
              <Reveal key={p.id}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <SectionHead kicker="Most ordered" title="BEST SELLERS" to="/stickers" />
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {best.map((p) => (
            <Reveal key={p.id}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <QualityStrip />

      {/* NEW */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <SectionHead kicker="Fresh off the printer" title="NEW ARRIVALS" to="/posters" />
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {fresh.map((p) => (
            <Reveal key={p.id}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <StickeredSetups />

      {/* CUSTOM CTA */}
      <section className="border-y-4 border-ink bg-neon-green px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="text-6xl sm:text-8xl">GOT A DESIGN?</h2>
            <p className="mx-auto mt-6 max-w-md text-base font-bold">
              Upload your artwork, pick a shape and size, and we&apos;ll turn it into a real
              laminated sticker.
            </p>
            <Link
              to="/custom"
              className="mt-10 inline-block border-4 border-ink bg-ink px-8 py-4 font-display text-2xl text-white uppercase hard-shadow press"
            >
              Create your own
            </Link>
          </Reveal>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <Reveal>
          <h2 className="mb-6 text-4xl">FREE DELIVERY ABOVE ₹230</h2>
          <DeliveryProgress />
        </Reveal>
      </section>

      {/* REVIEWS */}
      <section className="border-y-4 border-ink bg-paper px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHead kicker="From the peel gang" title="WHAT PEOPLE SAY" />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <Reveal key={r.name}>
                <figure className="h-full border-4 border-ink bg-white p-5 hard-shadow">
                  <blockquote className="text-sm font-bold">“{r.text}”</blockquote>
                  <figcaption className="mt-4 font-mono text-[10px] font-extrabold tracking-widest uppercase text-muted-foreground">
                    — {r.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RECENTLY VIEWED */}
      {recentProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16">
          <SectionHead kicker="Pick up where you left off" title="RECENTLY VIEWED" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {recentProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ + ENQUIRY */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <Reveal>
          <SectionHead kicker="Good to know" title="FAQ" />
        </Reveal>
        <FaqList limit={5} />
        <div className="mt-10 border-4 border-ink bg-ink p-8 text-center hard-shadow">
          <h3 className="text-4xl text-white">STILL CURIOUS?</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm font-bold text-white/80">
            Message us and we&apos;ll help you pick sizes, shapes or a custom print.
          </p>
          <button
            type="button"
            onClick={() => openWhatsApp(enquiryMessage())}
            className="mt-6 border-4 border-white bg-neon-green px-6 py-3 font-mono text-[11px] font-extrabold tracking-widest uppercase press"
          >
            Enquire on WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
}
