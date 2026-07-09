import { useEffect } from "react";

/**
 * Global page-level interactions:
 * - IntersectionObserver reveal for elements with `.reveal`
 * - Button ripple for elements with `.btn-fx`
 * Re-runs on route changes via the `key` prop passed by the caller.
 */
export function InteractionsBoot() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reveal on scroll
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Ripple on any .btn-fx click
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const btn = target?.closest<HTMLElement>(".btn-fx");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = ev.clientX - rect.left - size / 2 + "px";
      ripple.style.top = ev.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 650);
    };
    document.addEventListener("click", onClick);

    return () => {
      io.disconnect();
      document.removeEventListener("click", onClick);
    };
  });

  return null;
}
