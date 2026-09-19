import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, type CustomerProfile } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — PRINT&PEEL" },
      { name: "description", content: "Save your delivery details for faster PRINT&PEEL checkout." },
      { property: "og:title", content: "Your Profile — PRINT&PEEL" },
      { property: "og:description", content: "Save your delivery details for faster checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const EMPTY: CustomerProfile = { firstName: "", lastName: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", country: "India" };

function ProfilePage() {
  const { profile, saveProfile, hydrated } = useStore();
  const [details, setDetails] = useState(EMPTY);
  useEffect(() => { if (profile) setDetails(profile); }, [profile]);
  const field = "w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-bold outline-none focus:border-accent";

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mb-2 font-mono text-[10px] font-extrabold tracking-widest uppercase text-accent">Saved locally on this device</p>
      <h1 className="mb-10 text-6xl sm:text-7xl">YOUR PROFILE</h1>
      {hydrated && (
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); saveProfile(details); }}>
          {(Object.keys(EMPTY) as Array<keyof CustomerProfile>).map((key) => (
            <label key={key} className={key === "address" ? "sm:col-span-2" : ""}>
              <span className="mb-2 block font-mono text-[10px] font-extrabold tracking-widest uppercase">{key.replace(/([A-Z])/g, " $1")}</span>
              <input required={key !== "email"} type={key === "email" ? "email" : "text"} value={details[key]} onChange={(event) => setDetails((prev) => ({ ...prev, [key]: event.target.value }))} className={field} />
            </label>
          ))}
          <div className="mt-3 flex flex-wrap gap-3 sm:col-span-2">
            <button type="submit" className="flex-1 border-4 border-ink bg-accent px-6 py-4 font-display text-2xl text-accent-foreground uppercase hard-shadow press">Save details</button>
            <Link to="/orders" className="border-4 border-ink bg-white px-6 py-4 font-display text-2xl uppercase hard-shadow press">View orders</Link>
          </div>
        </form>
      )}
    </div>
  );
}