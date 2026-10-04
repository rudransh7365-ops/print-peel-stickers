import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — PRINT&PEEL" },
      {
        name: "description",
        content:
          "How PRINT&PEEL collects, uses and protects your personal data for order fulfillment and delivery.",
      },
      { property: "og:title", content: "Privacy Policy — PRINT&PEEL" },
      {
        property: "og:description",
        content: "How PRINT&PEEL collects, uses and protects your personal data.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">
        Legal
      </p>
      <h1 className="mb-8 text-5xl sm:text-6xl">Privacy Policy</h1>
      <p className="mb-6 text-sm font-medium text-muted-foreground">
        Last updated: October 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-extrabold">1. Information We Collect</h2>
          <p className="font-medium text-muted-foreground">
            When you place an order with PRINT&amp;PEEL, we collect the following personal
            information necessary for order fulfillment and delivery:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 font-medium text-muted-foreground">
            <li>Full name (customer_name)</li>
            <li>Phone number (phone_no)</li>
            <li>Email address (email)</li>
            <li>Shipping address (address)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">2. How We Use Your Information</h2>
          <p className="font-medium text-muted-foreground">
            Your data is collected strictly for the purpose of processing and fulfilling your
            orders. This includes confirming your order, printing and packaging your items, and
            shipping them to your address. We may also use your phone number or email to contact
            you regarding your order status or if there are any issues with your delivery.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">3. Data Storage &amp; Security</h2>
          <p className="font-medium text-muted-foreground">
            Your order information is stored securely in our database hosted on Supabase, a
            managed PostgreSQL platform with industry-standard encryption and access controls.
            We do not store payment card details — all transactions are processed through
            secure third-party payment gateways.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">4. Third-Party Logistics</h2>
          <p className="font-medium text-muted-foreground">
            To deliver your orders, we share your name, phone number and shipping address with
            Delhivery, our third-party logistics partner. This information is shared solely for
            the purpose of delivering your package to your doorstep. Delhivery handles your data
            in accordance with their own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">5. What We Don&apos;t Do</h2>
          <ul className="list-disc space-y-1 pl-5 font-medium text-muted-foreground">
            <li>We do not sell or rent your personal data to anyone.</li>
            <li>We do not use your data for unsolicited marketing or spam.</li>
            <li>We do not share your data with any party other than what is required to fulfill your order.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">6. Your Rights</h2>
          <p className="font-medium text-muted-foreground">
            You have the right to request access to, correction of, or deletion of your personal
            data at any time. To exercise these rights, contact us at printandpeel@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">7. Contact</h2>
          <p className="font-medium text-muted-foreground">
            If you have any questions about this Privacy Policy or how we handle your data, email
            us at{" "}
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
