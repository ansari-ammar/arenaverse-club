import { createFileRoute, Link } from "@tanstack/react-router";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Story of ArenaVerse" },
      { name: "description", content: "How ArenaVerse turned United University into a premium entertainment destination." },
    ],
  }),
  component: About,
});

const TIMELINE = [
  { year: "2024", title: "The Idea", body: "Ammar Ansari envisioned a premium space inside United University where students could unwind beyond academics." },
  { year: "2025", title: "The Build", body: "Gaming arena, mini theatre and food lounge concepts came together under one luxury brand." },
  { year: "2026", title: "The Launch", body: "ArenaVerse opens its doors to students, faculty and visitors on the Rawatpur campus." },
  { year: "Next", title: "The Future", body: "VR arenas, esports tournaments, GTA VI showcase, and a bigger cinema experience." },
];

function About() {
  return (
    <ArenaShell title="The Story of ArenaVerse">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard className="!p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-neon-cyan">Our Story</p>
          <h2 className="mt-3 font-display text-3xl font-black neon-text">Where campus life meets luxury entertainment.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            ArenaVerse was created by <span className="text-foreground font-semibold">Ammar Ansari</span>, Founder, to give
            students, faculty, and visitors a premium space to relax, enjoy gaming, watch movies, connect with people,
            participate in tournaments, and create memories beyond academics.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Built inside United University, Rawatpur, Prayagraj — ArenaVerse transforms campus life into a modern
            entertainment experience where learning and enjoyment coexist. From a cinematic mini theatre to a
            competitive gaming arena and a lounge-style food menu, every corner is designed to feel premium.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border p-5">
              <p className="text-xs uppercase tracking-widest text-neon-purple">Mission</p>
              <p className="mt-2 text-sm">Make premium entertainment accessible inside campus, without leaving the university.</p>
            </div>
            <div className="rounded-2xl border border-border p-5">
              <p className="text-xs uppercase tracking-widest text-neon-cyan">Vision</p>
              <p className="mt-2 text-sm">Become India's leading student-first gaming & cinema club, one campus at a time.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.3em] text-neon-gold">Founder</p>
          <h3 className="mt-3 font-display text-2xl font-black">Ammar Ansari</h3>
          <p className="mt-1 text-sm text-muted-foreground">Founder · ArenaVerse</p>
          <div className="mt-5 space-y-2 text-sm">
            <p><span className="text-muted-foreground">Campus:</span> United University, Rawatpur, Prayagraj</p>
            <p><span className="text-muted-foreground">Contact:</span> <a className="text-neon-cyan hover:underline" href="tel:9120106944">+91 91201 06944</a></p>
          </div>
          <div className="mt-6 flex gap-3">
            <Link to="/support" className="btn-primary !px-4 !py-2 !text-xs">Contact us</Link>
            <Link to="/booking" className="btn-ghost-neon !px-4 !py-2 !text-xs">Book Experience</Link>
          </div>
        </GlassCard>
      </div>

      <div className="mt-10">
        <h3 className="font-display text-2xl font-black mb-5">Timeline</h3>
        <div className="grid gap-4 md:grid-cols-4">
          {TIMELINE.map((t) => (
            <div key={t.year} className="glass rounded-2xl p-5">
              <p className="font-display text-3xl font-black neon-text">{t.year}</p>
              <p className="mt-2 font-semibold">{t.title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: "500+", v: "Weekly players" },
          { k: "50", v: "Cinema seats" },
          { k: "20+", v: "Games on rotation" },
          { k: "24/7", v: "Support" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl border border-border p-5 text-center">
            <p className="font-display text-3xl font-black neon-text-gold">{s.k}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </div>
    </ArenaShell>
  );
}
