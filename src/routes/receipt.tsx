import { createFileRoute, Link } from "@tanstack/react-router";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/receipt")({
  head: () => ({ meta: [{ title: "Receipt — ArenaVerse" }] }),
  component: ReceiptPage,
});

function ReceiptPage() {
  const bookings = useArena((s) => s.bookings);
  const user = useArena((s) => s.user);
  const b = bookings[0];

  if (!b) {
    return <ArenaShell title="Receipt"><GlassCard><p className="text-sm text-muted-foreground">No receipt yet. <Link to="/booking" className="text-neon-cyan">Book first →</Link></p></GlassCard></ArenaShell>;
  }

  return (
    <ArenaShell title="Receipt">
      <div className="mx-auto max-w-2xl">
        <GlassCard>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <div className="font-display text-xl font-black neon-text">ARENAVERSE</div>
              <div className="text-xs text-muted-foreground">United University · Rawatpur · Prayagraj</div>
            </div>
            <div className="text-right text-xs">
              <div>Receipt #{b.id}</div>
              <div className="text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <Row k="Customer" v={user?.name ?? "Guest"} />
            <Row k="Contact" v={user?.contact ?? "—"} />
            <Row k="Experience" v={b.type === "movie" ? "Cinema" : "Gaming"} />
            <Row k="Title" v={b.title} />
            <Row k="Date / Time" v={`${b.date} · ${b.time}`} />
            {b.type === "movie"
              ? <Row k="Seats" v={b.seats?.join(", ") ?? "—"} />
              : <Row k="Setup" v={`${b.console} · ${b.duration} · ${b.players}P`} />}
            <Row k="Pass ID" v={b.passId} />
            <Row k="Txn Ref" v={b.payment.ref} />
          </div>

          <div className="mt-6 rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left p-3">Item</th><th className="text-right p-3">Amount</th></tr>
              </thead>
              <tbody>
                <tr className="border-t border-border"><td className="p-3">{b.type === "movie" ? "Seats" : "Game time"}</td><td className="p-3 text-right">₹{b.pricing.base}</td></tr>
                {b.food.map((f) => (
                  <tr key={f.name} className="border-t border-border"><td className="p-3">{f.name} × {f.qty}</td><td className="p-3 text-right">₹{f.price * f.qty}</td></tr>
                ))}
                <tr className="border-t border-border text-muted-foreground"><td className="p-3">Discount</td><td className="p-3 text-right">− ₹{b.pricing.discount}</td></tr>
                <tr className="border-t border-border text-muted-foreground"><td className="p-3">GST 18%</td><td className="p-3 text-right">₹{b.pricing.tax}</td></tr>
                <tr className="border-t border-border font-display font-black"><td className="p-3">Total Paid ({b.payment.method.toUpperCase()})</td><td className="p-3 text-right neon-text">₹{b.pricing.total}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Link to="/pass" className="rounded-full border border-border px-5 py-2 text-xs hover:border-neon-cyan/60">View Pass</Link>
            <button onClick={() => window.print()} className="rounded-full bg-gradient-to-r from-neon-purple to-neon-blue px-5 py-2 text-xs glow-purple">Download PDF</button>
          </div>

          <p className="mt-5 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Thank you for choosing ArenaVerse</p>
        </GlassCard>
      </div>
    </ArenaShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 font-semibold">{v}</div>
    </div>
  );
}
