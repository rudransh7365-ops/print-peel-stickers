import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — PRINT&PEEL" },
      {
        name: "description",
        content:
          "Terms and conditions for using the PRINT&PEEL website, ordering products, and intellectual property rights.",
      },
      { property: "og:title", content: "Terms & Conditions — PRINT&PEEL" },
      {
        property: "og:description",
        content: "Terms and conditions for using the PRINT&PEEL website.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
        Legal
      </p>
      <h1 className="mb-8 text-5xl sm:text-6xl">Terms &amp; Conditions</h1>
      <p className="mb-6 text-sm font-medium text-muted-foreground">
        Last updated: October 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-extrabold">1. Acceptance of Terms</h2>
          <p className="font-medium text-muted-foreground">
            By accessing or using the PRINT&amp;PEEL website, you agree to be bound by these
            Terms &amp; Conditions. If you do not agree with any part of these terms, please do
            not use our website or place orders.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">2. Website Usage</h2>
          <ul className="list-disc space-y-1 pl-5 font-medium text-muted-foreground">
            <li>You must provide accurate and complete information when placing an order.</li>
            <li>You are responsible for ensuring the shipping address is correct before confirming your order.</li>
            <li>You may not use our website for any unlawful or fraudulent purpose.</li>
            <li>We reserve the right to refuse or cancel any order at our discretion.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">3. Intellectual Property &amp; Design Copyright</h2>
          <p className="font-medium text-muted-foreground">
            All designs, artwork, logos, graphics, and content on the PRINT&amp;PEEL website are
            the intellectual property of PRINT&amp;PEEL or our licensed partners. You may not
            reproduce, copy, distribute, or use any designs without our written permission.
          </p>
          <p className="mt-3 font-medium text-muted-foreground">
            For custom orders, you confirm that you own the rights to any artwork you upload or
            that you have permission to use it. PRINT&amp;PEEL is not liable for copyright
            infringement arising from customer-submitted designs. We reserve the right to refuse
            to print any design that we believe infringes on third-party intellectual property
            rights.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">4. Order Processing</h2>
          <ul className="list-disc space-y-1 pl-5 font-medium text-muted-foreground">
            <li>Orders are dispatched within 24–48 hours of confirmation.</li>
            <li>Every order is confirmed personally before it goes to print.</li>
            <li>Order confirmation is subject to payment verification and stock availability.</li>
            <li>Once an order goes to print, it cannot be modified or cancelled.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">5. Pricing &amp; Payment</h2>
          <p className="font-medium text-muted-foreground">
            All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes. We
            reserve the right to change prices at any time without prior notice. Prices charged at
            the time of order confirmation are final for that order.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">6. Limitation of Liability</h2>
          <p className="font-medium text-muted-foreground">
            PRINT&amp;PEEL shall not be liable for any indirect, incidental, or consequential
            damages arising from the use of our products or website. Our maximum liability for any
            order is limited to the amount paid by the customer for that order.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">7. Changes to These Terms</h2>
          <p className="font-medium text-muted-foreground">
            We may update these Terms &amp; Conditions from time to time. Any changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">8. Contact</h2>
          <p className="font-medium text-muted-foreground">
            Questions about these terms? Email us at{" "}
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
