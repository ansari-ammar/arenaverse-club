import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { arena, useArena, makeId, type Booking } from "@/lib/arena-store";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment — ArenaVerse" }] }),
  component: PaymentPage,
});

const METHODS = [
  { id: "upi", label: "UPI", icon: "📲", note: "GPay · PhonePe · Paytm UPI" },
  { id: "razorpay", label: "Razorpay", icon: "💳", note: "Cards · Netbanking · Wallets" },
  { id: "paytm", label: "Paytm", icon: "🅿️", note: "Paytm Wallet" },
  { id: "stripe", label: "Stripe", icon: "💠", note: "International cards" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", note: "Visa · Mastercard · Rupay" },
  { id: "counter", label: "Cash at Counter", icon: "🏦", note: "Pay on arrival" },
];

const SAVED = [
  { id: "saved-1", label: "HDFC •••• 4521", icon: "💳" },
  { id: "saved-2", label: "ammar@upi", icon: "📲" },
];

function PaymentPage() {
  const nav = useNavigate();
  const draft = useArena((s) => s.draft);
  const user = useArena((s) => s.user);
  const [method, setMethod] = useState("upi");
  const [status, setStatus] = useState<"idle"|"processing"|"success"|"failed">("idle");

  if (!draft.pricing || !user || !draft.type) {
    return <ArenaShell title="Payment"><GlassCard>
      <p className="text-sm text-muted-foreground">No active booking. <Link to="/booking" className="text-neon-cyan">Start a booking →</Link></p>
    </GlassCard></ArenaShell>;
  }

  function pay() {
    setStatus("processing");
    setTimeout(() => {
      if (method === "counter") return finalize("success");
      finalize(Math.random() > 0.08 ? "success" : "failed");
    }, 1500);
  }
  function finalize(s: "success"|"failed") {
    if (s === "failed") return setStatus("failed");
    const b: Booking = {
      id: makeId("BK"), passId: makeId("PASS"),
      type: draft.type!, title: draft.title!,
      date: draft.date!, time: draft.time!,
      duration: draft.duration, seats: draft.seats,
      game: draft.game, console: draft.console, players: draft.players,
      food: draft.food ?? [],
      pricing: draft.pricing!,
      payment: { method, status: "success", ref: makeId("TXN") },
      createdAt: new Date().toISOString(),
    };
    arena.commitBooking(b);
    setStatus("success");
    setTimeout(() => nav({ to: draft.type === "gaming" ? "/gaming/pass" : "/pass" }), 1100);
  }

  return (
    <ArenaShell title="Secure Checkout">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {SAVED.length > 0 && (
            <GlassCard>
              <h3 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">Saved methods</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SAVED.map(s => (
                  <button key={s.id} onClick={() => setMethod(s.id)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${method===s.id?"border-neon-cyan glow-cyan":"border-border hover:border-neon-cyan/40"}`}>
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-sm font-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="font-display text-lg font-black">Choose payment method</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`group rounded-2xl border p-5 text-left transition hover:-translate-y-1 ${method===m.id?"border-neon-purple glow-purple bg-neon-purple/10":"border-border hover:border-neon-cyan/40"}`}>
                  <div className="text-3xl">{m.icon}</div>
                  <div className="mt-2 font-display text-base font-black">{m.label}</div>
                  <div className="text-[11px] text-muted-foreground">{m.note}</div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              {status === "idle" && (
                <button onClick={pay} className="btn-primary w-full">Pay ₹{draft.pricing.total}</button>
              )}
              {status === "processing" && (
                <div className="rounded-2xl border border-neon-purple/40 bg-neon-purple/5 p-6 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-neon-purple border-t-transparent" />
                  <p className="mt-3 font-display text-sm uppercase tracking-wider text-neon-cyan">Processing payment…</p>
                </div>
              )}
              {status === "success" && (
                <div className="rounded-2xl border border-neon-cyan/60 bg-neon-cyan/5 p-6 text-center glow-cyan">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-neon-cyan/20 text-3xl">✓</div>
                  <p className="mt-3 font-display text-xl font-black neon-text">Payment Successful</p>
                  <p className="text-xs text-muted-foreground">Generating your pass…</p>
                </div>
              )}
              {status === "failed" && (
                <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-6 text-center">
                  <div className="text-3xl">⚠️</div>
                  <p className="mt-2 font-semibold">Payment Failed</p>
                  <p className="text-xs text-muted-foreground">Please try a different method.</p>
                  <button onClick={pay} className="btn-primary mt-4">Retry Payment</button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <GlassCard>
            <h3 className="font-display text-lg font-black">Order Summary</h3>
            <p className="mt-1 text-xs text-muted-foreground capitalize">{draft.type} · {draft.title}</p>
            <p className="text-xs text-muted-foreground">{draft.date} · {draft.time}{draft.duration?` · ${draft.duration}`:""}</p>
            {draft.seats?.length ? <p className="mt-1 text-xs">Seats: <span className="font-semibold text-neon-cyan">{draft.seats.join(", ")}</span></p> : null}
            {draft.console ? <p className="mt-1 text-xs">Console: <span className="font-semibold">{draft.console}</span></p> : null}
            {draft.food && draft.food.length > 0 && (
              <div className="mt-3 space-y-1 text-xs">
                {draft.food.map(f => <div key={f.name} className="flex justify-between text-muted-foreground"><span>{f.name} ×{f.qty}</span><span>₹{f.price*f.qty}</span></div>)}
              </div>
            )}
            <div className="my-3 h-px bg-border" />
            <Row k="Subtotal" v={`₹${draft.pricing.base + draft.pricing.food}`} />
            <Row k="Discount" v={`− ₹${draft.pricing.discount}`} muted />
            <Row k="GST 18%" v={`₹${draft.pricing.tax}`} muted />
            <div className="my-3 h-px bg-border" />
            <Row k="Total" v={`₹${draft.pricing.total}`} big />
            <p className="mt-3 text-[10px] text-muted-foreground">🔒 256-bit SSL encryption · PCI compliant</p>
          </GlassCard>
        </aside>
      </div>
    </ArenaShell>
  );
}

function Row({ k, v, muted, big }: { k: string; v: string; muted?: boolean; big?: boolean }) {
  return <div className={`flex justify-between ${big?"font-display text-xl font-black neon-text":"text-sm"} ${muted?"text-muted-foreground":""}`}><span>{k}</span><span>{v}</span></div>;
}
