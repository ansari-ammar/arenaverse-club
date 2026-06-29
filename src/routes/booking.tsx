import { createFileRoute, Link } from "@tanstack/react-router";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import gamingImg from "@/assets/gaming-card.jpg";
import cinemaImg from "@/assets/cinema-card.jpg";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Book — ArenaVerse" }] }),
  component: BookingHub,
});

function BookingHub() {
  return (
    <ArenaShell title="Book your experience">
      <p className="text-muted-foreground -mt-4 mb-8">Pick where the night goes. Real-time availability across the arena.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/gaming/booking" className="group">
          <GlassCard className="relative overflow-hidden p-0 h-full">
            <img src={gamingImg} alt="Gaming Arena" className="h-64 w-full object-cover transition group-hover:scale-105" />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-black">Gaming Arena</h2>
                <span className="rounded-full bg-neon-purple/20 px-3 py-1 text-xs text-neon-cyan">Open · 12 seats free</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">PS5, PC rigs, racing simulators & VR. Book by the hour.</p>
              <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                <span>From <span className="text-foreground font-semibold">₹60/hr</span></span>
                <span>Avg session 2h</span>
                <span className="text-neon-cyan">Live →</span>
              </div>
            </div>
          </GlassCard>
        </Link>
        <Link to="/movies/seats" className="group">
          <GlassCard className="relative overflow-hidden p-0 h-full">
            <img src={cinemaImg} alt="Mini Theatre" className="h-64 w-full object-cover transition group-hover:scale-105" />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-black">Mini Theatre</h2>
                <span className="rounded-full bg-neon-cyan/20 px-3 py-1 text-xs text-neon-cyan">Next show · 6:15 PM</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">50-seat boutique cinema. Dolby sound, recliners, gourmet food.</p>
              <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                <span>From <span className="text-foreground font-semibold">₹180/seat</span></span>
                <span>4 shows daily</span>
                <span className="text-neon-cyan">Pick seats →</span>
              </div>
            </div>
          </GlassCard>
        </Link>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-4 text-center">
        {[
          ["1", "Pick experience"],
          ["2", "Choose slot"],
          ["3", "Customize & pay"],
          ["4", "Get QR pass"],
        ].map(([n, l]) => (
          <div key={n} className="glass rounded-2xl p-4">
            <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-neon-purple to-neon-blue font-display font-black text-sm">{n}</div>
            <div className="mt-2 text-sm font-semibold">{l}</div>
          </div>
        ))}
      </div>
    </ArenaShell>
  );
}
