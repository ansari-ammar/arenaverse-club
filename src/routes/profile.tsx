import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { arena, useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — ArenaVerse" }] }),
  component: Profile,
});

function Profile() {
  const nav = useNavigate();
  const user = useArena((s) => s.user);
  const bookings = useArena((s) => s.bookings);

  useEffect(() => { if (!user) nav({ to: "/auth/login" }); }, [user, nav]);
  if (!user) return null;

  const totalSpent = bookings.reduce((s,b) => s + b.pricing.total, 0);

  return (
    <ArenaShell title="My Profile">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <GlassCard>
          <div className="flex flex-col items-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-neon-purple to-neon-blue glow-purple font-display text-3xl font-black">{user.name[0]?.toUpperCase()}</div>
            <h2 className="mt-4 font-display text-xl font-black">{user.name}</h2>
            <p className="text-xs text-muted-foreground">{user.contact}</p>
            <span className={`mt-3 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${user.type==="university"?"bg-neon-gold/20 text-neon-gold":"bg-secondary text-muted-foreground"}`}>
              {user.type==="university" ? `UU Student · ${user.discountPct}% off` : "Guest"}
            </span>
            {user.uuid && <p className="mt-2 text-xs text-muted-foreground">UU ID · {user.uuid}</p>}
          </div>
          <div className="my-5 h-px bg-border" />
          <div className="grid grid-cols-2 gap-3 text-center">
            <Stat label="Bookings" value={bookings.length} />
            <Stat label="Spent" value={`₹${totalSpent}`} />
          </div>
          <div className="mt-5 space-y-2">
            <Link to="/pass" className="block rounded-full glass py-2 text-center text-xs hover:border-neon-cyan/60">My Passes</Link>
            <Link to="/support" className="block rounded-full glass py-2 text-center text-xs hover:border-neon-cyan/60">Support</Link>
            <button onClick={() => { arena.logout(); nav({ to: "/" }); }} className="block w-full rounded-full border border-destructive/50 py-2 text-center text-xs text-destructive hover:bg-destructive/10">Logout</button>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-display text-lg font-black">Booking History</h3>
          {bookings.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No bookings yet. <Link to="/booking" className="text-neon-cyan">Start now →</Link></p>
          ) : (
            <div className="mt-4 space-y-2">
              {bookings.map(b => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3 text-sm">
                  <div>
                    <div className="font-semibold">{b.title} <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">{b.type}</span></div>
                    <div className="text-xs text-muted-foreground">{b.date} · {b.time} · {b.passId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-neon-cyan">₹{b.pricing.total}</div>
                    <Link to={b.type==="gaming"?"/gaming/pass":"/pass"} className="text-[11px] text-neon-cyan hover:underline">View pass →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </ArenaShell>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-background/40 p-3"><div className="font-display text-xl font-black neon-text">{value}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div></div>;
}
