import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { LEADERBOARD_SEED, type LeaderboardPlayer } from "@/lib/arena-data";
import { useArena } from "@/lib/arena-store";

type Metric = "highScore" | "gamesPlayed" | "tournamentWins" | "coins" | "weekly" | "monthly";

const METRICS: { key: Metric; label: string; icon: string; format: (n: number) => string }[] = [
  { key: "highScore", label: "Highest Scores", icon: "🏆", format: n => n.toLocaleString() },
  { key: "gamesPlayed", label: "Most Games Played", icon: "🎮", format: n => `${n} games` },
  { key: "tournamentWins", label: "Tournament Winners", icon: "🥇", format: n => `${n} wins` },
  { key: "coins", label: "Most ArenaCoins", icon: "🪙", format: n => `${n.toLocaleString()} 🪙` },
  { key: "weekly", label: "Weekly Rankings", icon: "📅", format: n => `${n} pts` },
  { key: "monthly", label: "Monthly Rankings", icon: "🗓️", format: n => `${n} pts` },
];

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — ArenaVerse" },
      { name: "description", content: "Live rankings across ArenaVerse: top players, most games played, tournament winners, coins and weekly + monthly leaders." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [metric, setMetric] = useState<Metric>("highScore");
  const user = useArena(s => s.user);
  const coins = useArena(s => s.coins);
  const xp = useArena(s => s.xp);
  const bookings = useArena(s => s.bookings);

  const players: LeaderboardPlayer[] = useMemo(() => {
    // Merge the seed leaderboard with the current player derived from local activity
    const gp = bookings.length * 3 + Math.floor(xp / 25);
    const me: LeaderboardPlayer | null = user
      ? {
          id: "me",
          name: `${user.name} (You)`,
          avatar: "⭐",
          gamesPlayed: gp,
          highScore: Math.floor(xp * 50 + coins * 3),
          tournamentWins: Math.min(6, Math.floor(bookings.length / 4)),
          coins,
          weekly: Math.floor(coins / 6 + xp / 4),
          monthly: Math.floor(coins / 2 + xp),
        }
      : null;
    return me ? [...LEADERBOARD_SEED, me] : LEADERBOARD_SEED;
  }, [user, coins, xp, bookings]);

  const active = METRICS.find(m => m.key === metric)!;
  const sorted = useMemo(
    () => [...players].sort((a, b) => (b[metric] as number) - (a[metric] as number)),
    [players, metric]
  );
  const top3 = sorted.slice(0, 3);

  return (
    <ArenaShell title="Leaderboard">
      <p className="-mt-4 mb-6 text-sm text-muted-foreground">Live rankings across the arena — refreshes automatically as you play, book and earn.</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {METRICS.map(m => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${metric===m.key?"bg-gradient-to-r from-neon-purple to-neon-blue text-foreground glow-purple":"glass text-muted-foreground hover:text-foreground"}`}
          >
            <span className="mr-1">{m.icon}</span>{m.label}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[1, 0, 2].map((idx, pos) => {
          const p = top3[idx];
          if (!p) return <div key={pos} />;
          const heights = ["sm:mt-8", "", "sm:mt-12"];
          const medals = ["🥈", "🥇", "🥉"];
          return (
            <GlassCard key={p.id} className={`${heights[pos]} text-center border-2 ${idx===0?"border-neon-gold/60 glow-purple":"border-border"}`}>
              <div className="text-3xl">{medals[pos]}</div>
              <div className="mt-1 text-4xl">{p.avatar}</div>
              <div className="mt-2 font-display text-lg font-black truncate">{p.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">Rank #{idx + 1}</div>
              <div className="mt-3 text-sm text-neon-cyan font-bold">{active.format(p[metric] as number)}</div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 sm:px-4 py-3 w-12">#</th>
                <th className="px-3 sm:px-4 py-3">Player</th>
                <th className="px-3 sm:px-4 py-3 text-right">{active.label}</th>
                <th className="hidden sm:table-cell px-4 py-3 text-right">Games</th>
                <th className="hidden md:table-cell px-4 py-3 text-right">Coins</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const isMe = p.id === "me";
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-border transition ${isMe?"bg-neon-purple/10":"hover:bg-background/40"}`}
                  >
                    <td className="px-3 sm:px-4 py-3 font-bold text-muted-foreground">{i + 1}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{p.avatar}</span>
                        <span className={`truncate font-semibold ${isMe?"text-neon-cyan":""}`}>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right font-bold text-neon-gold whitespace-nowrap">{active.format(p[metric] as number)}</td>
                    <td className="hidden sm:table-cell px-4 py-3 text-right text-muted-foreground">{p.gamesPlayed}</td>
                    <td className="hidden md:table-cell px-4 py-3 text-right text-muted-foreground">{p.coins.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {!user && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Sign in to appear on the leaderboard and track your progress.
        </p>
      )}
    </ArenaShell>
  );
}
