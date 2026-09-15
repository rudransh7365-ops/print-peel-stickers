import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SectionHead({
  title,
  kicker,
  to,
  dark = false,
}: {
  title: ReactNode;
  kicker?: string;
  to?: "/stickers" | "/posters" | "/setups" | "/custom";
  dark?: boolean;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {kicker && (
          <p
            className={`mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase ${dark ? "text-neon-green" : "text-accent"}`}
          >
            {kicker}
          </p>
        )}
        <h2 className={`text-4xl sm:text-5xl ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      </div>
      {to && (
        <Link
          to={to}
          className={`shrink-0 border-b-4 border-accent pb-1 font-mono text-[10px] font-extrabold tracking-widest uppercase ${dark ? "text-white" : "text-ink"}`}
        >
          View all
        </Link>
      )}
    </div>
  );
}
