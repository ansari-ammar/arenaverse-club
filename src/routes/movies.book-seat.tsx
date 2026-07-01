import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { MOVIES, SHOWTIMES, FOOD } from "@/lib/arena-data";
import { arena, useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/movies/book-seat")({
  head: () => ({ meta: [{ title: "Book Seat — ArenaVerse" }] }),
  validateSearch: z.object({ id: z.string().optional() }),
  component: BookSeat,
});

const ROWS = ["A", "B", "C", "D", "E"] as const;
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const tier = (r: string) => r <= "B" ? "Premium" : r <= "D" ? "Standard" : "Economy";
const price = (r: string) => r <= "B" ? 280 : r <= "D" ? 200 : 150;

function BookSeat() {
  const nav = useNavigate();
  const { id } = Route.useSearch();
  const user = useArena((s) => s.user);
  const occupied = useArena((s) => s.occupiedSeats);
  const selected = useArena((s) => s.draft.seats ?? []);
  const today = new Date().toISOString().slice(0, 10);

  const initial = MOVIES.find(m => m.id === id) ?? MOVIES[0];
  const [movie, setMovie] = useState(initial);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(SHOWTIMES[2]);
  const [zoom, setZoom] = useState(1);
  const [foodQty, setFoodQty] = useState<Record<string, number>>({});
  const [hover, setHover] = useState<string | null>(null);

  // premium fixed: row A seats 4,5,6,7 are luxury recliners
  const isPremium = (s: string) => s[0] === "A" && [4,5,6,7].includes(Number(s.slice(1)));

  const seatBase = useMemo(() => selected.reduce((s, id) => s + (isPremium(id) ? 360 : price(id[0])), 0), [selected]);
  const foodTotal = useMemo(() => FOOD.reduce((s, f) => s + (foodQty[f.name] ?? 0) * f.price, 0), [foodQty]);
  const subtotal = seatBase + foodTotal;
  const discountPct = user?.discountPct ?? 0;
  const discount = Math.round((subtotal * discountPct) / 100);
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + tax;
  const seatsLeft = 50 - occupied.length;

  function continueToPay() {
    if (!user) return nav({ to: "/auth/login" });
    if (selected.length === 0) return;
    arena.setDraft({
      type: "movie", title: movie.title, date, time,
      seats: selected,
      food: Object.entries(foodQty).filter(([,q]) => q>0).map(([name,qty]) => ({ name, qty, price: FOOD.find(f=>f.name===name)!.price })),
      pricing: { base: seatBase, food: foodTotal, tax, discount, total },
    });
    nav({ to: "/payment" });
  }

  return (
    <ArenaShell title="Choose your seats">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <GlassCard>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-black">{movie.title}</h3>
                <p className="text-xs text-muted-foreground">{movie.category} · {movie.duration} · ★ {movie.rating} · {seatsLeft} of 50 seats left</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <select value={movie.id} onChange={e => setMovie(MOVIES.find(m=>m.id===e.target.value)!)} className="rounded-lg border border-border bg-background/60 px-3 py-2">
                  {MOVIES.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-lg border border-border bg-background/60 px-3 py-2" />
                <select value={time} onChange={e => setTime(e.target.value)} className="rounded-lg border border-border bg-background/60 px-3 py-2">
                  {SHOWTIMES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            {/* Screen */}
            <div className="mx-auto mb-8 w-full max-w-2xl">
              <div className="h-2 rounded-t-full bg-gradient-to-r from-transparent via-neon-cyan to-transparent glow-cyan" />
              <p className="mt-2 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">— Screen —</p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Hover for preview · Click to toggle</span>
              <div className="flex gap-2">
                <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))} className="rounded-full glass px-3 py-1">−</button>
                <span className="grid place-items-center px-2">{Math.round(zoom*100)}%</span>
                <button onClick={() => setZoom(z => Math.min(1.4, z + 0.1))} className="rounded-full glass px-3 py-1">+</button>
              </div>
            </div>

            <div className="mt-4 overflow-auto" role="grid" aria-label="Cinema seat map">
              <div className="mx-auto inline-block origin-top transition-transform" style={{ transform: `scale(${zoom})` }}>
                {ROWS.map(r => (
                  <div key={r} className="flex items-center gap-1.5 mb-1.5" role="row">
                    <span className="w-6 text-center text-[10px] text-muted-foreground font-bold">{r}</span>
                    {COLS.map(c => {
                      const id = `${r}${c}`;
                      const isOcc = occupied.includes(id);
                      const isSel = selected.includes(id);
                      const prem = isPremium(id);
                      const tierLabel = prem ? "Premium recliner" : tier(r);
                      const cost = prem ? 360 : price(r);
                      return (
                        <button
                          key={id}
                          disabled={isOcc}
                          role="gridcell"
                          aria-label={`Seat ${id}, ${tierLabel}, ₹${cost}, ${isOcc ? "booked" : isSel ? "selected" : "available"}`}
                          aria-pressed={isSel}
                          onMouseEnter={() => setHover(id)}
                          onMouseLeave={() => setHover(null)}
                          onFocus={() => setHover(id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!isOcc) arena.toggleSeat(id); }
                          }}
                          onClick={() => arena.toggleSeat(id)}
                          title={`${id} · ${tierLabel} · ₹${cost}`}
                          className={`h-8 w-8 rounded-md text-[10px] font-bold transition focus:outline-none focus:ring-2 focus:ring-neon-cyan ${
                            isOcc ? "bg-muted text-muted-foreground cursor-not-allowed line-through" :
                            isSel ? "bg-neon-purple text-foreground glow-purple scale-110" :
                            prem ? "bg-neon-gold/30 text-neon-gold hover:bg-neon-gold/50 ring-1 ring-neon-gold/40" :
                            r <= "B" ? "bg-neon-purple/15 hover:bg-neon-purple/40" :
                            r <= "D" ? "bg-neon-cyan/10 hover:bg-neon-cyan/30" :
                            "bg-secondary hover:bg-neon-blue/30"
                          }`}>{c}</button>
                      );
                    })}
                    <span className="ml-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {r === "A" ? "Premium" : r <= "B" ? "Front" : r <= "D" ? "Standard" : "Economy"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
              <Legend cls="bg-neon-gold/40" label="Premium (₹360)" />
              <Legend cls="bg-neon-purple/30" label="Front (₹280)" />
              <Legend cls="bg-neon-cyan/20" label="Standard (₹200)" />
              <Legend cls="bg-secondary" label="Economy (₹150)" />
              <Legend cls="bg-neon-purple glow-purple" label="Selected" />
              <Legend cls="bg-muted" label="Booked" />
              {hover && <span className="ml-auto text-neon-cyan">Preview: {hover} · {tier(hover[0])}</span>}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-display text-lg font-black">Add Snacks</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {FOOD.slice(0, 8).map(f => (
                <div key={f.name} className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-3 py-2">
                  <div className="text-sm"><span className="mr-2">{f.emoji}</span>{f.name} <span className="text-xs text-muted-foreground">₹{f.price}</span></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setFoodQty(q => ({...q, [f.name]: Math.max(0, (q[f.name]??0)-1)}))} className="h-6 w-6 rounded glass">−</button>
                    <span className="w-5 text-center text-sm">{foodQty[f.name] ?? 0}</span>
                    <button onClick={() => setFoodQty(q => ({...q, [f.name]: (q[f.name]??0)+1}))} className="h-6 w-6 rounded glass">+</button>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/food" className="mt-3 inline-block text-xs text-neon-cyan hover:underline">Browse full menu →</Link>
          </GlassCard>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <GlassCard>
            <h3 className="font-display text-lg font-black">Summary</h3>
            <p className="mt-1 text-xs text-muted-foreground">{movie.title} · {date} · {time}</p>
            <p className="mt-1 text-xs">Seats: <span className="font-semibold text-neon-cyan">{selected.length ? selected.join(", ") : "—"}</span></p>
            <div className="my-3 h-px bg-border" />
            <Row k="Seats" v={`₹${seatBase}`} />
            <Row k="Snacks" v={`₹${foodTotal}`} />
            <Row k={`Discount${discountPct?` (${discountPct}%)`:""}`} v={`− ₹${discount}`} muted />
            <Row k="GST 18%" v={`₹${tax}`} muted />
            <div className="my-3 h-px bg-border" />
            <Row k="Total" v={`₹${total}`} big />
            <button onClick={continueToPay} disabled={!selected.length} className="btn-primary mt-5 w-full disabled:opacity-50">Continue to Payment</button>
            <button onClick={() => nav({ to: "/movies" })} className="mt-2 w-full rounded-full glass py-2 text-xs">← Back to Movies</button>
          </GlassCard>
        </aside>
      </div>
    </ArenaShell>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return <span className="flex items-center gap-1.5"><span className={`h-4 w-4 rounded ${cls}`} />{label}</span>;
}
function Row({ k, v, muted, big }: { k: string; v: string; muted?: boolean; big?: boolean }) {
  return <div className={`flex justify-between ${big?"font-display text-xl font-black neon-text":"text-sm"} ${muted?"text-muted-foreground":""}`}><span>{k}</span><span>{v}</span></div>;
}
