"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { Project } from "@/content/projects";
import { useScene } from "@/lib/store";

/**
 * A project opened as a pane over the live coil rather than as a page
 * navigation — the scene keeps running behind it and closing returns you to
 * exactly where you were on the coil.
 *
 * Rendered through an intercepting route, so this only appears when a project
 * is opened from inside the site. A direct link or a refresh still renders the
 * full page, which keeps every project independently shareable and indexable.
 */
export default function ProjectOverlay({
  project,
  liveUrl,
}: {
  project: Project;
  liveUrl: string | null;
}) {
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [accent] = project.accent;

  const close = useCallback(() => router.back(), [router]);

  // Subtle pointer parallax. The pane sits in a perspective container, so this
  // reads as a physical panel held in front of the scene rather than a flat
  // sheet pasted over it.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      if (panel.current) {
        panel.current.style.setProperty("--tilt-y", `${current.x * 3.2}deg`);
        panel.current.style.setProperty("--tilt-x", `${-current.y * 2.4}deg`);
        panel.current.style.setProperty("--shift", `${current.x * 6}px`);
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

  useEffect(() => {
    const { lockScroll } = useScene.getState();
    lockScroll?.(true);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // preventScroll matters: a plain focus() scrolls the element into view,
    // which yanked the coil to the end of its track behind the glass.
    closeBtn.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      // Keep tabbing inside the pane while it is open.
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      useScene.getState().lockScroll?.(false);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [close]);

  return (
    <div
      className="overlay-stage fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — ${project.tagline}`}
    >
      {/* Backdrop: the coil stays visible and running behind it. */}
      <button
        type="button"
        aria-label="Close project"
        onClick={close}
        className="overlay-backdrop absolute inset-0 cursor-default"
      />

      <div
        ref={panel}
        className="overlay-panel relative flex max-h-full w-full max-w-4xl flex-col"
        style={{ ["--accent" as string]: accent }}
      >
        {/* HUD chrome */}
        <span aria-hidden className="hud-corner hud-tl" />
        <span aria-hidden className="hud-corner hud-tr" />
        <span aria-hidden className="hud-corner hud-bl" />
        <span aria-hidden className="hud-corner hud-br" />
        <span aria-hidden className="hud-scan" />
        <span aria-hidden className="hud-grid" />
        <span aria-hidden className="hud-ticks" />

        <header className="shrink-0 border-b border-white/10 px-6 py-5 md:px-9 md:py-7">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: accent }}
                />
                {project.domain}
                <span className="text-white/25">/</span>
                {project.year}
              </p>
              <h2 className="display mt-3 truncate text-[30px] font-semibold leading-none text-white md:text-[42px]">
                {project.title}
              </h2>
              <p className="mt-2.5 text-sm text-white/70 md:text-base">
                {project.tagline}
              </p>
            </div>

            <div aria-hidden className="hud-sigil hidden shrink-0 sm:block">
              <span className="hud-ring hud-ring-a" />
              <span className="hud-ring hud-ring-b" />
              <span className="hud-ring hud-ring-c" />
              <span className="hud-core" />
            </div>

            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              aria-label="Close"
              className="group/close shrink-0 rounded-full border border-white/20 p-3 transition-colors duration-300 hover:border-white/60"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white/70 transition-colors group-hover/close:text-white"
                />
              </svg>
            </button>
          </div>
        </header>

        <div
          data-lenis-prevent
          className="overlay-scroll min-h-0 flex-1 overflow-y-auto px-6 py-7 md:px-9 md:py-9"
        >
          <p className="max-w-3xl text-lg leading-snug text-white/90 md:text-2xl md:leading-snug">
            {project.summary}
          </p>

          <section className="mt-10">
            <p className="eyebrow">The problem</p>
            <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
              {project.problem}
            </p>
          </section>

          <section className="mt-10">
            <p className="eyebrow">Approach</p>
            <ol className="mt-4 max-w-3xl">
              {project.approach.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-5 border-b border-white/10 py-4 last:border-0"
                >
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed text-white/80">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10">
            <p className="eyebrow">What it does</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {project.features.map((f) => (
                <div
                  key={f.title}
                  className="border border-white/10 p-5 transition-colors duration-500 hover:border-white/25"
                >
                  <h3 className="font-medium tracking-tight text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <section>
              <p className="eyebrow">Stack</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <p className="eyebrow">Outcome</p>
              <ul className="mt-4 space-y-3">
                {project.outcomes.map((o) => (
                  <li
                    key={o}
                    className="border-l border-white/25 pl-4 leading-relaxed text-white/80"
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {(liveUrl || project.repoUrl) && (
          <footer className="shrink-0 border-t border-white/10 px-6 py-5 md:px-9">
            <div className="flex flex-wrap gap-3">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-transform duration-500 ease-expo hover:scale-[1.03]"
                >
                  Visit the project
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors duration-500 hover:border-white/50"
                >
                  View source
                </a>
              )}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
