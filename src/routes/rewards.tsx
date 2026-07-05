import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { arena, useArena } from "@/lib/arena-store";
import { REWARDS, SPIN_PRIZES, DAILY_CHALLENGES } from "@/lib/arena-data";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards & Daily Spin — ArenaVerse" }, { name: "description", content: "Spin daily, earn ArenaCoins, complete challenges and redeem for gaming, movies and snacks." }] }),
  component: RewardsPage,
});

function RewardsPage() {
  const coins = useArena((s) => s.coins);
  const xp = useArena((s) => s.xp);
  const streak = useArena((s) => s.streak);
  const lastSpin = useArena((s) => s.lastSpin);
  const done = useArena((s) => s.completedChallenges);
  const user = useArena((s) => s.user);

  const level = Math.floor(xp / 500) + 1;
  const nextLevelXp = level * 500;
  const levelProgress = ((xp % 500) / 500) * 100;

  const [category, setCategory] = useState<string>("All");
  const cats = ["All", ...Array.from(new Set(REWARDS.map(r => r.category)))];

  function redeem(id: string, cost: number, title: string) {
    if (!user) return alert("Sign in to redeem rewards.");
    if (arena.spendCoins(cost)) alert(`✓ Redeemed: ${title}\n\nShow your Pass at the counter to claim.`);
    else alert("Not enough ArenaCoins. Play more or spin the wheel!");
  }

  return (
    <ArenaShell title="Rewards & ArenaCoins">
      {/* Wallet overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <GlassCard className="!p-5">
          <div className="text-[10px] uppercase tracking-widest text-neon-gold">ArenaCoins</div>
          <div className="mt-1 font-display text-4xl font-black neon-text-gold">🪙 {coins}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Redeem below</div>
        </GlassCard>
        <GlassCard className="!p-5">
          <div className="text-[10px] uppercase tracking-widest text-neon-cyan">Level {level}</div>
          <div className="mt-1 font-display text-4xl font-black neon-text">⚡ {xp} XP</div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan" style={{ width: `${levelProgress}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">{nextLevelXp - xp} XP to Lv {level + 1}</div>
        </GlassCard>
        <GlassCard className="!p-5">
          <div className="text-[10px] uppercase tracking-widest text-neon-purple">Login Streak</div>
          <div className="mt-1 font-display text-4xl font-black">🔥 {streak} day{streak !== 1 ? "s" : ""}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Keep it going for bonuses</div>
        </GlassCard>
        <GlassCard className="!p-5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Rank</div>
          <div className="mt-1 font-display text-2xl font-black">🏆 {level >= 10 ? "Legend" : level >= 5 ? "Champion" : level >= 3 ? "Elite" : "Rookie"}</div>
          <Link to="/pass" className="mt-2 inline-block text-[11px] text-neon-cyan hover:underline">View passes →</Link>
        </GlassCard>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Daily Spin */}
          <GlassCard>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-display text-2xl font-black neon-text">🎡 Daily Spin</h2>
                <p className="mt-1 text-xs text-muted-foreground">One free spin every 24 hours. Win coins, XP, or free snacks!</p>
              </div>
              <div className="text-right text-[11px] text-muted-foreground">
                {lastSpin ? <>Last spin: {new Date(lastSpin).toLocaleString()}</> : "Never spun"}
              </div>
            </div>
            <SpinWheel />
          </GlassCard>

          {/* Daily Challenges */}
          <GlassCard>
            <h2 className="font-display text-xl font-black">🎯 Daily Challenges</h2>
            <p className="mt-1 text-xs text-muted-foreground">Complete to earn ArenaCoins & XP.</p>
            <div className="mt-4 space-y-2">
              {DAILY_CHALLENGES.map(c => {
                const isDone = done.includes(c.id);
                return (
                  <div key={c.id} className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${isDone ? "border-neon-cyan/40 bg-neon-cyan/5" : "border-border bg-background/40"}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{c.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{c.title}</div>
                        <div className="text-[11px] text-neon-gold">+{c.reward} 🪙 · +{Math.round(c.reward / 2)} XP</div>
                      </div>
                    </div>
                    <button
                      disabled={isDone}
                      onClick={() => arena.completeChallenge(c.id, c.reward)}
                      className={`shrink-0 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider ${isDone ? "bg-neon-cyan/30 text-neon-cyan" : "bg-gradient-to-r from-neon-purple to-neon-blue glow-purple"}`}
                    >{isDone ? "✓ Done" : "Claim"}</button>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Redeem Catalog */}
          <GlassCard>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-display text-xl font-black">🎁 Redeem ArenaCoins</h2>
              <div className="flex flex-wrap gap-1.5">
                {cats.map(c => (
                  <button key={c} onClick={() => setCategory(c)} className={`rounded-full border px-3 py-1 text-[11px] transition ${category===c?"border-neon-purple bg-neon-purple/20":"border-border text-muted-foreground hover:border-neon-cyan/40"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {REWARDS.filter(r => category === "All" || r.category === category).map(r => {
                const affordable = coins >= r.cost;
                return (
                  <div key={r.id} className={`rounded-2xl border p-4 transition ${affordable ? "border-border hover:border-neon-cyan/50" : "border-border/50 opacity-70"}`}>
                    <div className="text-4xl">{r.emoji}</div>
                    <div className="mt-2 font-display text-sm font-black">{r.title}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.category}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-display text-lg font-black neon-text-gold">🪙 {r.cost}</span>
                      <button onClick={() => redeem(r.id, r.cost, r.title)} disabled={!affordable} className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${affordable ? "bg-gradient-to-r from-neon-purple to-neon-blue glow-purple" : "bg-secondary text-muted-foreground cursor-not-allowed"}`}>Redeem</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Achievements */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <GlassCard>
            <h3 className="font-display text-lg font-black">🏅 Achievements</h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { e: "🎮", t: "First Play", u: level >= 1 },
                { e: "🎬", t: "Cinephile", u: level >= 2 },
                { e: "🔥", t: "3-Day Streak", u: streak >= 3 },
                { e: "🏆", t: "Champion", u: level >= 5 },
                { e: "🪙", t: "1K Coins", u: coins >= 1000 },
                { e: "👑", t: "Legend", u: level >= 10 },
              ].map((b, i) => (
                <div key={i} className={`rounded-xl border p-3 text-center ${b.u ? "border-neon-gold/50 bg-neon-gold/5" : "border-border/50 opacity-40"}`}>
                  <div className="text-2xl">{b.e}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider">{b.t}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-display text-lg font-black">🥇 Leaderboard</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">Top spenders this week</p>
            <ol className="mt-3 space-y-2 text-sm">
              {[
                { n: "Ammar A.", c: 12480 },
                { n: "Priya S.", c: 9820 },
                { n: "Rahul K.", c: 8140 },
                { n: user?.name ?? "You", c: coins, me: true },
                { n: "Vikram J.", c: 4230 },
              ].sort((a,b) => b.c - a.c).map((p, i) => (
                <li key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 ${p.me ? "bg-neon-purple/15 border border-neon-purple/40" : "bg-background/40"}`}>
                  <span className="flex items-center gap-2 min-w-0"><span className="text-neon-cyan font-bold">#{i+1}</span><span className="truncate">{p.n}</span></span>
                  <span className="text-neon-gold font-bold shrink-0">🪙 {p.c}</span>
                </li>
              ))}
            </ol>
          </GlassCard>
        </aside>
      </div>
    </ArenaShell>
  );
}

function SpinWheel() {
  const canSpin = useArena((s) => {
    if (!s.lastSpin) return true;
    return Date.now() - s.lastSpin > 24 * 60 * 60 * 1000;
  });
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const seg = 360 / SPIN_PRIZES.length;

  function spin() {
    if (!canSpin || spinning) return;
    setResult(null);
    setSpinning(true);
    const idx = Math.floor(Math.random() * SPIN_PRIZES.length);
    const target = 360 * 6 + (360 - idx * seg - seg / 2); // land pointer on segment center
    setAngle((a) => a + target);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const prize = SPIN_PRIZES[idx];
      if (prize.coins) arena.addCoins(prize.coins);
      if (prize.xp) arena.addXp(prize.xp);
      arena.markSpin();
      setResult(prize.label);
      setSpinning(false);
    }, 4200);
  }

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr] items-center">
      <div className="relative mx-auto h-[280px] w-[280px]">
        <div className="absolute left-1/2 -top-2 -translate-x-1/2 h-0 w-0 border-l-[12px] border-r-[12px] border-t-[20px] border-transparent border-t-neon-gold z-10" />
        <div
          className="h-full w-full rounded-full overflow-hidden border-4 border-neon-gold shadow-[0_0_40px_rgba(250,204,21,0.4)]"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)" : undefined,
            background: `conic-gradient(${SPIN_PRIZES.map((p, i) => `${p.color} ${i*seg}deg ${(i+1)*seg}deg`).join(",")})`,
          }}
        >
          {SPIN_PRIZES.map((p, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-bottom text-white text-[10px] font-black uppercase tracking-tight text-center px-1"
              style={{
                height: "50%",
                width: 60,
                marginLeft: -30,
                transform: `rotate(${i * seg + seg / 2}deg) translateY(-100%)`,
                paddingTop: 10,
                lineHeight: 1.1,
                textShadow: "0 1px 2px rgba(0,0,0,0.7)",
              }}
            >{p.label}</div>
          ))}
        </div>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="h-16 w-16 rounded-full bg-background border-4 border-neon-gold grid place-items-center text-2xl">🎡</div>
        </div>
      </div>
      <div>
        <button
          onClick={spin}
          disabled={!canSpin || spinning}
          className={`w-full sm:w-auto btn-primary text-base ${!canSpin || spinning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {spinning ? "Spinning…" : canSpin ? "🎡 Spin the Wheel" : "⏳ Come back in 24h"}
        </button>
        {result && (
          <div className="mt-4 rounded-2xl border border-neon-gold/60 bg-neon-gold/10 p-4 text-center animate-in fade-in glow-cyan">
            <div className="text-xs uppercase tracking-widest text-neon-gold">You won!</div>
            <div className="mt-1 font-display text-3xl font-black neon-text-gold">🎉 {result}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Added to your wallet automatically</div>
          </div>
        )}
        <div className="mt-4 text-[11px] text-muted-foreground space-y-1">
          <p>• Free spin every 24 hours</p>
          <p>• Prizes credited instantly</p>
          <p>• Redeem ArenaCoins for gaming, movies, snacks and membership</p>
        </div>
      </div>
    </div>
  );
}
