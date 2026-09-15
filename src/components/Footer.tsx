import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/config";
import { complaintMessage, enquiryMessage, openWhatsApp } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t-4 border-ink bg-ink px-5 pt-16 pb-10 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="display mb-2 text-[15vw] leading-[0.8] tracking-tighter sm:text-[90px]">
          PRINT
          <span className="text-accent">&amp;</span>
          PEEL
        </p>
        <p className="mb-12 font-mono text-[10px] tracking-[0.25em] uppercase text-white/50">
          {BRAND.tagline}
        </p>

        <div className="mb-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="font-mono text-[10px] tracking-widest uppercase text-neon-blue">Shop</p>
            <Link to="/" className="block text-sm font-extrabold uppercase">
              Home
            </Link>
            <Link to="/stickers" className="block text-sm font-extrabold uppercase">
              Stickers
            </Link>
            <Link to="/posters" className="block text-sm font-extrabold uppercase">
              Posters
            </Link>
            <Link to="/custom" className="block text-sm font-extrabold uppercase">
              Custom
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[10px] tracking-widest uppercase text-neon-green">More</p>
            <Link to="/setups" className="block text-sm font-extrabold uppercase">
              Stickered Setups
            </Link>
            <Link to="/about" className="block text-sm font-extrabold uppercase">
              About
            </Link>
            <Link to="/faq" className="block text-sm font-extrabold uppercase">
              FAQ
            </Link>
            <Link to="/wishlist" className="block text-sm font-extrabold uppercase">
              Wishlist
            </Link>
          </div>
          <div className="col-span-2 space-y-3 sm:col-span-1">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent">Support</p>
            <button
              type="button"
              onClick={() => openWhatsApp(enquiryMessage())}
              className="w-full border-2 border-white/25 py-3 font-mono text-[10px] font-extrabold tracking-widest uppercase hover:border-neon-green hover:text-neon-green"
            >
              Enquire on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => openWhatsApp(complaintMessage())}
              className="w-full border-2 border-white/25 py-3 font-mono text-[10px] font-extrabold tracking-widest uppercase hover:border-accent hover:text-accent"
            >
              Complaint / Support
            </button>
            <Link
              to="/cart"
              className="block w-full bg-neon-green py-3 text-center font-mono text-[10px] font-extrabold tracking-widest uppercase text-ink"
            >
              WhatsApp Order
            </Link>
          </div>
        </div>

        <p className="border-t border-white/15 pt-8 font-mono text-[9px] tracking-widest uppercase text-white/35">
          © {new Date().getFullYear()} PRINT&amp;PEEL
        </p>
      </div>
    </footer>
  );
}
