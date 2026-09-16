const FAQS = [
  {
    q: "Are the stickers water resistant?",
    a: "Yes. They are printed on vinyl and laminated, so splashes and spills wipe right off.",
  },
  {
    q: "Are they scratch resistant?",
    a: "The lamination layer takes the everyday scuffs of a laptop lid, bottle or notebook.",
  },
  {
    q: "What sizes are available?",
    a: "Stickers come in 3 × 3 inch and 5 × 5 inch. Posters come in 1/4 A4, 1/2 A4 and A4. Custom sizes are possible in the Custom section.",
  },
  {
    q: "How do I order?",
    a: "Add what you want to the cart, fill in your delivery details at checkout, then tap ORDER ON WHATSAPP. Your full order opens as a pre-filled message.",
  },
  {
    q: "Can I create a custom sticker?",
    a: "Yes. Upload your design in the Custom section, pick a shape, size and quantity, then add it to the cart like any other item.",
  },
  {
    q: "How does delivery work?",
    a: "Orders of ₹230 or more get free delivery. Below that, delivery charges apply and we confirm them with you on WhatsApp.",
  },
  {
    q: "What happens after I order through WhatsApp?",
    a: "We reply on the same chat to confirm your order, delivery and payment before printing.",
  },
  {
    q: "Can I order multiple stickers?",
    a: "Yes — mix any number of designs and quantities in one cart.",
  },
  {
    q: "Can I order posters?",
    a: "Yes. Pick the poster size you want before adding it to the cart.",
  },
  {
    q: "Does the sticker leave residue?",
    a: "Minimal residue. Any small remaining residue can usually be cleaned with a damp cloth.",
  },
];

export function FaqList({ limit }: { limit?: number }) {
  const faqs = typeof limit === "number" ? FAQS.slice(0, limit) : FAQS;
  return (
    <div className="divide-y-2 divide-ink border-4 border-ink bg-paper">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl uppercase">
            {f.q}
            <span className="shrink-0 font-mono text-lg transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm font-medium text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
