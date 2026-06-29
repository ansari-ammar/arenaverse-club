import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-arena.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ArenaVerse" },
      { name: "description", content: "Sign in to ArenaVerse to book gaming slots, theatre seats and unlock student rewards." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [tab, setTab] = useState<"university" | "guest">("university");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/85 to-background" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-neon-purple/30 blur-[120px]" />
        <div className="absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full bg-neon-cyan/20 blur-[120px]" />
      </div>

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        {/* Left — brand panel */}
        <div className="hidden lg:flex flex-col gap-8">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue glow-purple font-display font-black text-lg">A</div>
            <span className="font-display text-2xl font-black tracking-wider neon-text">ARENAVERSE</span>
          </Link>

          <div>
            <span className="glass inline-block rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em] text-neon-cyan">
              Member Access
            </span>
            <h1 className="mt-5 font-display text-5xl font-black leading-[1.05] xl:text-6xl">
              Enter the <span className="neon-text">ArenaVerse</span>.
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              Sign in to book gaming slots, reserve theatre seats, earn rewards and join tournaments inside United University.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              "Student discounts up to 25% off",
              "Priority booking on weekends",
              "Climb the weekly leaderboard",
              "Digital QR passes for every booking",
            ].map((p) => (
              <li key={p} className="flex items-center gap-3 text-muted-foreground">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-neon-purple/20 text-neon-cyan text-xs">✦</span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-auto glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Founder</div>
            <div className="mt-2 font-display text-2xl font-black neon-text-gold">Ammar Ansari</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Building the coolest chill zone inside United University, Prayagraj.
            </p>
          </div>
        </div>

        {/* Right — form card */}
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center justify-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue glow-purple font-display font-black">A</div>
            <span className="font-display text-xl font-black tracking-wider neon-text">ARENAVERSE</span>
          </div>

          <div className="glass rounded-3xl p-8 shadow-2xl">
            <h2 className="font-display text-3xl font-black">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to continue your journey.
            </p>

            {/* Tabs */}
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-secondary/60 p-1">
              {(["university", "guest"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    tab === t
                      ? "bg-gradient-to-r from-neon-purple to-neon-blue text-foreground glow-purple"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "university" ? "🎓 University" : "👤 Guest"}
                </button>
              ))}
            </div>

            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              {tab === "university" ? (
                <Field label="University ID" placeholder="UU2024XXXX" type="text" />
              ) : (
                <Field label="Full Name" placeholder="Your name" type="text" />
              )}
              <Field label="Email" placeholder="you@example.com" type="email" />
              <Field label="Password" placeholder="••••••••" type="password" />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="accent-neon-purple" /> Remember me
                </label>
                <a href="#" className="text-neon-cyan hover:underline">Forgot password?</a>
              </div>

              <button type="submit" className="btn-primary w-full">
                {tab === "university" ? "Sign in with University ID" : "Continue as Guest"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialBtn label="Google" icon="G" />
              <SocialBtn label="OTP" icon="📱" />
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              New to ArenaVerse?{" "}
              <a href="#" className="text-neon-cyan hover:underline">Create an account</a>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-neon-cyan transition">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30"
      />
    </label>
  );
}

function SocialBtn({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="glass rounded-xl py-3 text-sm font-semibold transition hover:border-neon-cyan/60 hover:text-neon-cyan">
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}
