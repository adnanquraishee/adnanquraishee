"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useScene } from "@/lib/store";

/**
 * Lenis smooth scroll, and the single place scroll + pointer state is pushed
 * into the WebGL store. Both are written imperatively so the 3D layer updates
 * without re-rendering any React tree.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  /** Last known scroll offset per route, so Back returns you where you were. */
  const positions = useRef(new Map<string, number>());
  const currentPath = useRef(pathname);

  useEffect(() => {
    const { setScroll, setPointer, setScrollTo, setLockScroll } =
      useScene.getState();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointer = (e: PointerEvent) => {
      setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    if (reduced) {
      setScrollTo((target, offset = 0) =>
        window.scrollTo({
          top:
            (typeof target === "number"
              ? target
              : target.getBoundingClientRect().top + window.scrollY) + offset,
        })
      );
      setLockScroll((locked) => {
        document.body.style.overflow = locked ? "hidden" : "";
      });
      const onScroll = () => {
        positions.current.set(currentPath.current, window.scrollY);
        setScroll(window.scrollY, 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScroll);
        document.body.style.overflow = "";
        setScrollTo(null);
        setLockScroll(null);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    setScrollTo((target, offset = 0) =>
      lenis.scrollTo(target, { offset, duration: 1.4 })
    );
    setLockScroll((locked) => (locked ? lenis.stop() : lenis.start()));

    let last = window.scrollY;
    let velocity = 0;

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      velocity = scroll - last;
      last = scroll;
      positions.current.set(currentPath.current, scroll);
      setScroll(scroll, velocity);
    });

    // Lenis owns the scroll position, so a plain #hash jump is swallowed.
    // Intercept same-page anchors and hand them to Lenis instead.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const [path, hash] = href.split("#");
      if (!hash) return;
      // Only handle links that stay on the current page.
      if (path && path !== "/" && path !== window.location.pathname) return;
      if (path === "/" && window.location.pathname !== "/") return;

      const target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      history.pushState(null, "", `#${hash}`);
    };
    document.addEventListener("click", onClick);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      // Decay velocity so the scene settles when scrolling stops.
      velocity *= 0.9;
      setScroll(last, velocity);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      setScrollTo(null);
      setLockScroll(null);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // Where a route opens.
  //
  // Browser scroll restoration is off (see the inline script in layout), and
  // Lenis keeps its own offset across a client-side route change — between
  // them, opening a project could land part-way down the page. So position is
  // managed here explicitly.
  useEffect(() => {
    const previous = currentPath.current;
    currentPath.current = pathname;

    // An intercepted project renders as an overlay over the page that is
    // already mounted. The URL changes but nothing navigated, so the page
    // underneath must not move.
    if (document.querySelector('[role="dialog"]')) return;

    const lenis = lenisRef.current;
    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(hash) : null;

    if (target) {
      // A deep link to #work or #contact should still land on its section.
      if (lenis) lenis.scrollTo(target, { offset: -80, immediate: true });
      else target.scrollIntoView();
      return;
    }

    // Returning to a route we have seen restores it; anything else opens at
    // the top. Closing an overlay lands here, which is what puts you back on
    // the coil where you left it.
    const restored = previous === pathname ? null : positions.current.get(pathname);
    const top = restored ?? 0;

    if (lenis) {
      lenis.resize();
      lenis.scrollTo(top, { immediate: true, force: true });
    }
    window.scrollTo(0, top);
  }, [pathname]);

  return null;
}
