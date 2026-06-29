import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useArena, arena } from "@/lib/arena-store";

export function ArenaShell({ children, title }: { children: ReactNode; title?: string }) {
  const user = useArena((s) => s.user);
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-neon-purple/25 blur-[120px]" />
        <div className="absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full bg-neon-cyan/15 blur-[120px]" />
      </div>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue glow-purple font-display font-black">A</div>
            <span className="font-display text-lg font-black tracking-wider neon-text">ARENAVERSE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/booking" className="hover:text-foreground">Book</Link>
            <Link to="/gaming/booking" className="hover:text-foreground">Gaming</Link>
            <Link to="/movies/seats" className="hover:text-foreground">Movies</Link>
            <Link to="/pass" className="hover:text-foreground">My Pass</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-xs text-muted-foreground">
                  Hi, <span className="text-foreground font-semibold">{user.name}</span>
                  {user.type === "university" && <span className="ml-2 rounded-full bg-neon-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neon-gold">UU · -{user.discountPct}%</span>}
                </span>
                <button onClick={() => arena.logout()} className="text-xs text-muted-foreground hover:text-foreground">Logout</button>
              </>
            ) : (
              <Link to="/auth/login" className="btn-primary !px-4 !py-2 !text-xs">Sign in</Link>
            )}
          </div>
        </div>
      </header>
      {title && (
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <h1 className="font-display text-4xl font-black neon-text">{title}</h1>
        </div>
      )}
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-6 ${className}`}>{children}</div>;
}
