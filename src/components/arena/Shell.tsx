import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useArena, arena } from "@/lib/arena-store";

const MENU: { label: string; to: string; icon: string }[] = [
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

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("arena_theme")) as "dark" | "light" | null;
    const t = saved ?? "dark";
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("arena_theme", next);
  };
  return { theme, toggle };
}

export function ArenaShell({ children, title }: { children: ReactNode; title?: string }) {
  const user = useArena((s) => s.user);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-neon-purple/25 blur-[120px]" />
        <div className="absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full bg-neon-cyan/15 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-xl glass hover:glow-purple transition"
            >
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-4 bg-foreground" />
                <span className="block h-0.5 w-4 bg-foreground" />
                <span className="block h-0.5 w-4 bg-foreground" />
              </span>
            </button>
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue glow-purple font-display font-black">A</div>
              <span className="font-display text-lg font-black tracking-wider neon-text">ARENAVERSE</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/movies" className="hover:text-foreground">Movies</Link>
            <Link to="/gaming/booking" className="hover:text-foreground">Gaming</Link>
            <Link to="/events/tournaments" className="hover:text-foreground">Tournaments</Link>
            <Link to="/food" className="hover:text-foreground">Food</Link>
            <Link to="/pass" className="hover:text-foreground">My Pass</Link>
            <Link to="/about" className="hover:text-foreground">About</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-xl glass text-sm"
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {user ? (
              <>
                <Link to="/profile" className="hidden sm:inline text-xs text-muted-foreground hover:text-foreground">
                  Hi, <span className="text-foreground font-semibold">{user.name}</span>
                  {user.type === "university" && <span className="ml-2 rounded-full bg-neon-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neon-gold">UU · -{user.discountPct}%</span>}
                </Link>
                <button onClick={() => arena.logout()} className="text-xs text-muted-foreground hover:text-foreground">Logout</button>
              </>
            ) : (
              <Link to="/auth/login" className="btn-primary !px-4 !py-2 !text-xs">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      {/* Menu Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] glass border-r border-border p-6 overflow-y-auto animate-in slide-in-from-left">
            <div className="flex items-center justify-between">
              <span className="font-display font-black neon-text tracking-wider">ARENAVERSE</span>
              <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full glass" aria-label="Close">✕</button>
            </div>
            {user && (
              <div className="mt-5 rounded-xl glass p-3">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="font-semibold">{user.name}</p>
              </div>
            )}
            <nav className="mt-5 flex flex-col gap-1">
              {MENU.map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-neon-purple/15 hover:text-foreground text-muted-foreground transition"
                >
                  <span className="text-base">{m.icon}</span>
                  {m.label}
                </Link>
              ))}
              <div className="my-3 h-px bg-border" />
              {user ? (
                <button
                  onClick={() => { arena.logout(); setOpen(false); }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <span>🚪</span> Logout
                </button>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-neon-purple/15">
                    <span>🔐</span> Login
                  </Link>
                  <Link to="/auth/signup" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-neon-purple/15">
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
      )}

      {title && (
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <h1 className="font-display text-4xl font-black neon-text">{title}</h1>
        </div>
      )}
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>

      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} ArenaVerse · United University, Rawatpur, Prayagraj
          </div>
          <div className="flex items-center gap-4">
            <span>Founder: <span className="text-foreground font-semibold">Ammar Ansari</span></span>
            <a href="tel:9120106944" className="text-neon-cyan hover:underline">+91 91201 06944</a>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/support" className="hover:text-foreground">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-6 ${className}`}>{children}</div>;
}
