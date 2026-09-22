import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/CatalogPage";

export const Route = createFileRoute("/posters")({
  head: () => ({
    meta: [
      { title: "Self-Adhesive Posters — PRINT&PEEL" },
      {
        name: "description",
        content:
          "Premium self-adhesive matte posters in 1/4 A4, 1/2 A4 and full A4. Pick your size and order over WhatsApp.",
      },
      { property: "og:title", content: "Self-Adhesive Posters — PRINT&PEEL" },
      {
        property: "og:description",
        content: "Premium self-adhesive matte posters in 1/4 A4, 1/2 A4 and full A4 sizes.",
      },
    ],
  }),
  component: () => (
    <CatalogPage
      category="posters"
      title={
        <>
          SELF-ADHESIVE
          <br />
          POSTERS
        </>
      }
      kicker="1/4 A4 · 1/2 A4 · FULL A4"
    />
  ),
});
