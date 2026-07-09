import { useEffect, useRef } from "react";

/**
 * Cursor-reactive ambient background: a soft neon aura that follows the pointer,
 * plus a lightweight canvas of floating gaming particles that gently drift and
 * are nudged by the cursor. Rendered fixed behind all content (pointer-events: none).
 */
export function AmbientFX() {
  const auraRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
      const aura = auraRef.current;
      if (aura) {
        aura.style.setProperty("--mx", `${e.clientX}px`);
        aura.style.setProperty("--my", `${e.clientY}px`);
        aura.style.opacity = "1";
      }
    };
    const onLeave = () => {
      mouse.current.active = false;
      if (auraRef.current) auraRef.current.style.opacity = "0";
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    // Particles
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, DPR = 1;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = [];

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const isSmall = W < 640;
    const count = reduce ? 0 : isSmall ? 22 : 48;
    const hues = [285, 200, 265, 320];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.6,
        hue: hues[i % hues.length],
      });
    }

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        // Cursor nudge
        if (mouse.current.active) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22500) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 150) * 0.6;
            p.vx += (dx / d) * f * 0.15;
            p.vy += (dy / d) * f * 0.15;
          }
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 70%, 0.65)`);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (!reduce) rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ mixBlendMode: "screen" }}
      />
      <div
        ref={auraRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500"
        style={{
          opacity: 0,
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), oklch(0.62 0.28 305 / 0.28), transparent 60%), radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), oklch(0.82 0.18 200 / 0.10), transparent 70%)",
        }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-neon-purple/15 blur-3xl animate-drift-a" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-neon-cyan/10 blur-3xl animate-drift-b" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-neon-pink/10 blur-3xl animate-drift-c" />
      </div>
    </>
  );
}

/** Route transition wrapper — fades/slides children on mount. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
