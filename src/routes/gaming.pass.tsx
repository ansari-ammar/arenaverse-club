import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/gaming/pass")({
  head: () => ({ meta: [{ title: "Gaming Pass — ArenaVerse" }] }),
  component: GamingPass,
});

function GamingPass() {
  const bookings = useArena((s) => s.bookings);
  const user = useArena((s) => s.user);
  const gaming = bookings.filter(b => b.type === "gaming");
  const latest = gaming[0];
  const [reveal, setReveal] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => { const t = setTimeout(() => setReveal(true), 350); return () => clearTimeout(t); }, []);

  if (!latest) {
    return <ArenaShell title="Gaming Pass"><GlassCard>
      <p className="text-sm text-muted-foreground">No gaming bookings yet. <Link to="/gaming/booking" className="text-neon-cyan">Book a session →</Link></p>
    </GlassCard></ArenaShell>;
  }

  const passNode = (
    <div className="relative" onClick={() => full && setFull(false)}>
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-cyan opacity-70 blur-2xl animate-pulse" />
      <div className="relative glass rounded-3xl p-8 overflow-hidden animate-[fadeIn_0.6s_ease]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-gold" />
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-neon-purple/30 blur-3xl" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue glow-purple font-display font-black text-lg">A</div>
            <div>
              <div className="font-display text-base font-black tracking-widest neon-text">ARENAVERSE</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-neon-gold">Gaming Pass · Premium</div>
            </div>
          </div>
          <span className="rounded-full bg-neon-cyan/20 px-3 py-1 text-[10px] uppercase tracking-wider text-neon-cyan">{latest.payment.status==="success"?"Active":"Pending"}</span>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Game</div>
              <div className="font-display text-3xl font-black">{latest.title}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Detail k="Player" v={user?.name ?? "Guest"} />
              <Detail k="Pass ID" v={latest.passId} />
              <Detail k="Booking #" v={latest.id} />
              <Detail k="Console" v={latest.console ?? "—"} />
              <Detail k="Date" v={latest.date} />
              <Detail k="Slot" v={latest.time} />
              <Detail k="Duration" v={latest.duration ?? "—"} />
              <Detail k="Amount" v={`₹${latest.pricing.total}`} />
            </div>
          </div>

          <div className={`mx-auto self-center transition-all duration-700 ${reveal?"opacity-100 scale-100 blur-0":"opacity-0 scale-90 blur-md"}`}>
            <div className="rounded-2xl bg-white p-3">
              <QRCode value={JSON.stringify({ p: latest.passId, b: latest.id, t: "gaming" })} size={170} bgColor="#ffffff" fgColor="#0a0014" />
            </div>
            <p className="mt-2 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scan at Arena</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (full) {
    return <div className="fixed inset-0 z-50 grid place-items-center bg-background/95 backdrop-blur-2xl p-6">
      <div className="w-full max-w-lg">{passNode}</div>
      <button onClick={() => setFull(false)} className="mt-6 rounded-full glass px-5 py-2 text-xs">Close fullscreen</button>
    </div>;
  }

  return (
    <ArenaShell title="Your Gaming Pass">
      <div className="mx-auto max-w-lg">
        {passNode}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button onClick={() => window.print()} className="rounded-full glass py-3 text-xs hover:border-neon-cyan/60">⬇ Download / Print</button>
          <button onClick={() => setFull(true)} className="rounded-full glass py-3 text-xs hover:border-neon-cyan/60">⛶ Fullscreen</button>
          <button onClick={async () => { try { await navigator.share?.({ title: "ArenaVerse Gaming Pass", text: `Pass ${latest.passId} — ${latest.title}`, url: location.href }); } catch {} }} className="rounded-full glass py-3 text-xs hover:border-neon-cyan/60">↗ Share</button>
          <button onClick={() => alert("Added to Wallet (demo)")} className="rounded-full bg-gradient-to-r from-neon-purple to-neon-blue py-3 text-xs glow-purple">📱 Add to Wallet</button>
          <Link to="/receipt" className="rounded-full glass py-3 text-center text-xs hover:border-neon-cyan/60">View Receipt</Link>
          <Link to="/gaming/booking" className="rounded-full glass py-3 text-center text-xs hover:border-neon-cyan/60">Book Again</Link>
        </div>

        {gaming.length > 1 && (
          <div className="mt-10">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">Past gaming passes</h3>
            <div className="mt-3 space-y-2">
              {gaming.slice(1).map(b => (
                <div key={b.id} className="flex items-center justify-between glass rounded-xl px-4 py-3 text-sm">
                  <div><div className="font-semibold">{b.title}</div><div className="text-xs text-muted-foreground">{b.date} · {b.time} · {b.passId}</div></div>
                  <span className="text-xs text-neon-cyan">₹{b.pricing.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ArenaShell>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div><div className="mt-0.5 font-semibold truncate">{v}</div></div>;
}
