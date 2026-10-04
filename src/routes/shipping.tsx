import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — PRINT&PEEL" },
      {
        name: "description",
        content:
          "Dispatch timelines, delivery partners, shipping rates and expected delivery times for PRINT&PEEL orders.",
      },
      { property: "og:title", content: "Shipping Policy — PRINT&PEEL" },
      {
        property: "og:description",
        content: "Dispatch timelines, shipping rates and delivery information.",
      },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
        Legal
      </p>
      <h1 className="mb-8 text-5xl sm:text-6xl">Shipping Policy</h1>
      <p className="mb-6 text-sm font-medium text-muted-foreground">
        Last updated: October 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-extrabold">1. Dispatch Timeline</h2>
          <p className="font-medium text-muted-foreground">
            All confirmed orders are dispatched within 24–48 hours. Each order is printed,
            laminated, and quality-checked before it is handed over to our delivery partner.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">2. Delivery Partner</h2>
          <p className="font-medium text-muted-foreground">
            We ship all orders through Delhivery, one of India&apos;s largest logistics networks.
            Once your order is dispatched, you will receive a tracking number via WhatsApp or
            email so you can follow your package in real time.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">3. Shipping Rates</h2>
          <ul className="list-disc space-y-1 pl-5 font-medium text-muted-foreground">
            <li>Gwalior (local delivery): ₹50</li>
            <li>Rest of India: ₹90</li>
            <li>Free delivery on all orders above ₹180</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">4. Expected Delivery Time</h2>
          <p className="font-medium text-muted-foreground">
            After dispatch, deliveries typically take 3–7 business days depending on your
            location. Remote or rural areas may take slightly longer. You can track your
            shipment using the tracking number provided once your order is dispatched.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">5. Order Tracking</h2>
          <p className="font-medium text-muted-foreground">
            Once your order is handed over to Delhivery, we will share a tracking link with you.
            If you have not received tracking details within 48 hours of your order confirmation,
            please contact us at{" "}
            <a
              href="mailto:printandpeel@gmail.com"
              className="font-extrabold text-accent underline"
            >
              printandpeel@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">6. Incomplete or Incorrect Addresses</h2>
          <p className="font-medium text-muted-foreground">
            Please ensure your shipping address is complete and accurate at the time of ordering.
            PRINT&amp;PEEL is not responsible for delays or failed deliveries caused by incorrect
            addresses. If a package is returned to us due to an incorrect address, additional
            shipping charges may apply for re-dispatch.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">7. Contact</h2>
          <p className="font-medium text-muted-foreground">
            For any shipping-related queries, email us at{" "}
            <a
              href="mailto:printandpeel@gmail.com"
              className="font-extrabold text-accent underline"
            >
              printandpeel@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
