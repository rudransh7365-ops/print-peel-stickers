import { createFileRoute } from "@tanstack/react-router";
import { StickeredSetups } from "@/components/StickeredSetups";

export const Route = createFileRoute("/setups")({
  head: () => ({
    meta: [
      { title: "Stickered Setups — PRINT&PEEL" },
      {
        name: "description",
        content:
          "See how PRINT&PEEL sticker designs look on a laptop, bottle, notebook and wall before you order.",
      },
      { property: "og:title", content: "Stickered Setups — PRINT&PEEL" },
      {
        property: "og:description",
        content: "See how our sticker designs look on laptops, bottles, notebooks and walls.",
      },
    ],
  }),
  component: SetupsPage,
});

function SetupsPage() {
  return (
    <div className="bg-ink py-14 text-white">
      <div className="mx-auto max-w-7xl px-5">
        <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-neon-green">
          See how your stuff could look
        </p>
        <h1 className="mb-4 text-6xl sm:text-7xl">
          STICKERED
          <br />
          SETUPS
        </h1>
        <p className="mb-10 max-w-md text-sm font-bold text-white/60">
          Every design in these scenes is an actual PRINT&amp;PEEL product placed on the object.
          These are mockups, not customer photographs.
        </p>
      </div>
      <StickeredSetups />
    </div>
  );
}
