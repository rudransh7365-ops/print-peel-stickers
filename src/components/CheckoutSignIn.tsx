import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function CheckoutSignIn() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const field = "w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-bold outline-none focus:border-accent";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setBusy(true);
    const { data, error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/checkout` } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up" && !data.session) toast.success("Check your email to confirm your account, then sign in.");
    else toast.success("Signed in");
  };

  return (
    <section className="mb-10 border-4 border-ink bg-white p-5 hard-shadow" aria-labelledby="signin-title">
      <h2 id="signin-title" className="mb-1 text-2xl uppercase">{mode === "in" ? "Sign in to check out" : "Create your account"}</h2>
      <p className="mb-4 text-sm font-bold">Sign in so we can find your exact address on Google Maps.</p>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} autoComplete={mode === "in" ? "current-password" : "new-password"} />
        <button type="submit" disabled={busy} className="border-4 border-ink bg-accent px-5 py-3 font-display text-xl text-accent-foreground uppercase hard-shadow press disabled:opacity-60 sm:col-span-2">{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}</button>
      </form>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-3 font-mono text-[10px] font-extrabold tracking-widest uppercase underline">
        {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </section>
  );
}
