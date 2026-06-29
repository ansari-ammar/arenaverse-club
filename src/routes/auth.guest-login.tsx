import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { arena } from "@/lib/arena-store";

export const Route = createFileRoute("/auth/guest-login")({
  head: () => ({ meta: [{ title: "Guest Login — ArenaVerse" }] }),
  component: GuestLogin,
});

function GuestLogin() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"mobile" | "email">("mobile");
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "mobile" && !/^\d{10}$/.test(val)) return setErr("Enter 10-digit mobile");
    if (mode === "email" && !/^\S+@\S+\.\S+$/.test(val)) return setErr("Enter a valid email");
    arena.startLogin("guest", val);
    nav({ to: "/auth/verify-otp" });
  }

  return (
    <ArenaShell title="Guest Login">
      <div className="mx-auto max-w-md">
        <GlassCard>
          <h2 className="font-display text-2xl font-black">Continue as Guest</h2>
          <p className="mt-1 text-sm text-muted-foreground">Standard pricing applies. Get full booking & QR pass access.</p>

          <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-secondary/60 p-1">
            {(["mobile", "email"] as const).map((m) => (
              <button key={m} type="button" onClick={() => { setMode(m); setVal(""); setErr(""); }}
                className={`rounded-full py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  mode === m ? "bg-gradient-to-r from-neon-purple to-neon-blue text-foreground glow-purple" : "text-muted-foreground"
                }`}>
                {m === "mobile" ? "📱 Mobile" : "✉️ Email"}
              </button>
            ))}
          </div>

          <form className="mt-5 space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{mode === "mobile" ? "Mobile Number" : "Email Address"}</span>
              <input value={val}
                onChange={(e) => setVal(mode === "mobile" ? e.target.value.replace(/\D/g, "").slice(0,10) : e.target.value)}
                placeholder={mode === "mobile" ? "9876543210" : "you@example.com"}
                className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30" />
            </label>
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button className="btn-primary w-full">Send OTP</button>
          </form>

          <div className="mt-5 text-center text-xs text-muted-foreground">
            UU student? <Link to="/auth/university-login" className="text-neon-cyan hover:underline">University login</Link>
          </div>
        </GlassCard>
      </div>
    </ArenaShell>
  );
}
