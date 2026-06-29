import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";
import { arena, useArena } from "@/lib/arena-store";

export const Route = createFileRoute("/auth/verify-otp")({
  head: () => ({ meta: [{ title: "Verify OTP — ArenaVerse" }] }),
  component: VerifyOtp,
});

// Demo OTP — any 6 digits work, "000000" simulates failure.
const VALID_LEN = 6;

function VerifyOtp() {
  const nav = useNavigate();
  const pendingContact = useArena((s) => s.pendingContact);
  const pendingType = useArena((s) => s.pendingType);
  const [digits, setDigits] = useState<string[]>(Array(VALID_LEN).fill(""));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed" | "expired">("idle");
  const [seconds, setSeconds] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!pendingContact) nav({ to: "/auth/login" });
  }, [pendingContact, nav]);

  useEffect(() => {
    if (seconds <= 0) { setStatus((s) => (s === "idle" ? "expired" : s)); return; }
    const t = setTimeout(() => setSeconds((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  function setDigit(i: number, v: string) {
    const c = v.replace(/\D/g, "").slice(-1);
    const next = [...digits]; next[i] = c; setDigits(next);
    if (c && i < VALID_LEN - 1) refs.current[i + 1]?.focus();
    if (next.every((d) => d) && status !== "loading") verify(next.join(""));
  }

  function onPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, VALID_LEN);
    if (!text) return;
    e.preventDefault();
    const next = Array(VALID_LEN).fill("").map((_, i) => text[i] ?? "");
    setDigits(next);
    if (text.length === VALID_LEN) verify(text);
  }

  function verify(code: string) {
    setStatus("loading");
    setTimeout(() => {
      if (code === "000000") return setStatus("failed");
      setStatus("success");
      const fallbackName = pendingType === "university" ? "UU Student" : (pendingContact?.includes("@") ? pendingContact.split("@")[0] : "Arena Guest");
      arena.completeLogin(fallbackName);
      setTimeout(() => nav({ to: "/auth/success" }), 900);
    }, 900);
  }

  function resend() {
    setDigits(Array(VALID_LEN).fill(""));
    setSeconds(45);
    setStatus("idle");
    refs.current[0]?.focus();
  }

  return (
    <ArenaShell>
      <div className="mx-auto max-w-md">
        <GlassCard className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue glow-purple text-2xl">🔐</div>
          <h2 className="mt-4 font-display text-2xl font-black">Verify it's you</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="text-foreground font-semibold">{pendingContact ?? "your device"}</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Demo: enter any 6 digits. Try <code>000000</code> to fail.</p>

          <div className="mt-6 flex justify-center gap-2" onPaste={onPaste}>
            {digits.map((d, i) => (
              <input key={i} ref={(el) => { refs.current[i] = el; }} value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i-1]?.focus(); }}
                inputMode="numeric" maxLength={1}
                className={`h-14 w-12 rounded-xl border bg-background/60 text-center font-display text-2xl outline-none transition ${
                  status === "failed" ? "border-destructive" :
                  status === "success" ? "border-neon-cyan glow-cyan" :
                  "border-border focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30"
                }`} />
            ))}
          </div>

          <div className="mt-6 min-h-[24px] text-sm">
            {status === "loading" && <span className="text-muted-foreground">Verifying…</span>}
            {status === "success" && <span className="text-neon-cyan animate-pulse">✓ Verified — entering the arena…</span>}
            {status === "failed" && <span className="text-destructive">Invalid OTP. Try again or resend.</span>}
            {status === "expired" && <span className="text-destructive">OTP expired. Tap resend.</span>}
            {status === "idle" && <span className="text-muted-foreground">Resend in <span className="text-foreground font-semibold">{seconds}s</span></span>}
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <button onClick={resend} disabled={status === "idle" && seconds > 0}
              className="text-neon-cyan hover:underline disabled:opacity-40">Resend OTP</button>
            <span className="text-muted-foreground">·</span>
            <Link to="/auth/login" className="text-muted-foreground hover:text-foreground">Change number</Link>
          </div>
        </GlassCard>
      </div>
    </ArenaShell>
  );
}
