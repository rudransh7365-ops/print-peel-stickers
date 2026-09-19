import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchOverlay } from "./SearchOverlay";
import { useStore } from "@/lib/store";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/stickers", label: "Stickers" },
  { to: "/posters", label: "Posters" },
  { to: "/custom", label: "Custom" },
  { to: "/setups", label: "Stickered Setups" },
  { to: "/about", label: "About" },
  { to: "/orders", label: "Orders" },
] as const;

const MARQUEE = [
  "PREMIUM LAMINATED VINYL",
  "FREE DELIVERY FROM ₹180",
  "WATER + SCRATCH RESISTANT",
  "ORDER ON WHATSAPP",
];

export function Navbar() {
  const { count } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="overflow-hidden border-b-2 border-ink bg-ink py-1.5 text-neon-green">
        <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-[10px] font-extrabold tracking-tight uppercase">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex">
              {MARQUEE.map((m) => (
                <span key={m} className="mx-4">
                  {m} <span className="opacity-40">•</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b-4 border-ink bg-white/95 backdrop-blur transition-[padding] ${
          compact ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
          <Link
            to="/"
            className={`display shrink-0 leading-none tracking-tighter transition-[font-size] ${compact ? "text-2xl" : "text-3xl"}`}
            aria-label="PRINT&PEEL home"
          >
            PRINT<span className="text-accent">&amp;</span>PEEL
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-accent" }}
                className="font-mono text-[11px] font-extrabold tracking-widest uppercase hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid size-10 place-items-center border-2 border-ink bg-neon-blue hard-shadow-sm press"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>
            <Link
              to="/profile"
              aria-label="Profile"
              className="hidden size-10 place-items-center border-2 border-ink bg-white hard-shadow-sm press sm:grid"
            >
              <UserRound className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden size-10 place-items-center border-2 border-ink bg-white hard-shadow-sm press sm:grid"
            >
              <Heart className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="block border-b-2 border-ink/10 px-5 py-4 font-display text-2xl uppercase"
            >
              Profile
            </Link>
            <Link
              to="/cart"
              aria-label={`Cart, ${count} items`}
              className="relative grid size-10 place-items-center border-2 border-ink bg-accent text-accent-foreground hard-shadow-sm press"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 grid size-5 place-items-center border-2 border-ink bg-neon-green font-mono text-[9px] font-extrabold text-ink">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center border-2 border-ink bg-white hard-shadow-sm press lg:hidden"
            >
              {menuOpen ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav aria-label="Mobile" className="border-t-4 border-ink bg-white lg:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="block border-b-2 border-ink/10 px-5 py-4 font-display text-2xl uppercase"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-4 font-display text-2xl uppercase"
            >
              Wishlist
            </Link>
          </nav>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
