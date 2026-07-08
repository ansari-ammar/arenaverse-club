import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { MOVIES, type Movie } from "@/lib/arena-data";

export const Route = createFileRoute("/movies")({
  head: () => ({ meta: [{ title: "Movies — ArenaVerse Cinema" }] }),
  component: MoviesPage,
});

const CATEGORIES = ["All", "Hollywood", "Bollywood", "Action", "Comedy", "Thriller", "Sci-Fi", "Horror", "Romance", "Family", "Animation", "Anime", "Esports"] as const;

function MoviesPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [trailer, setTrailer] = useState<Movie | null>(null);

  const featured = useMemo(() => MOVIES.filter(m => m.section.includes("featured")), []);
  const visible = useMemo(() => cat === "All" ? MOVIES : MOVIES.filter(m => m.category === cat), [cat]);
  const sections = [
    { key: "now", label: "Now Showing" },
    { key: "top", label: "Top Rated" },
    { key: "recommended", label: "Recommended for You" },
    { key: "upcoming", label: "Upcoming" },
  ] as const;

  const hero = featured[featuredIdx % featured.length];

  return (
    <ArenaShell>
      {/* Featured carousel */}
      <section className="relative -mt-10 mb-12 overflow-hidden rounded-3xl border border-border">
        <div className="absolute inset-0">
          <img src={hero.backdrop} alt="" className="h-full w-full object-cover scale-105 blur-[1px] opacity-70 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="relative grid gap-6 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <span className="rounded-full bg-neon-gold/20 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-neon-gold">Featured · {hero.category}</span>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-black neon-text">{hero.title}</h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">{hero.synopsis}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <Pill>★ {hero.rating}</Pill><Pill>{hero.duration}</Pill><Pill>{hero.language}</Pill><Pill>{hero.year}</Pill><Pill>{hero.seatsLeft} seats left</Pill>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/movies/book-seat" search={{ id: hero.id }} className="btn-primary">🎟 Book Now · ₹{hero.price}+</Link>
              <button onClick={() => setTrailer(hero)} className="rounded-full glass px-5 py-3 text-sm hover:border-neon-cyan/60">▶ Watch Trailer</button>
            </div>
          </div>
          <div className="hidden md:flex items-end justify-end">
            <div className="relative aspect-[2/3] w-56 overflow-hidden rounded-2xl border border-neon-purple/40 glow-purple">
              <img src={hero.img} alt={hero.title} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-between px-8 pb-6 md:px-12">
          <div className="flex gap-2">
            {featured.map((_, i) => (
              <button key={i} onClick={() => setFeaturedIdx(i)} className={`h-1.5 rounded-full transition-all ${i===featuredIdx?"w-10 bg-neon-cyan":"w-4 bg-border"}`} />
            ))}
          </div>
          <div className="flex gap-2 text-xs">
            <button onClick={() => setFeaturedIdx((featuredIdx - 1 + featured.length) % featured.length)} className="rounded-full glass px-3 py-2">←</button>
            <button onClick={() => setFeaturedIdx((featuredIdx + 1) % featured.length)} className="rounded-full glass px-3 py-2">→</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${cat===c?"bg-gradient-to-r from-neon-purple to-neon-blue text-foreground glow-purple":"glass text-muted-foreground hover:text-foreground"}`}>{c}</button>
        ))}
      </div>

      {cat !== "All" ? (
        <Grid movies={visible} onTrailer={setTrailer} title={`${cat} · ${visible.length} films`} />
      ) : (
        <div className="space-y-14">
          {sections.map(s => (
            <Grid key={s.key} title={s.label} onTrailer={setTrailer} movies={MOVIES.filter(m => m.section.includes(s.key as Movie["section"][number]))} />
          ))}
        </div>
      )}

      {trailer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-xl p-4" onClick={() => setTrailer(null)}>
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neon-purple/50 glow-purple" onClick={e => e.stopPropagation()}>
            <button onClick={() => setTrailer(null)} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80">✕</button>
            <div className="aspect-video">
              <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${trailer.trailer}?autoplay=1`} title={trailer.title} allow="autoplay; encrypted-media" allowFullScreen />
            </div>
            <div className="bg-background/90 p-4">
              <div className="font-display text-xl font-black">{trailer.title}</div>
              <div className="text-xs text-muted-foreground">{trailer.category} · {trailer.language} · {trailer.year} · ★ {trailer.rating}</div>
            </div>
          </div>
        </div>
      )}
    </ArenaShell>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full glass px-3 py-1">{children}</span>;
}

function Grid({ title, movies, onTrailer }: { title: string; movies: Movie[]; onTrailer: (m: Movie) => void }) {
  const nav = useNavigate();
  if (movies.length === 0) return null;
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl font-black tracking-wide">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map(m => (
          <article key={m.id + title} className="group relative overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-neon-purple/60 hover:glow-purple">
            <div className="relative aspect-[2/3] overflow-hidden">
              <img src={m.img} alt={m.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
              <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-1 text-[10px] font-bold text-neon-gold">★ {m.rating}</div>
              <button onClick={() => onTrailer(m)} className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
                <span className="rounded-full bg-neon-purple/90 px-5 py-3 text-xs font-bold glow-purple">▶ Trailer</span>
              </button>
            </div>
            <div className="space-y-2 p-4">
              <h3 className="font-display text-lg font-black truncate">{m.title}</h3>
              <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                <span className="rounded bg-secondary px-2 py-0.5">{m.category}</span>
                <span className="rounded bg-secondary px-2 py-0.5">{m.duration}</span>
                <span className="rounded bg-secondary px-2 py-0.5">{m.language}</span>
                <span className="rounded bg-secondary px-2 py-0.5">{m.year}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className={`text-xs ${m.seatsLeft < 20 ? "text-destructive" : "text-neon-cyan"}`}>{m.seatsLeft} seats left</span>
                <button onClick={() => nav({ to: "/movies/book-seat", search: { id: m.id } })} className="rounded-full bg-gradient-to-r from-neon-purple to-neon-blue px-4 py-1.5 text-xs font-bold glow-purple">Book ₹{m.price}</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
