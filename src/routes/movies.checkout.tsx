import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { arena, useArena, makeId, type Booking } from "@/lib/arena-store";
import { SummaryRow } from "./gaming.booking";

export const Route = createFileRoute("/movies/checkout")({
  head: () => ({ meta: [{ title: "Movie Checkout — ArenaVerse" }] }),
  component: MovieCheckout,
});

const METHODS = [
  { id: "upi", label: "UPI", icon: "📲" },
  { id: "razorpay", label: "Razorpay", icon: "💳" },
  { id: "paytm", label: "Paytm", icon: "🅿️" },
  { id: "stripe", label: "Stripe", icon: "💠" },
  { id: "card", label: "Card", icon: "💳" },
  { id: "counter", label: "Cash Counter", icon: "🏦" },
];

function MovieCheckout() {
  const nav = useNavigate();
  const draft = useArena((s) => s.draft);
  const user = useArena((s) => s.user);
  const [method, setMethod] = useState("upi");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  if (!draft.pricing || !user || draft.type !== "movie") {
    return <ArenaShell><GlassCard><p className="text-sm text-muted-foreground">No draft. <Link to="/movies/seats" className="text-neon-cyan">Pick seats</Link>.</p></GlassCard></ArenaShell>;
  }

  function pay() {
    setStatus("processing");
    setTimeout(() => {
      if (method === "counter") return finalize("success");
      finalize(Math.random() > 0.08 ? "success" : "failed");
    }, 1400);
  }
  function finalize(s: "success" | "failed") {
    if (s === "failed") return setStatus("failed");
    const b: Booking = {
      id: makeId("BK"), passId: makeId("PASS"),
      type: "movie", title: draft.title!,
      date: draft.date!, time: draft.time!,
      seats: draft.seats, food: draft.food ?? [],
      pricing: draft.pricing!,
      payment: { method, status: "success", ref: makeId("TXN") },
      createdAt: new Date().toISOString(),
    };
    arena.commitBooking(b);
    setStatus("success");
    setTimeout(() => nav({ to: "/pass" }), 900);
  }

  return (
    <ArenaShell title="Checkout">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <GlassCard>
          <h2 className="font-display text-lg font-black">Choose payment method</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`rounded-xl border px-4 py-4 text-left transition ${method===m.id ? "border-neon-purple glow-purple bg-neon-purple/10" : "border-border hover:border-neon-cyan/40"}`}>
                <div className="text-2xl">{m.icon}</div>
                <div className="mt-1 text-sm font-semibold">{m.label}</div>
              </button>
            ))}
          </div>
          <button disabled={status==="processing"} onClick={pay} className="btn-primary mt-6 w-full disabled:opacity-60">
            {status === "processing" ? "Processing…" :
             status === "success" ? "✓ Paid — generating ticket…" :
             status === "failed" ? "Retry payment" :
             `Pay ₹${draft.pricing.total}`}
          </button>
          {status === "failed" && <p className="mt-3 text-sm text-destructive">Payment failed. Try another method.</p>}
        </GlassCard>

        <aside>
          <GlassCard>
            <h3 className="font-display text-lg font-black">Order summary</h3>
            <p className="mt-1 text-xs text-muted-foreground">{draft.title} · {draft.date} · {draft.time}</p>
            <p className="mt-1 text-xs">Seats: <span className="text-neon-cyan font-semibold">{draft.seats?.join(", ")}</span></p>
            <div className="my-3 h-px bg-border" />
            <SummaryRow k="Seats" v={`₹${draft.pricing.base}`} />
            <SummaryRow k="Food" v={`₹${draft.pricing.food}`} />
            <SummaryRow k="Discount" v={`− ₹${draft.pricing.discount}`} muted />
            <SummaryRow k="GST 18%" v={`₹${draft.pricing.tax}`} muted />
            <div className="my-3 h-px bg-border" />
            <SummaryRow k="Total" v={`₹${draft.pricing.total}`} big />
          </GlassCard>
        </aside>
      </div>
    </ArenaShell>
  );
}
