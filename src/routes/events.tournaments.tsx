import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { TOURNAMENTS, type Tournament } from "@/lib/arena-data";

export const Route = createFileRoute("/events/tournaments")({
  head: () => ({ meta: [{ title: "Tournaments — ArenaVerse Esports" }] }),
  component: TournamentsPage,
});

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "live", label: "Live" },
  { key: "completed", label: "Completed" },
  { key: "student", label: "Student Events" },
  { key: "premium", label: "Premium Events" },
] as const;

function TournamentsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("upcoming");
  const [detail, setDetail] = useState<Tournament | null>(null);
  const [registered, setRegistered] = useState<Record<string, boolean>>({});

  const items = useMemo(() => TOURNAMENTS.filter(t => t.status === tab), [tab]);

  return (
    <ArenaShell title="Esports Tournaments">
      <p className="-mt-4 mb-8 text-sm text-muted-foreground">Battle for glory · Win cash prizes · Become a campus legend.</p>

      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${tab===t.key?"bg-gradient-to-r from-neon-purple to-neon-blue text-foreground glow-purple":"glass text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
        ))}
      </div>

      {items.length === 0 ? (
        <GlassCard><p className="text-sm text-muted-foreground">No tournaments here yet — check back soon.</p></GlassCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map(t => <TCard key={t.id} t={t} registered={!!registered[t.id]} onOpen={() => setDetail(t)} onRegister={() => setRegistered(r => ({...r, [t.id]: true}))} />)}
        </div>
      )}

      {detail && <DetailModal t={detail} registered={!!registered[detail.id]} onClose={() => setDetail(null)} onRegister={() => setRegistered(r => ({...r, [detail.id]: true}))} />}
    </ArenaShell>
  );
}

function TCard({ t, registered, onOpen, onRegister }: { t: Tournament; registered: boolean; onOpen: () => void; onRegister: () => void }) {
  const cd = useCountdown(t.date);
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-neon-purple/60 hover:glow-purple">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={t.banner} alt={t.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-1 text-[10px] uppercase tracking-wider text-neon-cyan">{t.status}</div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-[10px] uppercase tracking-wider text-neon-gold">{t.game}</div>
          <div className="font-display text-xl font-black">{t.title}</div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <Stat label="Prize Pool" value={`₹${t.prize.toLocaleString()}`} accent />
          <Stat label="Entry" value={t.entry === 0 ? "FREE" : `₹${t.entry}`} />
          <Stat label="Players" value={t.participants} />
        </div>
        <div className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-2 text-center text-xs">
          <span className="text-muted-foreground">{t.status === "completed" ? "Completed on" : t.status === "live" ? "LIVE NOW" : "Starts in"}</span>{" "}
          <span className="font-display font-black text-neon-cyan">{cd}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpen} className="flex-1 rounded-full glass py-2 text-xs hover:border-neon-cyan/60">View Details</button>
          {t.status === "upcoming" || t.status === "student" || t.status === "premium" ? (
            <button onClick={onRegister} disabled={registered} className={`flex-1 rounded-full py-2 text-xs font-bold transition ${registered?"bg-neon-cyan/20 text-neon-cyan":"bg-gradient-to-r from-neon-purple to-neon-blue glow-purple"}`}>
              {registered ? "✓ Registered" : "Register"}
            </button>
          ) : t.status === "completed" ? (
            <button onClick={onOpen} className="flex-1 rounded-full bg-neon-gold/20 py-2 text-xs font-bold text-neon-gold">🏆 Results</button>
          ) : (
            <a className="flex-1 rounded-full bg-destructive/20 py-2 text-center text-xs font-bold text-destructive animate-pulse">● Watch Live</a>
          )}
        </div>
      </div>
    </article>
  );
}

function DetailModal({ t, registered, onClose, onRegister }: { t: Tournament; registered: boolean; onClose: () => void; onRegister: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-xl p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neon-purple/40 bg-background glow-purple" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80">✕</button>
        <div className="relative aspect-[21/9]">
          <img src={t.banner} alt={t.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="text-[10px] uppercase tracking-wider text-neon-gold">{t.game}</div>
            <div className="font-display text-3xl font-black neon-text">{t.title}</div>
          </div>
        </div>
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-center text-xs">
            <Stat label="Prize Pool" value={`₹${t.prize.toLocaleString()}`} accent />
            <Stat label="Entry" value={t.entry === 0 ? "FREE" : `₹${t.entry}`} />
            <Stat label="Players" value={t.participants} />
            <Stat label="Date" value={t.date} />
          </div>
          <Section title="Schedule">
            <p>Check-in 30 min before. Brackets published at start. Finals streamed live on the ArenaVerse cinema screen.</p>
          </Section>
          <Section title="Rules">
            <ul className="space-y-1">{t.rules.map(r => <li key={r}>· {r}</li>)}</ul>
          </Section>
          <Section title="Prizes">
            <ul className="space-y-1">
              <li>🥇 1st — ₹{Math.round(t.prize * 0.5).toLocaleString()}</li>
              <li>🥈 2nd — ₹{Math.round(t.prize * 0.3).toLocaleString()}</li>
              <li>🥉 3rd — ₹{Math.round(t.prize * 0.2).toLocaleString()}</li>
            </ul>
          </Section>
          {t.status === "completed" && (
            <Section title="Results">
              <p>🥇 Team Phoenix · 🥈 Cyber Wolves · 🥉 Neon Squad</p>
            </Section>
          )}
          <div className="flex flex-wrap gap-3">
            {t.status !== "completed" && t.status !== "live" && (
              <button onClick={onRegister} disabled={registered} className="btn-primary disabled:opacity-60">{registered ? "✓ Registered" : "Register Now"}</button>
            )}
            <button onClick={async () => { try { await navigator.share?.({ title: t.title, text: `Join ${t.title} at ArenaVerse — Prize ₹${t.prize}`, url: location.href }); } catch {} }} className="rounded-full glass px-5 py-3 text-sm">↗ Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h4 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">{title}</h4><div className="mt-2 text-sm text-muted-foreground">{children}</div></div>;
}
function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return <div className="rounded-xl border border-border bg-background/40 p-2"><div className={`font-display text-base font-black ${accent?"text-neon-gold":"text-foreground"}`}>{value}</div><div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div></div>;
}

function useCountdown(date: string) {
  const [now, setNow] = useState(Date.now());
  useMemo(() => { const i = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(i); }, []);
  const diff = new Date(date).getTime() - now;
  if (diff <= 0) return "Started";
  const d = Math.floor(diff / 86400000); const h = Math.floor((diff % 86400000)/3600000);
  return `${d}d ${h}h`;
}
