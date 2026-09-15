import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/CatalogPage";

export const Route = createFileRoute("/stickers")({
  head: () => ({
    meta: [
      { title: "Stickers — PRINT&PEEL" },
      {
        name: "description",
        content:
          "Browse anime, football, typography and minimal stickers. Premium laminated vinyl, water and scratch resistant.",
      },
      { property: "og:title", content: "Stickers — PRINT&PEEL" },
      {
        property: "og:description",
        content: "Anime, football, typography and minimal stickers on premium laminated vinyl.",
      },
    ],
  }),
  component: () => (
    <CatalogPage
      category="stickers"
      title={
        <>
          ALL
          <br />
          STICKERS
        </>
      }
      kicker="Peel & slap"
    />
  ),
});
