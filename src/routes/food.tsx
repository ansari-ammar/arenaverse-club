import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { FOOD, FOOD_CATEGORIES } from "@/lib/arena-data";

export const Route = createFileRoute("/food")({
  head: () => ({ meta: [{ title: "Food & Snacks — ArenaVerse Lounge" }] }),
  component: FoodPage,
});

function FoodPage() {
  const [cat, setCat] = useState<string>("All");
  const [cart, setCart] = useState<Record<string, number>>({});

  const items = useMemo(() => cat === "All" ? FOOD : FOOD.filter(f => f.category === cat), [cat]);
  const total = useMemo(() => Object.entries(cart).reduce((s,[n,q]) => s + (FOOD.find(f=>f.name===n)?.price ?? 0) * q, 0), [cart]);
  const recommended = useMemo(() => FOOD.filter(f => f.tag), []);
  const cartCount = Object.values(cart).reduce((s,n) => s + n, 0);

  return (
    <ArenaShell title="Food & Snacks Lounge">
      <p className="-mt-4 mb-8 text-sm text-muted-foreground">Crafted for gamers & cinephiles. Add to your booking or order at the counter.</p>

      {/* Recommendations */}
      <section className="mb-10">
        <h2 className="mb-3 font-display text-lg font-black tracking-wider">⭐ Recommended Combos & Bestsellers</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map(f => (
            <div key={f.name} className="group relative overflow-hidden rounded-2xl border border-neon-purple/40 bg-gradient-to-br from-neon-purple/10 to-neon-blue/5 p-5 transition hover:-translate-y-1 hover:glow-purple">
              <div className="text-4xl">{f.emoji}</div>
              <div className="mt-2 font-display text-sm font-black">{f.name}</div>
              <div className="mt-1 text-xs text-neon-gold">{f.tag}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-lg font-black neon-text">₹{f.price}</span>
                <button onClick={() => setCart(c => ({...c, [f.name]: (c[f.name]??0)+1}))} className="rounded-full bg-gradient-to-r from-neon-purple to-neon-blue px-3 py-1.5 text-xs font-bold glow-purple">+ Add</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", ...FOOD_CATEGORIES].map(c => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${cat===c?"bg-gradient-to-r from-neon-purple to-neon-blue text-foreground glow-purple":"glass text-muted-foreground hover:text-foreground"}`}>{c}</button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(f => {
            const qty = cart[f.name] ?? 0;
            return (
              <article key={f.name} className="glass flex items-start gap-3 rounded-2xl p-4 transition hover:border-neon-cyan/40">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-secondary text-3xl">{f.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{f.name}</h3>
                    {f.tag && <span className="rounded-full bg-neon-gold/15 px-2 py-0.5 text-[9px] uppercase tracking-wider text-neon-gold">{f.tag}</span>}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{f.category}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-base font-black neon-text">₹{f.price}</span>
                    {qty === 0 ? (
                      <button onClick={() => setCart(c => ({...c, [f.name]: 1}))} className="rounded-full glass px-3 py-1 text-xs hover:border-neon-cyan/60">+ Add</button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCart(c => ({...c, [f.name]: Math.max(0, qty-1)}))} className="h-7 w-7 rounded-full glass">−</button>
                        <span className="w-5 text-center text-sm font-bold">{qty}</span>
                        <button onClick={() => setCart(c => ({...c, [f.name]: qty+1}))} className="h-7 w-7 rounded-full bg-neon-purple/30 text-neon-purple">+</button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <GlassCard>
            <h3 className="font-display text-lg font-black">🛒 Your Cart</h3>
            {cartCount === 0 ? <p className="mt-2 text-sm text-muted-foreground">Cart is empty.</p> : (
              <div className="mt-3 space-y-2 text-sm">
                {Object.entries(cart).filter(([,q]) => q>0).map(([n,q]) => {
                  const f = FOOD.find(x => x.name === n)!;
                  return <div key={n} className="flex justify-between"><span>{f.emoji} {n} ×{q}</span><span className="font-semibold">₹{f.price * q}</span></div>;
                })}
                <div className="my-2 h-px bg-border" />
                <div className="flex justify-between font-display text-lg font-black neon-text"><span>Total</span><span>₹{total}</span></div>
                <button onClick={() => alert("Order placed at counter (demo). Show this at the lounge.")} className="btn-primary mt-3 w-full">Quick Buy at Counter</button>
                <Link to="/booking" className="block w-full rounded-full glass py-2 text-center text-xs hover:border-neon-cyan/60">Add to a Booking</Link>
                <button onClick={() => setCart({})} className="block w-full text-xs text-muted-foreground hover:text-destructive">Clear cart</button>
              </div>
            )}
          </GlassCard>
          <GlassCard className="mt-4">
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">Pro tip</h4>
            <p className="mt-2 text-xs text-muted-foreground">Bundle a combo with your booking to save up to ₹100 vs ordering separately.</p>
          </GlassCard>
        </aside>
      </div>
    </ArenaShell>
  );
}
