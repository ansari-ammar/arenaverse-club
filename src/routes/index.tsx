import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-arena.jpg";
import gamingImg from "@/assets/gaming-card.jpg";
import cinemaImg from "@/assets/cinema-card.jpg";
import fifaImg from "@/assets/games/fifa.jpg";
import codImg from "@/assets/games/cod.jpg";
import gtaImg from "@/assets/games/gta.jpg";
import valorantImg from "@/assets/games/valorant.jpg";
import tekkenImg from "@/assets/games/tekken.jpg";
import minecraftImg from "@/assets/games/minecraft.jpg";
import pubgImg from "@/assets/games/pubg.jpg";
import nfsImg from "@/assets/games/nfs.jpg";
import { arena, useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/")({
  component: ArenaVerse,
});

// Every nav item maps to a real route
const NAV: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Gaming", to: "/gaming/booking" },
  { label: "Movies", to: "/movies" },
  { label: "Leaderboard", to: "/events/tournaments" },
  { label: "Food", to: "/food" },
  { label: "Tournaments", to: "/events/tournaments" },
  { label: "Support", to: "/support" },
  { label: "About", to: "/about" },
];

const DRAWER: { label: string; to: string; icon: string }[] = [
  { label: "Home", to: "/", icon: "🏠" },
  { label: "Gaming", to: "/gaming/booking", icon: "🎮" },
  { label: "Movies", to: "/movies", icon: "🎬" },
  { label: "Book Experience", to: "/booking", icon: "🎟️" },
  { label: "Food Lounge", to: "/food", icon: "🍿" },
  { label: "Tournaments", to: "/events/tournaments", icon: "🏆" },
  { label: "My Pass", to: "/pass", icon: "🪪" },
  { label: "Profile", to: "/profile", icon: "👤" },
  { label: "Support", to: "/support", icon: "🛟" },
  { label: "About", to: "/about", icon: "✨" },
];

const GAMES = [
  { name: "FIFA 25", genre: "Sports", players: "1-4", price: "₹120", rating: 4.9, img: fifaImg },
  { name: "Call of Duty", genre: "FPS", players: "1-6", price: "₹150", rating: 4.8, img: codImg },
  { name: "GTA V", genre: "Open World", players: "1-2", price: "₹100", rating: 4.9, img: gtaImg },
  { name: "Valorant", genre: "Tactical", players: "1-5", price: "₹140", rating: 4.7, img: valorantImg },
  { name: "Tekken 8", genre: "Fighting", players: "1-2", price: "₹110", rating: 4.8, img: tekkenImg },
  { name: "Minecraft", genre: "Sandbox", players: "1-4", price: "₹90", rating: 4.9, img: minecraftImg },
  { name: "PUBG", genre: "Battle Royale", players: "1-4", price: "₹130", rating: 4.6, img: pubgImg },
  { name: "Need for Speed", genre: "Racing", players: "1-2", price: "₹120", rating: 4.7, img: nfsImg },
];

const MOVIES = [
  { title: "Dune: Part Three", genre: "Sci-Fi", time: "7:30 PM", rating: "9.1", hue: "from-amber-600 to-orange-700" },
  { title: "Spider-Verse", genre: "Animation", time: "5:00 PM", rating: "9.4", hue: "from-pink-500 to-red-600" },
  { title: "Oppenheimer", genre: "Drama", time: "9:00 PM", rating: "8.8", hue: "from-orange-600 to-red-800" },
  { title: "John Wick 5", genre: "Action", time: "10:30 PM", rating: "8.6", hue: "from-zinc-700 to-zinc-900" },
  { title: "Demon Slayer", genre: "Anime", time: "3:00 PM", rating: "9.2", hue: "from-red-500 to-purple-700" },
  { title: "Interstellar", genre: "Sci-Fi", time: "8:00 PM", rating: "9.0", hue: "from-blue-700 to-indigo-900" },
];

const LEADERS = [
  { rank: 1, name: "Aarav Singh", score: 24850, hours: 142, badge: "👑" },
  { rank: 2, name: "Riya Sharma", score: 22310, hours: 128, badge: "🥈" },
  { rank: 3, name: "Kabir Khan", score: 21090, hours: 119, badge: "🥉" },
  { rank: 4, name: "Ishaan Verma", score: 19440, hours: 108, badge: "⚡" },
  { rank: 5, name: "Ananya Gupta", score: 18920, hours: 102, badge: "🔥" },
];

const FOOD = [
  { name: "Loaded Nachos", price: "₹180", emoji: "🌮" },
  { name: "Truffle Popcorn", price: "₹120", emoji: "🍿" },
  { name: "Smash Burger", price: "₹220", emoji: "🍔" },
  { name: "Wood-fired Pizza", price: "₹280", emoji: "🍕" },
  { name: "Cold Coffee", price: "₹140", emoji: "☕" },
  { name: "Energy Mocktail", price: "₹160", emoji: "🥤" },
];

function ArenaVerse() {
  const [count, setCount] = useState(127);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 3) - 1), 2500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-neon-purple/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-neon-blue/25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-neon-cyan/15 blur-[120px]" />
      </div>

      <Nav onMenu={() => setMenuOpen(true)} />
      {menuOpen && <Drawer onClose={() => setMenuOpen(false)} />}
      <Hero count={count} />
      <Marquee />
      <SplitExperience />
      <Gaming />
      <Movies />
      <Leaderboard />
      <Food />
      <Membership />
      <Footer />

      <Link
        to="/booking"
        className="fixed bottom-6 right-6 z-40 btn-primary text-sm uppercase tracking-widest animate-pulse-glow"
      >
        ⚡ Book Your Experience
      </Link>
    </div>
  );
}

function Nav({ onMenu }: { onMenu: () => void }) {
  const user = useArena((s) => s.user);
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-xl glass hover:glow-purple transition"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-foreground" />
              <span className="block h-0.5 w-4 bg-foreground" />
              <span className="block h-0.5 w-4 bg-foreground" />
            </span>
          </button>
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue glow-purple font-display font-black">A</div>
            <span className="font-display text-xl font-black tracking-wider neon-text">ARENAVERSE</span>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className="hover:text-neon-cyan transition-colors">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition">
                Hi, <span className="text-foreground font-semibold">{user.name}</span>
              </Link>
              <Link to="/booking" className="btn-primary text-sm">Book</Link>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition">Sign in</Link>
              <Link to="/auth/signup" className="btn-primary text-sm">Join Club</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Drawer({ onClose }: { onClose: () => void }) {
  const user = useArena((s) => s.user);
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <aside className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] glass border-r border-border p-6 overflow-y-auto animate-in slide-in-from-left">
        <div className="flex items-center justify-between">
          <span className="font-display font-black neon-text tracking-wider">ARENAVERSE</span>
          <button onClick={onClose} className="h-8 w-8 rounded-full glass" aria-label="Close">✕</button>
        </div>
        {user && (
          <div className="mt-5 rounded-xl glass p-3">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="font-semibold">{user.name}</p>
          </div>
        )}
        <nav className="mt-5 flex flex-col gap-1">
          {DRAWER.map((m) => (
            <Link
              key={m.label}
              to={m.to}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-neon-purple/15 hover:text-foreground text-muted-foreground transition"
            >
              <span className="text-base">{m.icon}</span>
              {m.label}
            </Link>
          ))}
          <div className="my-3 h-px bg-border" />
          {user ? (
            <button
              onClick={() => { arena.logout(); onClose(); }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <span>🚪</span> Logout
            </button>
          ) : (
            <>
              <Link to="/auth/login" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-neon-purple/15">
                <span>🔐</span> Login
              </Link>
              <Link to="/auth/signup" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-neon-purple/15">
                <span>✨</span> Sign up
              </Link>
            </>
          )}
        </nav>
        <div className="mt-6 rounded-xl border border-border p-3 text-[11px] text-muted-foreground">
          <p className="font-semibold text-foreground">Contact</p>
          <p className="mt-1">Ammar Ansari · Founder</p>
          <a href="tel:9120106944" className="text-neon-cyan hover:underline">+91 91201 06944</a>
        </div>
      </aside>
    </div>
  );
}

function Hero({ count }: { count: number }) {
  return (
    <section id="home" className="relative min-h-[92vh] grid-bg">
      <div className="absolute inset-0">
        <img src={heroImg} alt="ArenaVerse" width={1920} height={1088} className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-6 py-24 lg:py-32">
        <div className="glass inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-neon-cyan">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-neon-cyan opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-neon-cyan" />
          </span>
          {count} players in arena now
        </div>

        <h1 className="mt-6 max-w-5xl font-display text-6xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">
          <span className="block neon-text">Play. Chill.</span>
          <span className="block text-foreground">Compete.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          The most luxurious gaming & cinema lounge inside United University, Prayagraj. Premium PS5, VR rigs,
          a 50-seat mini theatre, and a club-grade food lounge — all under one neon-lit roof.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/gaming/booking" className="btn-primary">🎮 Play Now</Link>
          <Link to="/movies" className="btn-ghost-neon">🎬 Book Movie</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground px-4 py-3 transition">
            Explore Zone →
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl">
          {[
            { k: "20+", v: "Gaming Rigs", to: "/gaming/booking" },
            { k: "50", v: "Cinema Seats", to: "/movies/book-seat" },
            { k: "149+", v: "Movies", to: "/movies" },
            { k: "₹100", v: "Starts From", to: "/booking" },
          ].map((s) => (
            <Link key={s.v} to={s.to} className="glass rounded-2xl p-4 hover:glow-purple transition">
              <div className="font-display text-3xl font-black neon-text-gold">{s.k}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.v}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["⚡ PS5 PRO ARENA", "🎬 50-SEAT MINI THEATRE", "🏆 WEEKLY TOURNAMENTS", "🍕 PREMIUM FOOD LOUNGE", "🎮 VR EXPERIENCE", "💎 LUXURY MEMBERSHIP", "🔥 STUDENT DISCOUNTS"];
  return (
    <div className="border-y border-white/5 bg-black/40 py-5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap gap-12 text-sm uppercase tracking-[0.3em] text-neon-cyan/80">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t}
            <span className="text-neon-purple">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SplitExperience() {
  const cards = [
    { img: gamingImg, kicker: "01 — ARENA", title: "Luxury Gaming Zone", desc: "Cutting-edge consoles, racing simulators, VR headsets and ultra-wide gaming PCs in a neon-soaked cathedral.", cta: "Enter Arena", to: "/gaming/booking", glow: "glow-purple" },
    { img: cinemaImg, kicker: "02 — THEATRE", title: "Mini Cinema Experience", desc: "Recliner seats, Dolby sound, 4K projection and a curated lineup of 149+ films — from blockbusters to anime.", cta: "Book a Seat", to: "/movies/book-seat", glow: "glow-cyan" },
  ] as const;
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.title} to={c.to} className="group relative overflow-hidden rounded-3xl glass">
            <div className="relative aspect-[5/4] overflow-hidden">
              <img src={c.img} alt={c.title} width={800} height={600} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
            <div className="p-8">
              <div className="text-xs uppercase tracking-[0.3em] text-neon-cyan">{c.kicker}</div>
              <h3 className="mt-3 font-display text-3xl font-black md:text-4xl">{c.title}</h3>
              <p className="mt-3 text-muted-foreground">{c.desc}</p>
              <span className={`mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue px-5 py-2.5 text-sm font-semibold ${c.glow}`}>
                {c.cta} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ kicker, title, sub, action }: { kicker: string; title: string; sub: string; action?: { label: string; to: string } }) {
  return (
    <div className="mb-12 flex flex-col items-start gap-3">
      <span className="glass rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em] text-neon-cyan">{kicker}</span>
      <h2 className="font-display text-4xl font-black md:text-6xl">{title}</h2>
      <p className="max-w-2xl text-muted-foreground">{sub}</p>
      {action && (
        <Link to={action.to} className="text-sm text-neon-cyan hover:text-foreground transition mt-1">{action.label} →</Link>
      )}
    </div>
  );
}

function Gaming() {
  return (
    <section id="gaming" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader kicker="Gaming Zone" title="Ultimate Gaming Experience" sub="From competitive FPS to chill open-world adventures — pick your title, book a slot, and let the arena handle the rest." action={{ label: "View all games", to: "/gaming/booking" }} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {GAMES.map((g) => (
          <Link key={g.name} to="/gaming/booking" className="group relative overflow-hidden rounded-2xl glass p-0.5 transition-all hover:-translate-y-1 hover:glow-purple">
            <div className="relative rounded-[14px] bg-card p-4">
              <div className="relative h-36 rounded-xl overflow-hidden mb-4">
                <img src={g.img} alt={g.name} width={800} height={600} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute top-2 right-2 glass rounded-md px-2 py-0.5 text-xs text-neon-gold">★ {g.rating}</div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-bold">{g.name}</h3>
                <span className="text-neon-gold text-sm font-bold">{g.price}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{g.genre}</span>
                <span>•</span>
                <span>{g.players} players</span>
              </div>
              <span className="mt-4 block w-full text-center rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-purple/40 py-2 text-xs font-semibold uppercase tracking-wider text-neon-cyan transition group-hover:from-neon-purple group-hover:to-neon-blue group-hover:text-foreground">
                Book Slot
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Movies() {
  return (
    <section id="movies" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader kicker="Theatre · 50 Seats" title="Now Showing Tonight" sub="A curated lineup of 149+ titles. Pick your seat on our interactive map, add snacks, and walk in with a luxury digital ticket." action={{ label: "Browse all movies", to: "/movies" }} />
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
        {MOVIES.map((m) => (
          <Link key={m.title} to="/movies" className="group relative overflow-hidden rounded-2xl glass transition hover:-translate-y-1">
            <div className={`relative aspect-[2/3] bg-gradient-to-br ${m.hue} overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-2 right-2 glass rounded-md px-2 py-0.5 text-xs text-neon-gold">★ {m.rating}</div>
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="text-xs uppercase tracking-wider text-neon-cyan">{m.genre}</div>
                <h3 className="font-display text-sm font-bold leading-tight mt-1">{m.title}</h3>
                <div className="mt-2 text-xs text-muted-foreground">⏰ {m.time}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Leaderboard() {
  return (
    <section id="leaderboard" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader kicker="Hall of Fame" title="Weekly Leaderboard" sub="The top warriors of ArenaVerse this week. Climb the ranks, unlock badges, win cash prizes." action={{ label: "See tournaments", to: "/events/tournaments" }} />
      <Link to="/events/tournaments" className="block glass overflow-hidden rounded-3xl hover:glow-purple transition">
        <div className="grid grid-cols-12 border-b border-white/5 px-6 py-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-3 text-right">Score</div>
          <div className="col-span-3 text-right">Hours</div>
        </div>
        {LEADERS.map((l) => (
          <div key={l.rank} className="grid grid-cols-12 items-center px-6 py-5 border-b border-white/5 last:border-0 hover:bg-neon-purple/5 transition">
            <div className="col-span-1 flex items-center gap-2">
              <span className="text-2xl">{l.badge}</span>
            </div>
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-neon-purple to-neon-blue font-display font-black">
                {l.name[0]}
              </div>
              <div className="truncate font-semibold">{l.name}</div>
            </div>
            <div className="col-span-3 text-right font-display font-bold neon-text-gold text-lg">{l.score.toLocaleString()}</div>
            <div className="col-span-3 text-right text-muted-foreground">{l.hours}h</div>
          </div>
        ))}
      </Link>
    </section>
  );
}

function Food() {
  return (
    <section id="food" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader kicker="Food Lounge" title="Fuel the Game" sub="Loaded snacks, premium mocktails and gaming energy drinks. Add to any booking in one tap." action={{ label: "Open full menu", to: "/food" }} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {FOOD.map((f) => (
          <Link key={f.name} to="/food" className="glass rounded-2xl p-5 text-center transition hover:-translate-y-1 hover:glow-purple">
            <div className="text-5xl">{f.emoji}</div>
            <div className="mt-3 font-semibold">{f.name}</div>
            <div className="mt-1 text-sm neon-text-gold font-bold">{f.price}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Membership() {
  const plans = [
    { name: "Starter", price: "₹0", tag: "Walk-in", perks: ["Pay per use", "Standard pricing", "QR digital pass"], glow: "", featured: false },
    { name: "Student Pro", price: "₹499", tag: "/ month", featured: true, perks: ["25% off all bookings", "Priority slots", "Free snack combo weekly", "Tournament entry"], glow: "glow-purple" },
    { name: "Elite Club", price: "₹1,499", tag: "/ month", perks: ["40% off everything", "Private theatre slot", "Unlimited tournaments", "Concierge support"], glow: "", featured: false },
  ];
  return (
    <section id="membership" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader kicker="Membership" title="Join the Club" sub="Unlock student discounts, priority bookings and exclusive tournaments inside United University." />
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`relative glass rounded-3xl p-8 ${p.featured ? "border-neon-purple/60 " + p.glow : ""}`}>
            {p.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-4 py-1 text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <div className="text-sm uppercase tracking-[0.2em] text-neon-cyan">{p.name}</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-black neon-text">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.tag}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-neon-cyan mt-0.5">✦</span> {perk}
                </li>
              ))}
            </ul>
            <Link to="/auth/signup" className={`mt-8 w-full inline-block text-center ${p.featured ? "btn-primary" : "btn-ghost-neon"}`}>
              {p.featured ? "Get Pro" : "Choose Plan"}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="book" className="relative mt-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-cyan/10" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-6xl font-black">
              Step into the <span className="neon-text">ArenaVerse</span>.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              United University Campus, Rawatpur, Prayagraj. Open daily 10am — 1am.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/booking" className="btn-primary">Book Your Experience</Link>
              <a
                href="https://maps.google.com/?q=United+University+Rawatpur+Prayagraj"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost-neon"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 md:flex-row md:justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue font-display font-black text-xs">A</div>
            <span className="font-display font-black tracking-wider">ARENAVERSE</span>
            <span className="opacity-60">© 2026</span>
          </div>
          <div className="text-xs uppercase tracking-[0.25em]">
            Founded by <span className="neon-text-gold font-bold">Ammar Ansari</span> · <a href="tel:9120106944" className="text-neon-cyan hover:underline normal-case tracking-normal">+91 91201 06944</a>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-neon-cyan transition">About</Link>
            <Link to="/support" className="hover:text-neon-cyan transition">Support</Link>
            <Link to="/profile" className="hover:text-neon-cyan transition">Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
