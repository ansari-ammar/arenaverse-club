import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { arena } from "@/lib/arena-store";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Sign up — ArenaVerse" }] }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setErr("Enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email");
    if (!/^\d{10}$/.test(mobile)) return setErr("Enter 10-digit mobile");
    try { if (remember) localStorage.setItem("arena_remember_name", name); } catch {}
    arena.startLogin("guest", mobile);
    // store name to use after verify
    arena.set({ draft: { ...arena.get().draft } });
    sessionStorage.setItem("arena_pending_name", name);
    nav({ to: "/auth/verify" });
  }

  return (
    <ArenaShell title="Create your account">
      <div className="mx-auto max-w-md">
        <GlassCard>
          <h2 className="font-display text-2xl font-black">Join ArenaVerse</h2>
          <p className="mt-1 text-sm text-muted-foreground">Get instant access to bookings, passes & rewards.</p>
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <Field label="Full name" value={name} onChange={setName} placeholder="Ammar Ansari" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Mobile" value={mobile} onChange={(v) => setMobile(v.replace(/\D/g,"").slice(0,10))} placeholder="9876543210" />
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-neon-purple" />
              Remember me on this device
            </label>
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button className="btn-primary w-full">Send OTP & Continue</button>
          </form>
          <div className="mt-5 text-center text-xs text-muted-foreground">
            Already have an account? <Link to="/auth/login" className="text-neon-cyan hover:underline">Sign in</Link>
          </div>
        </GlassCard>
      </div>
    </ArenaShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30" />
    </label>
  );
}
