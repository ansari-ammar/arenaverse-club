import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { GAMES, GAMING_SLOTS, GAMING_DURATIONS, FOOD } from "@/lib/arena-data";
import { arena, useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/gaming/booking")({
  head: () => ({ meta: [{ title: "Gaming Booking — ArenaVerse" }] }),
  component: GamingBooking,
});

const CONSOLES = ["PS5", "Xbox Series X", "PC Rig", "Racing Sim", "VR Pod"];

function GamingBooking() {
  const nav = useNavigate();
  const user = useArena((s) => s.user);
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState(GAMING_SLOTS[2]);
  const [duration, setDuration] = useState(GAMING_DURATIONS[1]);
  const [game, setGame] = useState(GAMES[0].id);
  const [consoleType, setConsoleType] = useState(CONSOLES[0]);
  const [players, setPlayers] = useState(2);
  const [foodQty, setFoodQty] = useState<Record<string, number>>({});

  const foodTotal = useMemo(
    () => FOOD.reduce((s, f) => s + (foodQty[f.name] ?? 0) * f.price, 0),
    [foodQty],
  );
  const baseGame = duration.price * Math.max(1, Math.ceil(players / 2));
  const subtotal = baseGame + foodTotal;
  const discountPct = user?.discountPct ?? 0;
  const discount = Math.round((subtotal * discountPct) / 100);
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + tax;

  function proceed() {
    if (!user) return nav({ to: "/auth/login" });
    arena.setDraft({
      type: "gaming",
      title: GAMES.find((g) => g.id === game)?.title ?? "Gaming Session",
      date, time: slot, duration: duration.label,
      game, console: consoleType, players,
      food: Object.entries(foodQty).filter(([,q]) => q > 0).map(([name, qty]) => {
        const f = FOOD.find(x => x.name === name)!; return { name, qty, price: f.price };
      }),
      pricing: { base: baseGame, food: foodTotal, tax, discount, total },
    });
    nav({ to: "/payment" });
  }

  return (
    <ArenaShell title="Gaming Booking">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Section title="1 · When">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Date</span>
                <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Duration</span>
                <select value={duration.value} onChange={(e) => setDuration(GAMING_DURATIONS.find(d => d.value === e.target.value)!)}
                  className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm">
                  {GAMING_DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label} · ₹{d.price}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Start time</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {GAMING_SLOTS.map(s => (
                  <button key={s} onClick={() => setSlot(s)}
                    className={`rounded-full border px-4 py-2 text-xs transition ${slot===s ? "border-neon-purple bg-neon-purple/20 text-foreground glow-purple" : "border-border text-muted-foreground hover:border-neon-cyan/40"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Section title="2 · Game & setup">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GAMES.map(g => (
                <button key={g.id} onClick={() => setGame(g.id)}
                  className={`group relative overflow-hidden rounded-xl border transition ${game===g.id ? "border-neon-purple glow-purple" : "border-border hover:border-neon-cyan/40"}`}>
                  <img src={g.img} alt={g.title} className="h-24 w-full object-cover" loading="lazy" />
                  <div className="bg-background/80 px-2 py-1.5 text-left text-xs font-semibold">{g.title}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Console</span>
                <select value={consoleType} onChange={(e) => setConsoleType(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm">
                  {CONSOLES.map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Players ({players})</span>
                <input type="range" min={1} max={6} value={players} onChange={(e) => setPlayers(+e.target.value)}
                  className="mt-4 w-full accent-neon-purple" />
              </label>
            </div>
          </Section>

          <Section title="3 · Add food (optional)">
            <div className="grid gap-3 sm:grid-cols-2">
              {FOOD.map(f => {
                const q = foodQty[f.name] ?? 0;
                return (
                  <div key={f.name} className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold">{f.name}</div>
                      <div className="text-xs text-muted-foreground">₹{f.price}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setFoodQty({ ...foodQty, [f.name]: Math.max(0, q-1) })} className="h-7 w-7 rounded-full border border-border">−</button>
                      <span className="w-6 text-center text-sm">{q}</span>
                      <button onClick={() => setFoodQty({ ...foodQty, [f.name]: q+1 })} className="h-7 w-7 rounded-full border border-neon-purple text-neon-cyan">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <GlassCard>
            <h3 className="font-display text-lg font-black">Live summary</h3>
            <SummaryRow k="Game time" v={`₹${baseGame}`} />
            <SummaryRow k="Food" v={`₹${foodTotal}`} />
            <SummaryRow k="Discount" v={`− ₹${discount}`} muted />
            <SummaryRow k="GST 18%" v={`₹${tax}`} muted />
            <div className="my-3 h-px bg-border" />
            <SummaryRow k="Total" v={`₹${total}`} big />
            <button onClick={proceed} className="btn-primary mt-5 w-full">{user ? "Proceed to payment" : "Sign in to continue"}</button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              {user?.type === "university" ? `UU student discount ${user.discountPct}% applied` : <>Sign in with <Link to="/auth/university-login" className="text-neon-cyan">UU ID</Link> for 20% off</>}
            </p>
          </GlassCard>
        </aside>
      </div>
    </ArenaShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard>
      <h2 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">{title}</h2>
      <div className="mt-4">{children}</div>
    </GlassCard>
  );
}

export function SummaryRow({ k, v, muted, big }: { k: string; v: string; muted?: boolean; big?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${big ? "text-lg font-display font-black" : "text-sm"} ${muted ? "text-muted-foreground" : ""}`}>
      <span>{k}</span><span className={big ? "neon-text" : ""}>{v}</span>
    </div>
  );
}
