import { createFileRoute, Link } from "@tanstack/react-router";
import QRCode from "react-qr-code";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/pass")({
  head: () => ({ meta: [{ title: "Digital Pass — ArenaVerse" }] }),
  component: PassPage,
});

function PassPage() {
  const bookings = useArena((s) => s.bookings);
  const user = useArena((s) => s.user);

  if (bookings.length === 0) {
    return (
      <ArenaShell title="Your Pass">
        <GlassCard>
          <p className="text-sm text-muted-foreground">No bookings yet. <Link to="/booking" className="text-neon-cyan">Book your first experience →</Link></p>
        </GlassCard>
      </ArenaShell>
    );
  }

  const latest = bookings[0];

  return (
    <ArenaShell title="Your Digital Pass">
      <div className="mx-auto max-w-md">
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-cyan opacity-60 blur-xl animate-pulse" />
          <div className="relative glass rounded-3xl p-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none rounded-3xl border border-neon-purple/40" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue font-display font-black">A</div>
                <span className="font-display text-sm font-black tracking-widest neon-text">ARENAVERSE</span>
              </div>
              <span className="rounded-full bg-neon-cyan/20 px-3 py-1 text-[10px] uppercase tracking-wider text-neon-cyan">{latest.payment.status === "success" ? "Confirmed" : "Pending"}</span>
            </div>

            <div className="mt-5 text-xs text-muted-foreground uppercase tracking-[0.2em]">{latest.type === "movie" ? "Cinema Pass" : "Gaming Pass"}</div>
            <div className="mt-1 font-display text-2xl font-black">{latest.title}</div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <Detail k="Name" v={user?.name ?? "Guest"} />
              <Detail k="Pass ID" v={latest.passId} />
              <Detail k="Date" v={latest.date} />
              <Detail k="Time" v={latest.time} />
              {latest.type === "movie" ? (
                <Detail k="Seats" v={latest.seats?.join(", ") ?? "—"} />
              ) : (
                <>
                  <Detail k="Console" v={latest.console ?? "—"} />
                  <Detail k="Duration" v={latest.duration ?? "—"} />
                </>
              )}
              <Detail k="Booking" v={latest.id} />
              <Detail k="Amount" v={`₹${latest.pricing.total}`} />
            </div>

            <div className="my-5 flex justify-center">
              <div className="rounded-2xl bg-white p-3 animate-[fadeIn_0.6s_ease]">
                <QRCode value={JSON.stringify({ p: latest.passId, b: latest.id, t: latest.type })} size={160} bgColor="#ffffff" fgColor="#0a0014" />
              </div>
            </div>

            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scan at entry · Non-transferable</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link to="/receipt" className="rounded-full border border-border py-2 text-center text-xs hover:border-neon-cyan/60">View receipt</Link>
              <button onClick={() => window.print()} className="rounded-full border border-border py-2 text-xs hover:border-neon-cyan/60">Print / Save PDF</button>
              <button onClick={async () => {
                try { await navigator.share?.({ title: "ArenaVerse Pass", text: `Pass ${latest.passId} — ${latest.title}`, url: location.href }); }
                catch {}
              }} className="rounded-full border border-border py-2 text-xs hover:border-neon-cyan/60">Share</button>
              <button onClick={() => alert("Add to Wallet (demo)")} className="rounded-full bg-gradient-to-r from-neon-purple to-neon-blue py-2 text-xs glow-purple">Add to Wallet</button>
            </div>
          </div>
        </div>

        {bookings.length > 1 && (
          <div className="mt-10">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">Past passes</h3>
            <div className="mt-3 space-y-2">
              {bookings.slice(1).map(b => (
                <div key={b.id} className="flex items-center justify-between glass rounded-xl px-4 py-3 text-sm">
                  <div>
                    <div className="font-semibold">{b.title}</div>
                    <div className="text-xs text-muted-foreground">{b.date} · {b.time} · {b.passId}</div>
                  </div>
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
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 font-semibold truncate">{v}</div>
    </div>
  );
}
