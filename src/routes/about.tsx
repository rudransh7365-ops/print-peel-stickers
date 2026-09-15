import { createFileRoute } from "@tanstack/react-router";
import { enquiryMessage, openWhatsApp } from "@/lib/whatsapp";
import { QualityStrip } from "@/components/QualityStrip";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PRINT&PEEL" },
      {
        name: "description",
        content:
          "PRINT&PEEL makes premium laminated stickers, posters and custom prints. Print it. Peel it. Make it yours.",
      },
      { property: "og:title", content: "About — PRINT&PEEL" },
      {
        property: "og:description",
        content: "Premium laminated stickers, posters and custom prints.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 py-14">
        <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
          Who we are
        </p>
        <h1 className="mb-8 text-6xl sm:text-8xl">
          PRINT IT.
          <br />
          PEEL IT.
          <br />
          <span className="bg-neon-blue px-2">MAKE IT YOURS.</span>
        </h1>
        <p className="max-w-xl text-base font-bold">
          PRINT&amp;PEEL is a small sticker and poster studio. We print designs on premium
          laminated vinyl and thick matte paper, so the stuff you use every day — laptop, bottle,
          notebook, wall — actually looks like yours.
        </p>
        <p className="mt-4 max-w-xl text-sm font-medium text-muted-foreground">
          Got your own artwork? Upload it in the Custom section and we&apos;ll print it. Every order
          is confirmed personally over WhatsApp before it goes to print.
        </p>
        <button
          type="button"
          onClick={() => openWhatsApp(enquiryMessage())}
          className="mt-8 border-4 border-ink bg-neon-green px-6 py-4 font-mono text-[11px] font-extrabold tracking-widest uppercase hard-shadow press"
        >
          Enquire on WhatsApp
        </button>
      </section>
      <QualityStrip />
    </div>
  );
}
