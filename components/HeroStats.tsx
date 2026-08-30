"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { projects } from "@/content/projects";

/** useLayoutEffect on the client, useEffect on the server, without the warning. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Stat = {
  label: string;
  /** Numeric stats roll up from zero; text stats just reveal. */
  value?: number;
  pad?: number;
  unit?: string;
  text?: string;
};

const stats: Stat[] = [
  { label: "Projects", value: projects.length, pad: 2 },
  { label: "Experience", value: 14, pad: 2, unit: "months" },
  { label: "Based in", text: "BLR" },
];

export default function HeroStats() {
  const grid = useRef<HTMLDListElement>(null);
  const values = useRef<(HTMLSpanElement | null)[]>([]);

  // Roll the numbers up. The final value is what the server renders, so if this
  // never runs — no JS, throttled frames, reduced motion — the correct number
  // is already on screen rather than a zero.
  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stats
      .map((s, i) => ({ el: values.current[i], stat: s }))
      .filter((t): t is { el: HTMLSpanElement; stat: Stat } =>
        Boolean(t.el && typeof t.stat.value === "number")
      );
    if (!targets.length) return;

    for (const { el, stat } of targets) {
      el.textContent = "0".padStart(stat.pad ?? 1, "0");
    }

    const DURATION = 1500;
    const start = performance.now();
    let frame = 0;

    const settle = () => {
      for (const { el, stat } of targets) {
        el.textContent = String(stat.value).padStart(stat.pad ?? 1, "0");
      }
    };

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      for (const { el, stat } of targets) {
        el.textContent = String(Math.round(eased * (stat.value as number))).padStart(
          stat.pad ?? 1,
          "0"
        );
      }
      if (t < 1) frame = requestAnimationFrame(tick);
      else settle();
    };
    frame = requestAnimationFrame(tick);

    // If the frame loop stalls, the real numbers still land.
    const bail = window.setTimeout(settle, DURATION + 1200);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(bail);
    };
  }, []);

  // Each tile tilts toward the pointer around its own centre, so the row reads
  // as three physical plates rather than one flat panel.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = grid.current;
    if (!el) return;

    let frame = 0;
    const pointer = { x: 0, y: 0 };
    const tiles = Array.from(el.querySelectorAll<HTMLElement>(".stat-tile"));
    const current = tiles.map(() => ({ x: 0, y: 0 }));

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const tick = () => {
      tiles.forEach((tile, i) => {
        const r = tile.getBoundingClientRect();
        const dx = (pointer.x - (r.left + r.width / 2)) / (r.width || 1);
        const dy = (pointer.y - (r.top + r.height / 2)) / (r.height || 1);
        const c = current[i];
        c.x += (Math.max(-1.6, Math.min(1.6, dx)) - c.x) * 0.07;
        c.y += (Math.max(-1.6, Math.min(1.6, dy)) - c.y) * 0.07;
        tile.style.setProperty("--ry", `${c.x * 9}deg`);
        tile.style.setProperty("--rx", `${-c.y * 9}deg`);
      });
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <dl ref={grid} className="stat-grid">
      {stats.map((s, i) => (
        <div key={s.label} className="stat-tile" style={{ ["--i" as string]: i }}>
          <span aria-hidden className="stat-tick stat-tick-l" />
          <span aria-hidden className="stat-tick stat-tick-r" />

          <dt className="stat-label">{s.label}</dt>
          <dd className="stat-value-row">
            <span
              ref={(node) => {
                values.current[i] = node;
              }}
              className="stat-value"
            >
              {typeof s.value === "number"
                ? String(s.value).padStart(s.pad ?? 1, "0")
                : s.text}
            </span>
            {s.unit ? <span className="stat-unit">{s.unit}</span> : null}
          </dd>

          <span aria-hidden className="stat-rule" />
        </div>
      ))}
    </dl>
  );
}
