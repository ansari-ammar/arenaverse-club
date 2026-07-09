import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { MOVIES, SHOWTIMES, FOOD } from "@/lib/arena-data";
import { arena, useArena } from "@/lib/arena-store";
import { SummaryRow } from "./gaming.booking";

export const Route = createFileRoute("/movies/seats")({
  head: () => ({ meta: [{ title: "Movie Seats — ArenaVerse" }] }),
  component: MovieSeats,
});

const ROWS = ["A", "B", "C", "D", "E"] as const;
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

function tier(row: string): "Premium" | "Standard" | "Economy" {
  if (row === "A" || row === "B") return "Premium";
  if (row === "C" || row === "D") return "Standard";
  return "Economy";
}
function price(row: string) { return row <= "B" ? 280 : row <= "D" ? 200 : 150; }

function MovieSeats() {
  const nav = useNavigate();
  const user = useArena((s) => s.user);
  const occupied = useArena((s) => s.occupiedSeats);
  const draftSeats = useArena((s) => s.draft.seats ?? []);
  const today = new Date().toISOString().slice(0, 10);

  const [movie, setMovie] = useState(MOVIES[0]);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(SHOWTIMES[2]);
  const [foodQty, setFoodQty] = useState<Record<string, number>>({});

  const seatPrice = useMemo(() => draftSeats.reduce((s, id) => s + price(id[0]), 0), [draftSeats]);
  const foodTotal = useMemo(() => FOOD.reduce((s, f) => s + (foodQty[f.name] ?? 0) * f.price, 0), [foodQty]);
  const subtotal = seatPrice + foodTotal;
  const discountPct = user?.discountPct ?? 0;
  const discount = Math.round((subtotal * discountPct) / 100);
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + tax;

  const seatsLeft = ROWS.length * COLS.length - occupied.length;

  function proceed() {
    if (!user) return nav({ to: "/auth/login" });
    if (draftSeats.length === 0) return;
    arena.setDraft({
      type: "movie",
      title: movie.title,
      date, time,
      seats: draftSeats,
      food: Object.entries(foodQty).filter(([,q]) => q > 0).map(([name, qty]) => {
        const f = FOOD.find(x => x.name === name)!; return { name, qty, price: f.price };
      }),
      pricing: { base: seatPrice, food: foodTotal, tax, discount, total },
    });
    nav({ to: "/movies/checkout" });
  }

  return (
    <ArenaShell title="Pick your seats">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">1 · Now playing</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {MOVIES.map(m => (
                <button key={m.id} onClick={() => setMovie(m)}
                  className={`group relative overflow-hidden rounded-xl border transition ${movie.id===m.id ? "border-neon-purple glow-purple" : "border-border hover:border-neon-cyan/40"}`}>
                  <img src={m.img} alt={m.title} className="h-44 w-full object-cover" loading="lazy" width={512} height={768} />
                  <div className="bg-background/85 px-2 py-1.5 text-left">
                    <div className="text-xs font-semibold truncate">{m.title}</div>
                    <div className="text-[10px] text-muted-foreground">{m.duration} · ₹{m.price}+</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Date</span>
                <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm" />
              </label>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Showtime</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SHOWTIMES.map(s => (
                    <button key={s} onClick={() => setTime(s)}
                      className={`rounded-full border px-4 py-2 text-xs transition ${time===s ? "border-neon-purple bg-neon-purple/20 glow-purple" : "border-border text-muted-foreground hover:border-neon-cyan/40"}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">2 · Seats</h2>
              <span className="text-xs text-muted-foreground">{seatsLeft}/{ROWS.length*COLS.length} available · live</span>
            </div>

            {/* Screen */}
            <div className="mt-6 mx-auto h-2 max-w-md rounded-full bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent shadow-[0_0_30px_oklch(0.82_0.18_200/0.6)]" />
            <div className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">Screen · Best view this way</div>

            <div className="mt-6 -mx-2 overflow-x-auto pb-2">
              <div
                role="grid"
                aria-label="Cinema seat map. Use arrow keys to move, Space or Enter to toggle a seat."
                aria-rowcount={ROWS.length}
                aria-colcount={COLS.length}
                className="min-w-[320px] space-y-1.5 sm:space-y-2 px-2"
                onKeyDown={(e) => {
                  const target = e.target as HTMLElement;
                  const r = Number(target.dataset.row);
                  const c = Number(target.dataset.col);
                  if (Number.isNaN(r) || Number.isNaN(c)) return;
                  let nr = r, nc = c;
                  if (e.key === "ArrowRight") nc = Math.min(COLS.length - 1, c + 1);
                  else if (e.key === "ArrowLeft") nc = Math.max(0, c - 1);
                  else if (e.key === "ArrowDown") nr = Math.min(ROWS.length - 1, r + 1);
                  else if (e.key === "ArrowUp") nr = Math.max(0, r - 1);
                  else if (e.key === "Home") nc = 0;
                  else if (e.key === "End") nc = COLS.length - 1;
                  else return;
                  e.preventDefault();
                  const next = e.currentTarget.querySelector<HTMLButtonElement>(
                    `button[data-row="${nr}"][data-col="${nc}"]`
                  );
                  next?.focus();
                }}
              >
                {ROWS.map((r, ri) => (
                  <div key={r} role="row" className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span aria-hidden className="w-4 sm:w-5 text-[10px] sm:text-xs text-muted-foreground font-semibold">{r}</span>
                    <div className="flex gap-1 sm:gap-1.5">
                      {COLS.map((c, ci) => {
                        const id = `${r}${c}`;
                        const isOcc = occupied.includes(id);
                        const isSel = draftSeats.includes(id);
                        const t = tier(r);
                        const state = isOcc ? "booked" : isSel ? "selected" : "available";
                        const label = `Row ${r} seat ${c}, ${t} tier, ₹${price(r)}, ${state}`;
                        const isFirst = ri === 0 && ci === 0;
                        return (
                          <button
                            key={id}
                            role="gridcell"
                            data-row={ri}
                            data-col={ci}
                            disabled={isOcc}
                            aria-label={label}
                            aria-pressed={isSel}
                            aria-disabled={isOcc}
                            tabIndex={isFirst ? 0 : -1}
                            onClick={() => arena.toggleSeat(id)}
                            title={`${id} · ${t} · ₹${price(r)}`}
                            className={`h-6 w-6 sm:h-8 sm:w-8 rounded-md text-[9px] sm:text-[11px] font-semibold transition touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                              isOcc ? "bg-muted text-muted-foreground/40 cursor-not-allowed" :
                              isSel ? "bg-neon-purple text-foreground glow-purple scale-110 ring-2 ring-neon-cyan animate-in zoom-in-50" :
                              t === "Premium" ? "bg-gradient-to-br from-neon-gold/40 to-amber-600/30 text-neon-gold ring-1 ring-neon-gold/60 hover:from-neon-gold/60 hover:to-amber-600/50 shadow-[0_0_10px_oklch(0.85_0.16_85/0.4)]" :
                              t === "Standard" ? "bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/30" :
                              "bg-secondary text-muted-foreground hover:bg-secondary/80"
                            }`}
                          >{c}</button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-muted-foreground">
              <Legend color="bg-gradient-to-br from-neon-gold/60 to-amber-600/40 ring-1 ring-neon-gold/60" label="Premium ₹280" />
              <Legend color="bg-neon-cyan/30" label="Standard ₹200" />
              <Legend color="bg-secondary" label="Economy ₹150" />
              <Legend color="bg-neon-purple" label="Selected" />
              <Legend color="bg-muted" label="Occupied" />
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">3 · Food combos (optional)</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
          </GlassCard>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <GlassCard>
            <h3 className="font-display text-lg font-black">Live summary</h3>
            <p className="mt-1 text-xs text-muted-foreground">{movie.title} · {date} · {time}</p>
            <p className="mt-1 text-xs">Seats: {draftSeats.length ? <span className="text-neon-cyan font-semibold">{draftSeats.join(", ")}</span> : <span className="text-muted-foreground">none selected</span>}</p>
            <div className="my-3 h-px bg-border" />
            <SummaryRow k="Seats" v={`₹${seatPrice}`} />
            <SummaryRow k="Food" v={`₹${foodTotal}`} />
            <SummaryRow k="Discount" v={`− ₹${discount}`} muted />
            <SummaryRow k="GST 18%" v={`₹${tax}`} muted />
            <div className="my-3 h-px bg-border" />
            <SummaryRow k="Total" v={`₹${total}`} big />
            <button disabled={draftSeats.length===0} onClick={proceed} className="btn-primary mt-5 w-full disabled:opacity-50">
              {user ? "Continue to payment" : "Sign in to continue"}
            </button>
          </GlassCard>
        </aside>
      </div>
    </ArenaShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${color}`} />{label}</span>;
}
