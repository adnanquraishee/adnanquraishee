"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Fade + rise once, when the element enters the viewport.
 *
 * Deliberately CSS-driven rather than animated in JS: the hidden state is only
 * applied when `html.js` is set (see layout), and the transition runs off the
 * compositor. If scripting is unavailable — or the frame loop is throttled in a
 * background tab — the content stays visible instead of being stuck at
 * opacity 0.
 */
export default function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }

    // A hidden tab never advances CSS transitions, so a reveal triggered while
    // backgrounded would sit at opacity 0. Snap those in without animating.
    const show = (target: Element) => {
      if (document.hidden) el.style.transition = "none";
      el.classList.add("is-in");
      io.unobserve(target);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) show(entry.target);
        }
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
