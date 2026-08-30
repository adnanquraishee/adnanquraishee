"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Trailing dot + ring cursor. The ring lags the pointer and swells over
 * anything marked interactive (links, buttons, [data-cursor]).
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let frame = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor]"
      ) as HTMLElement | null;
      const next = Boolean(el);
      if (next !== hovering) {
        hovering = next;
        ringRef.current?.classList.toggle("scale-[2.4]", next);
        ringRef.current?.classList.toggle("bg-white/10", next);
        ringRef.current?.classList.toggle("border-white/70", next);
      }
      const nextLabel = el?.dataset.cursor ?? "";
      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
    };

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${ring.x}px, ${
          ring.y + 34
        }px, 0) translate(-50%, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 transition-[transform,background-color] duration-300 ease-expo will-change-transform"
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white will-change-transform"
      />
      <div
        ref={labelRef}
        className={`absolute left-0 top-0 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.24em] text-white/80 transition-opacity duration-300 ${
          label ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
