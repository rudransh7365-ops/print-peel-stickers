import { createFileRoute } from "@tanstack/react-router";
import { FaqList } from "@/components/FaqList";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — PRINT&PEEL" },
      {
        name: "description",
        content:
          "Sizes, durability, custom stickers, delivery and how ordering over WhatsApp works.",
      },
      { property: "og:title", content: "FAQ — PRINT&PEEL" },
      { property: "og:description", content: "Sizes, durability, custom orders and delivery." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
        Good questions
      </p>
      <h1 className="mb-10 text-6xl sm:text-7xl">FAQ</h1>
      <FaqList />
    </div>
  ),
});
