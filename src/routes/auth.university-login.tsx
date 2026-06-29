import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { arena } from "@/lib/arena-store";

export const Route = createFileRoute("/auth/university-login")({
  head: () => ({ meta: [{ title: "University Login — ArenaVerse" }] }),
  component: UniLogin,
});

function UniLogin() {
  const nav = useNavigate();
  const [uuid, setUuid] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^UU\d{4,}$/i.test(uuid)) return setErr("UU ID format: UU2024XXXX");
    if (!/^\d{10}$/.test(mobile)) return setErr("Enter a valid 10-digit mobile number");
    arena.startLogin("university", mobile, uuid.toUpperCase());
    nav({ to: "/auth/verify-otp" });
  }

  return (
    <ArenaShell title="University Login">
      <div className="mx-auto max-w-md">
        <GlassCard>
          <span className="rounded-full bg-neon-gold/15 px-3 py-1 text-[10px] uppercase tracking-wider text-neon-gold">United University · Verified</span>
          <h2 className="mt-3 font-display text-2xl font-black">Sign in with UU ID</h2>
          <p className="mt-1 text-sm text-muted-foreground">We'll send a 6-digit OTP to your registered mobile.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <Field label="University ID" value={uuid} onChange={setUuid} placeholder="UU2024XXXX" />
            <Field label="Mobile Number" value={mobile} onChange={(v) => setMobile(v.replace(/\D/g, "").slice(0,10))} placeholder="9876543210" />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button className="btn-primary w-full">Send OTP</button>
          </form>
          <div className="mt-5 text-center text-xs text-muted-foreground">
            Not a student? <Link to="/auth/guest-login" className="text-neon-cyan hover:underline">Guest login</Link>
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
