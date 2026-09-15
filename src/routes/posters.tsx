import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/CatalogPage";

export const Route = createFileRoute("/posters")({
  head: () => ({
    meta: [
      { title: "Posters — PRINT&PEEL" },
      {
        name: "description",
        content:
          "Premium matte posters in 1/4 A4, 1/2 A4 and A4. Pick your size and order over WhatsApp.",
      },
      { property: "og:title", content: "Posters — PRINT&PEEL" },
      {
        property: "og:description",
        content: "Premium matte posters in 1/4 A4, 1/2 A4 and A4 sizes.",
      },
    ],
  }),
  component: () => (
    <CatalogPage
      category="posters"
      title={
        <>
          WALL
          <br />
          POSTERS
        </>
      }
      kicker="1/4 A4 · 1/2 A4 · A4"
    />
  ),
});
