import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { WATCH_ONLINE, WATCH_CATEGORIES, type WatchItem } from "@/lib/arena-data";

export const Route = createFileRoute("/watch")({
  head: () => ({
    meta: [
      { title: "Watch Online — Free & Official · ArenaVerse" },
      { name: "description", content: "Free public-domain films, official trailers, documentaries and shows — all from authorised sources." },
    ],
  }),
  component: WatchPage,
});

function WatchPage() {
  const [cat, setCat] = useState<(typeof WATCH_CATEGORIES)[number]>("All");
  const [active, setActive] = useState<WatchItem | null>(null);

  const [q, setQ] = useState("");
  const visible = useMemo(() => {
    return WATCH_ONLINE.filter(w =>
      (cat === "All" || w.category === cat) &&
      (q === "" || w.title.toLowerCase().includes(q.toLowerCase()))
    );
  }, [cat, q]);

  return (
    <ArenaShell title="Watch Online">
      <p className="-mt-4 mb-6 text-sm text-muted-foreground max-w-2xl">
        Free public-domain films, officially licensed documentaries and studio-approved trailers. No pirated content.
      </p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {WATCH_CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${cat===c?"bg-gradient-to-r from-neon-purple to-neon-blue text-foreground glow-purple":"glass text-muted-foreground hover:text-foreground"}`}
            >{c}</button>
          ))}
        </div>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search…"
          className="w-full sm:w-56 rounded-full border border-border bg-background/60 px-4 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map(w => (
          <article
            key={w.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-neon-cyan/60 hover:glow-purple"
          >
            <button
              onClick={() => setActive(w)}
              className="relative block w-full aspect-video overflow-hidden"
              aria-label={`Play ${w.title}`}
            >
              <img
                src={`https://img.youtube.com/vi/${w.youtubeId}/hqdefault.jpg`}
                alt={w.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <span className="absolute inset-0 grid place-items-center opacity-90">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-neon-purple/90 text-lg glow-purple">▶</span>
              </span>
              <span className="absolute right-2 top-2 rounded bg-background/80 px-2 py-0.5 text-[10px]">{w.duration}</span>
              <span className="absolute left-2 top-2 rounded bg-neon-cyan/20 px-2 py-0.5 text-[10px] text-neon-cyan">{w.category}</span>
            </button>
            <div className="p-4">
              <h3 className="font-display text-sm font-black leading-tight line-clamp-2">{w.title}</h3>
              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{w.description}</p>
              <p className="mt-2 text-[10px] text-neon-gold">Source: {w.source}</p>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <GlassCard className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center text-sm text-muted-foreground">
            No matches. Try another category or search.
          </GlassCard>
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-xl p-3 sm:p-6" onClick={() => setActive(null)}>
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neon-purple/50 glow-purple"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80"
              aria-label="Close"
            >✕</button>
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
                title={active.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="bg-background/95 p-4">
              <div className="font-display text-lg font-black">{active.title}</div>
              <div className="text-[11px] text-muted-foreground">{active.category} · {active.duration} · Source: {active.source}</div>
              <p className="mt-2 text-sm text-muted-foreground">{active.description}</p>
            </div>
          </div>
        </div>
      )}
    </ArenaShell>
  );
}
