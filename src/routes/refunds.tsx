import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy — PRINT&PEEL" },
      {
        name: "description",
        content:
          "Returns, refunds and cancellation policy for PRINT&PEEL — damaged items, refund timelines and how to claim.",
      },
      { property: "og:title", content: "Cancellation & Refund Policy — PRINT&PEEL" },
      {
        property: "og:description",
        content: "Returns, refunds and cancellation policy for PRINT&PEEL.",
      },
    ],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
        Legal
      </p>
      <h1 className="mb-8 text-5xl sm:text-6xl">Cancellation &amp; Refund Policy</h1>
      <p className="mb-6 text-sm font-medium text-muted-foreground">
        Last updated: October 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-extrabold">1. Order Cancellation</h2>
          <p className="font-medium text-muted-foreground">
            Orders can be cancelled only before they go to print. Since each sticker and poster is
            printed on demand, once production has begun the order cannot be cancelled or
            modified. To request a cancellation, contact us at{" "}
            <a
              href="mailto:printandpeel@gmail.com"
              className="font-extrabold text-accent underline"
            >
              printandpeel@gmail.com
            </a>{" "}
            as soon as possible after placing your order.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">2. Damaged During Transit</h2>
          <p className="font-medium text-muted-foreground">
            We take great care in packaging your order, but if your items arrive damaged during
            transit, we accept returns and will issue a full refund or replacement. To claim:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 font-medium text-muted-foreground">
            <li>
              Email us at{" "}
              <a
                href="mailto:printandpeel@gmail.com"
                className="font-extrabold text-accent underline"
              >
                printandpeel@gmail.com
              </a>{" "}
              within 48 hours of receiving your order.
            </li>
            <li>Include clear photos and/or a video showing the damage.</li>
            <li>Include your order number in the subject line.</li>
          </ul>
          <p className="mt-3 font-medium text-muted-foreground">
            Once we verify the damage, we will process your refund or arrange a replacement at no
            extra cost.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">3. Refund Timeline</h2>
          <p className="font-medium text-muted-foreground">
            Approved refunds are credited back to your original payment method within 5–7
            business days. The exact time for the refund to reflect in your account may vary
            depending on your bank or payment provider.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">4. Non-Refundable Cases</h2>
          <ul className="list-disc space-y-1 pl-5 font-medium text-muted-foreground">
            <li>Orders that have already gone to print cannot be cancelled or refunded.</li>
            <li>Damage claims submitted after 48 hours of delivery will not be accepted.</li>
            <li>Custom-designed orders (your own artwork) are non-refundable unless damaged in transit.</li>
            <li>Minor colour variations due to screen differences are not considered defects.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">5. How to Reach Us</h2>
          <p className="font-medium text-muted-foreground">
            For any cancellation, refund or return queries, email us at{" "}
            <a
              href="mailto:printandpeel@gmail.com"
              className="font-extrabold text-accent underline"
            >
              printandpeel@gmail.com
            </a>
            . We aim to respond within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
