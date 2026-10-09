import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/custom")({
  head: () => ({
    meta: [
      { title: "Order Custom Stickers by Call — PRINT&PEEL" },
      { name: "description", content: "Call 8517022565 to order custom stickers. Every detail is handled on the call." },
      { property: "og:title", content: "Order Custom Stickers by Call — PRINT&PEEL" },
      { property: "og:description", content: "Call 8517022565 to order your custom stickers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CustomPage,
});

function CustomPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 text-center">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">Custom stickers</p>
      <h1 className="mb-8 text-5xl sm:text-7xl">
        WANT A CUSTOM STICKER?
        <br />
        <span className="bg-neon-green px-2">JUST CALL US.</span>
      </h1>
      <div className="border-4 border-ink bg-paper p-8 hard-shadow">
        <p className="mb-6 text-lg font-bold">Call this number to order custom stickers. Every info — sizes, shapes, pricing and design — will be provided on the call.</p>
        <a href="tel:+918517022565" className="inline-flex items-center gap-3 border-4 border-ink bg-accent px-8 py-5 font-display text-3xl text-accent-foreground uppercase hard-shadow press">
          <Phone className="size-7" aria-hidden="true" /> 8517022565
        </a>
      </div>
    </div>
  );
}
