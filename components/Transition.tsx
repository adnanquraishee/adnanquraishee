"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Route-change curtain. Sweeps up over the outgoing page and away from the
 * incoming one, so navigation between case studies reads as one continuous
 * motion rather than a hard swap.
 */
export default function Transition() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "cover" | "reveal">("idle");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    // Two phases: the curtain sweeps up from below over the new page, then
    // continues up and off. Snapping it into place instead reads as a flash.
    setState("cover");
    const a = window.setTimeout(() => setState("reveal"), 340);
    const b = window.setTimeout(() => setState("idle"), 1000);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [pathname]);

  const position =
    state === "cover"
      ? "translate-y-0"
      : state === "reveal"
        ? "-translate-y-full"
        : "translate-y-full";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[90] bg-ink ease-expo ${position} ${
        state === "idle" ? "duration-0" : "duration-[340ms]"
      } transition-transform`}
    />
  );
}
