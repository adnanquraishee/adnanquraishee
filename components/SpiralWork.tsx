"use client";

import { useCallback, useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "@/content/projects";
import { useScene } from "@/lib/store";
import {
  STEP_ANGLE,
  FACING,
  STEP_Y,
  RADIUS_WIDE,
  RADIUS_NARROW,
  FALLOFF,
} from "@/lib/spiral";

/**
 * The projects arranged on a vertical helix. Scrolling the track turns the
 * coil, carrying each project around and forward through the focal point.
 *
 * Positioning is applied imperatively in a rAF loop rather than through React
 * state — one transform per project per frame, no re-renders. Without JS the
 * entries stay in normal document flow as a plain readable stack (see .spiral-*
 * in globals.css), so the section degrades to a list rather than a pile.
 */
export default function SpiralWork() {
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);
  const rail = useRef<(HTMLButtonElement | null)[]>([]);
  const is3d = useRef(false);

  const total = projects.length;

  // Scroll offset that brings a given project to the front — used so keyboard
  // focus moves the coil instead of stranding focus on an invisible card.
  const scrollToIndex = useCallback(
    (i: number) => {
      const el = track.current;
      // In the stacked fallback the cards are already in flow — moving the
      // page on focus would fight the browser's own scroll-into-view.
      if (!el || !is3d.current) return;
      const span = el.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      const p = total > 1 ? i / (total - 1) : 0;
      const top = el.offsetTop + span * p;
      const scrollTo = useScene.getState().scrollTo;
      // Native smooth scrolling is disabled while Lenis is active, so going
      // through window.scrollTo here teleported instead of gliding.
      if (scrollTo) scrollTo(top);
      else window.scrollTo({ top });
    },
    [total]
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    // Reduced motion keeps the plain stack: no sticky track, no 3D, no loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("spiral-3d");
    is3d.current = true;

    let frame = 0;
    let shown = -1;

    const place = () => {
      const rect = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const progress = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;

      useScene.getState().setWorkProgress(progress);

      const narrow = window.innerWidth < 900;
      const radius = narrow ? RADIUS_NARROW : RADIUS_WIDE;
      // Fewer entries on screen at once on phones, where they would otherwise
      // overlap into an unreadable stack.
      const falloff = narrow ? 1.55 : FALLOFF;
      const head = progress * (total - 1);

      for (let i = 0; i < total; i++) {
        const node = cards.current[i];
        if (!node) continue;

        // u = 0 when this project is at the focal point.
        const u = i - head;
        const theta = u * STEP_ANGLE;

        const x = Math.sin(theta) * radius;
        // cos(theta) * r is +r at the front; shift so the focal card sits at z = 0.
        const z = Math.cos(theta) * radius - radius;
        const y = u * STEP_Y;

        const dist = Math.abs(u);
        const opacity = Math.max(0, 1 - Math.pow(dist / falloff, 2));
        // Distance also drives the card's own "focused" styling.
        const focus = Math.max(0, 1 - dist);

        if (opacity <= 0.001) {
          node.style.opacity = "0";
          node.style.visibility = "hidden";
          node.style.pointerEvents = "none";
          continue;
        }

        node.style.visibility = "visible";
        node.style.opacity = String(opacity);
        // Only the project at the front should take the click.
        node.style.pointerEvents = dist < 0.55 ? "auto" : "none";
        node.style.zIndex = String(100 - Math.round(dist * 10));
        node.style.setProperty("--focus", focus.toFixed(3));
        node.setAttribute("aria-current", dist < 0.5 ? "true" : "false");

        node.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${
          theta * FACING * (180 / Math.PI)
        }deg)`;
      }

      // Keep the readout and the rail in step with the focal card.
      const current = Math.round(head);
      if (current !== shown) {
        shown = current;
        if (counter.current) {
          counter.current.textContent = String(current + 1).padStart(2, "0");
        }
        rail.current.forEach((b, i) =>
          b?.setAttribute("data-on", String(i === current))
        );
      }
    };

    const tick = () => {
      place();
      frame = requestAnimationFrame(tick);
    };

    // Place once synchronously. Without this the cards would sit piled at the
    // centre until the first animation frame — which never arrives at all if
    // the page is opened in a background tab.
    place();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      is3d.current = false;
      el.classList.remove("spiral-3d");
      useScene.getState().setWorkProgress(0);
    };
  }, [total]);

  return (
    <section
      id="work"
      className="relative"
      ref={track}
      style={{ ["--projects" as string]: total }}
    >
      <div className="spiral-stage">
        {/* Section label — pinned while the coil turns, inline in the stack.
            Kept to a single line in 3D so it never collides with the cards. */}
        <div className="spiral-label shell flex items-baseline justify-between gap-6">
          <p className="eyebrow">Selected work</p>
          <h2 className="spiral-heading display font-semibold">Projects</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            <span ref={counter} className="text-white">
              01
            </span>{" "}
            / {String(total).padStart(2, "0")}
          </p>
        </div>

        {/* Jump rail */}
        <nav className="spiral-rail" aria-label="Projects">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              ref={(node) => {
                rail.current[i] = node;
              }}
              type="button"
              data-on={i === 0}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${project.title}`}
            />
          ))}
        </nav>

        <div className="spiral-cards">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              ref={(node) => {
                cards.current[i] = node;
              }}
              project={project}
              index={i}
              total={total}
              onFocus={() => scrollToIndex(i)}
            />
          ))}
        </div>

        <p className="spiral-hint shell font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          Scroll to travel the coil
        </p>
      </div>
    </section>
  );
}
