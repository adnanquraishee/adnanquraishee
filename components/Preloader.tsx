"use client";

import { useEffect, useState } from "react";
import { useScene } from "@/lib/store";

const DURATION = 1900;

/**
 * Counter-driven intro. Drives `intro` in the scene store from 0 → 1, which is
 * what fades the WebGL layer up, then lifts the curtain.
 *
 * Only shown once per session — returning to the index from a case study
 * should not replay it.
 *
 * Note: there is deliberately NO "already started" ref guard here. React Strict
 * Mode runs effects twice in development (run → cleanup → run), and a guard
 * that skips the second run leaves the cleanup's cancelled timers with nothing
 * to restart them — which pinned the counter at 000 forever and, because the
 * curtain covers the page, made the whole site unreachable. The cleanup below
 * cancels everything it started, so simply letting the effect re-run is safe.
 */
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
    } catch {
      /* private mode — replaying the intro is harmless */
    }

    if (seen) {
      useScene.getState().setIntro(1);
      setDone(true);
      return;
    }

    let frame = 0;
    let lift = 0;
    let finish = 0;
    let bail = 0;
    const start = performance.now();

    const complete = () => {
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {
        /* ignore */
      }
      useScene.getState().setIntro(1);
      setCount(100);
      setLifting(true);
      finish = window.setTimeout(() => setDone(true), 1100);
    };

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // Ease out so the last numbers slow down.
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      useScene.getState().setIntro(eased);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        window.clearTimeout(bail);
        complete();
      }
    };

    frame = requestAnimationFrame(tick);

    // Hard safety net: the curtain covers the whole page, so it must never be
    // able to stay up. If the frame loop is throttled or stalls for any reason,
    // reveal anyway.
    bail = window.setTimeout(() => {
      cancelAnimationFrame(frame);
      complete();
    }, DURATION + 2500);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(bail);
      window.clearTimeout(lift);
      window.clearTimeout(finish);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-[95] flex items-end justify-between bg-ink px-6 pb-10 transition-transform duration-[1100ms] ease-expo md:px-10 ${
        lifting ? "-translate-y-full" : "translate-y-0"
      }`}
      aria-hidden
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        Adnan Quraishee
      </span>
      <span className="display text-[22vw] font-semibold leading-none tabular-nums md:text-[12vw]">
        {String(count).padStart(3, "0")}
      </span>
    </div>
  );
}
