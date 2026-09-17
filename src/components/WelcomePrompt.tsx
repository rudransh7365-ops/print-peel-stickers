import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore, type CustomerProfile } from "@/lib/store";

const EMPTY: CustomerProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export function WelcomePrompt() {
  const { hydrated, profile, saveProfile } = useStore();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(EMPTY);

  useEffect(() => {
    if (!hydrated || sessionStorage.getItem("pp_welcome_seen")) return;
    setOpen(true);
  }, [hydrated]);

  if (!open) return null;
  const close = () => {
    sessionStorage.setItem("pp_welcome_seen", "1");
    setOpen(false);
  };
  const field =
    "w-full border-2 border-ink bg-white px-3 py-2 text-sm font-bold outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/70 p-4" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border-4 border-ink bg-paper p-5 hard-shadow">
        <button type="button" onClick={close} aria-label="Close" className="float-right grid size-9 place-items-center border-2 border-ink bg-white">
          <X className="size-4" aria-hidden="true" />
        </button>
        {profile ? (
          <div className="clear-both py-5 text-center">
            <h2 id="welcome-title" className="text-4xl">WELCOME BACK, {profile.firstName.toUpperCase()}</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link to="/stickers" onClick={close} className="border-4 border-ink bg-accent px-5 py-3 font-display text-xl uppercase hard-shadow press">Continue shopping</Link>
              <Link to="/orders" onClick={close} className="border-4 border-ink bg-white px-5 py-3 font-display text-xl uppercase hard-shadow press">View orders</Link>
              <Link to="/wishlist" onClick={close} className="border-4 border-ink bg-white px-5 py-3 font-display text-xl uppercase hard-shadow press">Wishlist</Link>
              <Link to="/custom" onClick={close} className="border-4 border-ink bg-neon-green px-5 py-3 font-display text-xl uppercase hard-shadow press">Create custom sticker</Link>
            </div>
          </div>
        ) : (
          <form className="clear-both" onSubmit={(event) => { event.preventDefault(); saveProfile(details); close(); }}>
            <h2 id="welcome-title" className="text-4xl">WELCOME TO PRINT&amp;PEEL</h2>
            <p className="mt-2 mb-5 text-sm font-bold text-muted-foreground">Save your details once for a faster checkout.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(EMPTY) as Array<keyof CustomerProfile>).map((key) => (
                <label key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                  <span className="mb-1 block font-mono text-[9px] font-extrabold tracking-widest uppercase">{key.replace(/([A-Z])/g, " $1")}</span>
                  <input required={key !== "email"} type={key === "email" ? "email" : "text"} value={details[key]} onChange={(event) => setDetails((prev) => ({ ...prev, [key]: event.target.value }))} className={field} />
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="submit" className="flex-1 border-4 border-ink bg-accent px-5 py-3 font-display text-xl uppercase hard-shadow press">Save details</button>
              <button type="button" onClick={close} className="border-4 border-ink bg-white px-5 py-3 font-mono text-[10px] font-extrabold tracking-widest uppercase hard-shadow press">Skip for now</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}