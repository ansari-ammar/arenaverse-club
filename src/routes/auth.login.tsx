import { createFileRoute, Link } from "@tanstack/react-router";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — ArenaVerse" }] }),
  component: AuthLogin,
});

function AuthLogin() {
  return (
    <ArenaShell title="Enter the ArenaVerse">
      <p className="text-muted-foreground -mt-4 mb-8">Choose how you want to sign in. Verification keeps your bookings & rewards safe.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/auth/university-login" className="group">
          <GlassCard className="h-full transition hover:border-neon-purple/60 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xl">🎓</span>
              <span className="rounded-full bg-neon-gold/15 px-3 py-1 text-[10px] uppercase tracking-wider text-neon-gold">Up to 25% off</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-black">University Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">For United University students & faculty. Use your UU ID to unlock student pricing, rewards and faster checkout.</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Student & faculty discounts", "Rewards access", "Priority booking", "Faster checkout"].map((p) => (
                <li key={p} className="flex items-center gap-2 text-muted-foreground"><span className="text-neon-cyan">✦</span>{p}</li>
              ))}
            </ul>
            <div className="mt-6 text-neon-cyan text-sm group-hover:translate-x-1 transition">Continue with UU ID →</div>
          </GlassCard>
        </Link>
        <Link to="/auth/guest-login" className="group">
          <GlassCard className="h-full transition hover:border-neon-cyan/60 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xl">👤</span>
              <span className="rounded-full bg-secondary px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">Standard pricing</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-black">Guest Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">Just visiting? Continue with your mobile or email — we'll send you a one-time code to verify.</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Mobile OR email login", "Instant OTP verification", "Book gaming & cinema", "Digital QR passes"].map((p) => (
                <li key={p} className="flex items-center gap-2 text-muted-foreground"><span className="text-neon-cyan">✦</span>{p}</li>
              ))}
            </ul>
            <div className="mt-6 text-neon-cyan text-sm group-hover:translate-x-1 transition">Continue as Guest →</div>
          </GlassCard>
        </Link>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By signing in you agree to ArenaVerse's terms. Founded by <span className="text-neon-gold">Ammar Ansari</span> · United University, Prayagraj
      </p>
    </ArenaShell>
  );
}
