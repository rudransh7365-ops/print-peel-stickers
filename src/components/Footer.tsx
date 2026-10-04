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

        <div className="mb-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="space-y-2">
            <p className="font-mono text-[10px] tracking-widest uppercase text-neon-blue">Shop</p>
            <Link to="/" className="block text-sm font-extrabold uppercase">
              Home
            </Link>
            <Link to="/stickers" className="block text-sm font-extrabold uppercase">
              Stickers
            </Link>
            <Link to="/posters" className="block text-sm font-extrabold uppercase">
              Self-Adhesive Posters
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
          <div className="space-y-2">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent">
              Legal &amp; Policies
            </p>
            <Link to="/privacy" className="block text-sm font-extrabold uppercase">
              Privacy Policy
            </Link>
            <Link to="/terms" className="block text-sm font-extrabold uppercase">
              Terms &amp; Conditions
            </Link>
            <Link to="/shipping" className="block text-sm font-extrabold uppercase">
              Shipping Policy
            </Link>
            <Link to="/refunds" className="block text-sm font-extrabold uppercase">
              Cancellation &amp; Refund
            </Link>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-[10px] tracking-widest uppercase text-neon-blue">Support</p>
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
              Place Order
            </Link>
            <a
              href="mailto:printandpeel@gmail.com"
              className="block text-[11px] font-extrabold uppercase text-white/60 hover:text-white"
            >
              printandpeel@gmail.com
            </a>
            <p className="text-[11px] font-medium text-white/40">
              Gwalior, Madhya Pradesh, India
            </p>
          </div>
        </div>

        <p className="border-t border-white/15 pt-8 font-mono text-[9px] tracking-widest uppercase text-white/35">
          © {new Date().getFullYear()} PRINT&amp;PEEL
        </p>
      </div>
    </footer>
  );
}
