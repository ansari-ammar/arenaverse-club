import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { GAME_REGISTRY } from "@/games";

export const Route = createFileRoute("/play-online")({
  head: () => ({ meta: [{ title: "Play Online — ArenaVerse" }, { name: "description", content: "13 fully playable browser games — solo or with friends via Room ID." }] }),
  component: PlayOnline,
});

type Game = {
  id: keyof typeof GAME_REGISTRY;
  name: string;
  emoji: string;
  category: "Classic" | "Puzzle" | "Arcade" | "Multiplayer";
  difficulty: "Easy" | "Medium" | "Hard";
  desc: string;
  hue: string;
  multiplayer: boolean;
};

const GAMES: Game[] = [
  { id: "2048",   name: "2048",              emoji: "🎯", category: "Puzzle",      difficulty: "Medium", desc: "Merge tiles. Reach 2048. Then keep going.",           hue: "from-orange-500 to-amber-800",  multiplayer: false },
  { id: "snake",  name: "Snake",             emoji: "🐍", category: "Arcade",      difficulty: "Easy",   desc: "Eat, grow, don't crash. Retro perfection.",           hue: "from-lime-500 to-emerald-800",  multiplayer: false },
  { id: "ttt",    name: "Tic Tac Toe",       emoji: "❌", category: "Classic",     difficulty: "Easy",   desc: "3×3 grid. Play against a smart AI.",                  hue: "from-cyan-600 to-blue-800",     multiplayer: false },
  { id: "sudoku", name: "Sudoku",            emoji: "🔢", category: "Puzzle",      difficulty: "Hard",   desc: "Classic 9×9 logic puzzle.",                           hue: "from-slate-600 to-slate-900",   multiplayer: false },
  { id: "memory", name: "Memory Match",      emoji: "🧠", category: "Puzzle",      difficulty: "Easy",   desc: "Flip pairs. Test recall against the clock.",          hue: "from-pink-500 to-rose-800",     multiplayer: false },
  { id: "bubble", name: "Bubble Shooter",    emoji: "🫧", category: "Puzzle",      difficulty: "Easy",   desc: "Pop groups of matching bubbles.",                     hue: "from-sky-500 to-blue-800",      multiplayer: false },
  { id: "tetris", name: "Tetris",            emoji: "🧱", category: "Arcade",      difficulty: "Medium", desc: "Stack falling blocks. Clear lines.",                  hue: "from-indigo-600 to-purple-900", multiplayer: false },
  { id: "chess",  name: "Chess",             emoji: "♟️", category: "Multiplayer", difficulty: "Hard",   desc: "Timeless strategy. Local 2-player.",                  hue: "from-amber-700 to-stone-900",   multiplayer: true },
  { id: "ludo",   name: "Ludo",              emoji: "🎲", category: "Multiplayer", difficulty: "Easy",   desc: "Dice race — first to 30 wins.",                       hue: "from-red-600 to-fuchsia-800",   multiplayer: true },
  { id: "c4",     name: "Connect Four",      emoji: "🔴", category: "Multiplayer", difficulty: "Medium", desc: "Line up four discs. Beat the AI.",                    hue: "from-yellow-500 to-red-700",    multiplayer: true },
  { id: "rps",    name: "Rock Paper Scissors", emoji: "✊", category: "Multiplayer", difficulty: "Easy", desc: "Best of 5. Quick draws, real stakes.",                hue: "from-teal-500 to-cyan-800",     multiplayer: true },
  { id: "race",   name: "Car Racing",        emoji: "🏎️", category: "Arcade",      difficulty: "Medium", desc: "Weave through traffic. Don't crash.",                 hue: "from-red-500 to-orange-700",    multiplayer: false },
  { id: "quiz",   name: "Quiz Battle",       emoji: "❓", category: "Multiplayer", difficulty: "Medium", desc: "8 gaming trivia questions. Beat the clock.",          hue: "from-violet-600 to-fuchsia-900", multiplayer: true },
];

const CATS = ["All", "Classic", "Puzzle", "Arcade", "Multiplayer"] as const;

function PlayOnline() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Game | null>(null);
  const [roomId, setRoomId] = useState("");
  const [joinId, setJoinId] = useState("");

  const filtered = useMemo(() => cat === "All" ? GAMES : GAMES.filter(g => g.category === cat), [cat]);

  function play(g: Game, withRoom = false) {
    setSelected(g);
    setRoomId(withRoom ? Math.random().toString(36).slice(2, 8).toUpperCase() : "");
    setOpen(true);
  }

  const Component = selected ? GAME_REGISTRY[selected.id] : null;

  return (
    <ArenaShell title="Play Online">
      <p className="-mt-6 mb-8 max-w-2xl text-sm text-muted-foreground">
        13 fully playable browser games — instant single-player or multiplayer with friends via Room ID. No download.
      </p>

      <GlassCard className="mb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-neon-cyan">Multiplayer</p>
            <h3 className="mt-1 font-display text-lg font-black">Play with a friend</h3>
            <p className="mt-1 text-xs text-muted-foreground">Create a room or join with a code.</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => play(GAMES.find(g => g.multiplayer)!, true)} className="btn-primary w-full text-sm">Create Room</button>
            <p className="text-[10px] text-muted-foreground text-center">Share the room code with your friend</p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); if (joinId.trim().length >= 4) { setSelected(GAMES.find(g => g.multiplayer)!); setRoomId(joinId.toUpperCase()); setOpen(true); } }}
            className="flex flex-col gap-2"
          >
            <input value={joinId} onChange={(e) => setJoinId(e.target.value)} placeholder="Enter Room ID"
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm uppercase tracking-widest" />
            <button type="submit" className="btn-ghost-neon w-full text-sm">Join Room</button>
          </form>
        </div>
      </GlassCard>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition ${
              cat === c ? "border-neon-purple bg-neon-purple/20 text-foreground glow-purple" : "border-border text-muted-foreground hover:border-neon-cyan/40"
            }`}
          >{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map(g => (
          <div key={g.id} className="group relative overflow-hidden rounded-2xl glass border border-white/5 transition hover:-translate-y-1 hover:glow-purple hover:border-neon-purple/40">
            {/* Banner / cover art */}
            <div className={`relative aspect-[4/5] bg-gradient-to-br ${g.hue} overflow-hidden`}>
              {/* hex pattern overlay */}
              <svg aria-hidden className="absolute inset-0 h-full w-full opacity-25 mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`hex-${g.id}`} width="22" height="26" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                    <path d="M11 0 L22 6 V19 L11 25 L0 19 V6 Z" fill="none" stroke="white" strokeWidth="0.6" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#hex-${g.id})`} />
              </svg>
              {/* radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.28),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
                <span className="rounded-md bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-cyan border border-white/10">
                  {g.multiplayer ? "MP" : "SP"}
                </span>
                <span className="rounded-md bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] uppercase tracking-wider text-neon-gold border border-white/10">
                  {g.difficulty}
                </span>
              </div>

              {/* Big emoji as art */}
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-6xl sm:text-7xl drop-shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-110">{g.emoji}</span>
              </div>

              {/* Bottom title */}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="text-[10px] uppercase tracking-wider text-neon-cyan">{g.category}</div>
                <h3 className="font-display text-base font-black leading-tight">{g.name}</h3>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-[11px] text-muted-foreground line-clamp-2 min-h-[2.5rem]">{g.desc}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => play(g)} className="rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue px-2 py-2.5 text-[11px] font-bold uppercase tracking-wider glow-purple active:scale-95 transition">Play Now</button>
                <button onClick={() => play(g, true)} disabled={!g.multiplayer}
                  className="rounded-lg border border-neon-cyan/40 px-2 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition">
                  Invite
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && selected && Component && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto glass rounded-3xl p-4 sm:p-6">
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 h-8 w-8 rounded-full glass z-10" aria-label="Close">✕</button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${selected.hue} text-3xl`}>{selected.emoji}</div>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-black truncate">{selected.name}</h3>
                <p className="text-[11px] text-muted-foreground">{selected.category} · {selected.difficulty}</p>
              </div>
            </div>

            {roomId && (
              <div className="mb-4 rounded-xl border border-neon-purple/40 bg-background/40 p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan">Room · share with a friend</p>
                <p className="font-display text-2xl font-black neon-text-gold tracking-widest">{roomId}</p>
                <button onClick={() => navigator.clipboard?.writeText(roomId)} className="text-[10px] text-muted-foreground hover:text-foreground">Copy code</button>
              </div>
            )}

            <Component />
          </div>
        </div>
      )}
    </ArenaShell>
  );
}
