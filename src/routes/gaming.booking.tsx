import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { GAMES, GAMING_SLOTS, GAMING_DURATIONS, FOOD, type Game } from "@/lib/arena-data";
import { arena, useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/gaming/booking")({
  head: () => ({ meta: [{ title: "Gaming — ArenaVerse" }] }),
  component: GamingBooking,
});

const CONSOLES = ["PS5", "Xbox Series X", "PC Rig", "Racing Sim", "VR Pod"];
const GENRES = ["All", "Open World", "FPS", "Sports", "Racing", "Fighting", "Sandbox", "Battle Royale", "Action", "Action RPG", "Souls-like", "Immersive"];

function GameCard({ g, selected, onSelect, onTrailer }: { g: Game; selected: boolean; onSelect: () => void; onTrailer: (g: Game) => void }) {
  const wishlist = useArena((s) => s.wishlist);
  const notify = useArena((s) => s.notifyList);
  const isWish = wishlist.includes(g.id);
  const isNotify = notify.includes(g.id);
  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition ${selected ? "border-neon-purple glow-purple" : "border-border hover:border-neon-cyan/50 hover:-translate-y-1"}`}>
      <div className={`relative aspect-[4/5] bg-gradient-to-br ${g.hue} overflow-hidden`}>
        {g.img ? (
          <img src={g.img} alt={g.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-6xl opacity-90">{g.emoji}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        {g.comingSoon && <div className="absolute top-2 left-2 rounded-md bg-neon-gold px-2 py-0.5 text-[10px] font-black uppercase text-black tracking-wider">Coming Soon</div>}
        {!g.comingSoon && <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-neon-gold">★ {g.rating}</div>}
        <button
          onClick={(e) => { e.stopPropagation(); arena.toggleWishlist(g.id); }}
          aria-label="Wishlist"
          className={`absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full text-xs ${isWish ? "bg-neon-purple text-foreground" : "bg-black/60 text-muted-foreground hover:text-foreground"}`}
        >{isWish ? "♥" : "♡"}</button>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="text-[10px] uppercase tracking-wider text-neon-cyan">{g.genre} · {g.console}</div>
          <h3 className="font-display text-base font-black leading-tight truncate">{g.title}</h3>
        </div>
      </div>
      <div className="p-3 space-y-2 bg-card">
        {g.comingSoon ? (
          <>
            <button onClick={() => onTrailer(g)} className="w-full rounded-lg glass py-2 text-[11px] font-bold uppercase tracking-wider">▶ Trailer</button>
            <button
              onClick={() => arena.toggleNotify(g.id)}
              className={`w-full rounded-lg py-2 text-[11px] font-bold uppercase tracking-wider ${isNotify ? "bg-neon-gold/30 text-neon-gold" : "bg-gradient-to-r from-neon-purple to-neon-blue glow-purple"}`}
            >{isNotify ? "🔔 Notified" : "🔔 Notify Me"}</button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-display font-black neon-text">₹{g.price}/hr</span>
              <button onClick={() => onTrailer(g)} className="text-neon-cyan hover:underline">▶ Trailer</button>
            </div>
            <button onClick={onSelect} className={`w-full rounded-lg py-2 text-[11px] font-bold uppercase tracking-wider transition ${selected ? "bg-neon-purple glow-purple" : "bg-gradient-to-r from-neon-purple to-neon-blue"}`}>
              {selected ? "✓ Selected" : "Book Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CountdownBanner({ target }: { target: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return (
    <div className="flex gap-2 sm:gap-3 flex-wrap">
      {[["Days",d],["Hrs",h],["Min",m],["Sec",s]].map(([l,v]) => (
        <div key={l} className="rounded-xl border border-neon-gold/50 bg-black/40 px-3 sm:px-4 py-2 min-w-[64px] text-center">
          <div className="font-display text-2xl sm:text-3xl font-black neon-text-gold">{String(v).padStart(2,"0")}</div>
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{l}</div>
        </div>
      ))}
    </div>
  );
}

function GamingBooking() {
  const nav = useNavigate();
  const user = useArena((s) => s.user);
  const today = new Date().toISOString().slice(0, 10);

  const bookable = GAMES.filter(g => !g.comingSoon);
  const comingSoon = GAMES.filter(g => g.comingSoon);

  const [genre, setGenre] = useState<string>("All");
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState(GAMING_SLOTS[2]);
  const [duration, setDuration] = useState(GAMING_DURATIONS[1]);
  const [game, setGame] = useState(bookable[0].id);
  const [consoleType, setConsoleType] = useState(CONSOLES[0]);
  const [players, setPlayers] = useState(2);
  const [foodQty, setFoodQty] = useState<Record<string, number>>({});
  const [trailer, setTrailer] = useState<Game | null>(null);

  const filtered = useMemo(() => genre === "All" ? bookable : bookable.filter(g => g.genre === genre), [genre]);
  const foodTotal = useMemo(() => FOOD.reduce((s, f) => s + (foodQty[f.name] ?? 0) * f.price, 0), [foodQty]);
  const selectedGame = GAMES.find((g) => g.id === game);
  const baseGame = (selectedGame?.price ?? duration.price) * Math.max(1, Math.ceil(players / 2)) + duration.price;
  const subtotal = baseGame + foodTotal;
  const discountPct = user?.discountPct ?? 0;
  const discount = Math.round((subtotal * discountPct) / 100);
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + tax;

  function proceed() {
    if (!user) return nav({ to: "/auth/login" });
    arena.setDraft({
      type: "gaming",
      title: selectedGame?.title ?? "Gaming Session",
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
    <ArenaShell title="Gaming Library">
      {/* GTA VI Coming Soon Hero */}
      {comingSoon.map(g => (
        <section key={g.id} className="relative mb-10 overflow-hidden rounded-3xl border border-neon-gold/40">
          <div className={`absolute inset-0 bg-gradient-to-br ${g.hue}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          <div className="relative grid gap-6 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0">
              <span className="rounded-full bg-neon-gold px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-black text-black">🌴 Most Anticipated</span>
              <h1 className="mt-4 font-display text-4xl sm:text-6xl font-black neon-text-gold">{g.title}</h1>
              <p className="mt-3 max-w-lg text-sm text-muted-foreground">Return to Vice City. A sprawling next-gen open world coming exclusively to ArenaVerse VIP pods on release day. Reserve early.</p>
              <div className="mt-6"><CountdownBanner target={g.releaseDate!} /></div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setTrailer(g)} className="btn-primary">▶ Watch Trailer</button>
                <button
                  onClick={() => arena.toggleNotify(g.id)}
                  className="rounded-full glass px-5 py-3 text-sm hover:border-neon-gold/60"
                >🔔 Notify Me on Launch</button>
                <button
                  onClick={() => arena.toggleWishlist(g.id)}
                  className="rounded-full glass px-5 py-3 text-sm hover:border-neon-purple/60"
                >♥ Add to Wishlist</button>
              </div>
            </div>
            <div className="hidden md:grid place-items-center text-[240px] leading-none opacity-80">{g.emoji}</div>
          </div>
        </section>
      ))}

      {/* Booking configurator + library */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">1 · When</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
          </GlassCard>

          <GlassCard>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">2 · Choose your game</h2>
              <span className="text-[11px] text-muted-foreground">{filtered.length} of {bookable.length} titles</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {GENRES.map(g => (
                <button key={g} onClick={() => setGenre(g)} className={`rounded-full border px-3 py-1 text-[11px] transition ${genre===g?"border-neon-purple bg-neon-purple/20 glow-purple":"border-border text-muted-foreground hover:border-neon-cyan/40"}`}>{g}</button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map(g => (
                <GameCard key={g.id} g={g} selected={game===g.id} onSelect={() => setGame(g.id)} onTrailer={setTrailer} />
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
          </GlassCard>

          <GlassCard>
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">3 · Add snacks (optional)</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {FOOD.slice(0, 12).map(f => {
                const q = foodQty[f.name] ?? 0;
                return (
                  <div key={f.name} className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate"><span className="mr-1.5">{f.emoji}</span>{f.name}</div>
                      <div className="text-xs text-muted-foreground">₹{f.price}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setFoodQty({ ...foodQty, [f.name]: Math.max(0, q-1) })} className="h-7 w-7 rounded-full border border-border">−</button>
                      <span className="w-6 text-center text-sm">{q}</span>
                      <button onClick={() => setFoodQty({ ...foodQty, [f.name]: q+1 })} className="h-7 w-7 rounded-full border border-neon-purple text-neon-cyan">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link to="/food" className="mt-3 inline-block text-xs text-neon-cyan hover:underline">Browse full menu →</Link>
          </GlassCard>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <GlassCard>
            <h3 className="font-display text-lg font-black">Live summary</h3>
            <p className="mt-1 text-xs text-muted-foreground truncate">{selectedGame?.title} · {consoleType}</p>
            <p className="text-xs text-muted-foreground">{date} · {slot} · {duration.label}</p>
            <div className="my-3 h-px bg-border" />
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

      {trailer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-xl p-4" onClick={() => setTrailer(null)}>
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neon-purple/50 glow-purple" onClick={e => e.stopPropagation()}>
            <button onClick={() => setTrailer(null)} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80">✕</button>
            <div className="aspect-video">
              <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${trailer.trailer}?autoplay=1`} title={trailer.title} allow="autoplay; encrypted-media" allowFullScreen />
            </div>
            <div className="bg-background/90 p-4">
              <div className="font-display text-xl font-black">{trailer.title}</div>
              <div className="text-xs text-muted-foreground">{trailer.genre} · {trailer.console} {trailer.comingSoon ? "· Coming Soon" : `· ★ ${trailer.rating}`}</div>
            </div>
          </div>
        </div>
      )}
    </ArenaShell>
  );
}

export function SummaryRow({ k, v, muted, big }: { k: string; v: string; muted?: boolean; big?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${big ? "text-lg font-display font-black" : "text-sm"} ${muted ? "text-muted-foreground" : ""}`}>
      <span>{k}</span><span className={big ? "neon-text" : ""}>{v}</span>
    </div>
  );
}
