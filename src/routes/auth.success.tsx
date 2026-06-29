import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/auth/success")({
  head: () => ({ meta: [{ title: "Welcome — ArenaVerse" }] }),
  component: AuthSuccess,
});

function AuthSuccess() {
  const user = useArena((s) => s.user);
  const nav = useNavigate();
  useEffect(() => {
    if (!user) nav({ to: "/auth/login" });
    const t = setTimeout(() => nav({ to: "/" }), 3500);
    return () => clearTimeout(t);
  }, [user, nav]);

  return (
    <ArenaShell>
      <div className="mx-auto max-w-md">
        <GlassCard className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-neon-cyan/15 glow-cyan text-4xl">✓</div>
          <h2 className="mt-4 font-display text-3xl font-black neon-text">You're in.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to ArenaVerse{user ? `, ${user.name}` : ""}.
            {user?.type === "university" && <> Your <span className="text-neon-gold">{user.discountPct}% UU discount</span> is now active.</>}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="btn-primary">Book your experience</Link>
            <Link to="/" className="rounded-full px-5 py-3 text-sm glass hover:border-neon-cyan/40">Home</Link>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">Redirecting home in 3s…</p>
        </GlassCard>
      </div>
    </ArenaShell>
  );
}
