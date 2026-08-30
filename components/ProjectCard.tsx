"use client";

import Link from "next/link";
import { forwardRef } from "react";
import type { Project } from "@/content/projects";

/**
 * One project on the coil — set as type, not as a card. No panel, no border,
 * no filled rectangle: the name carries it, and the coil behind stays visible
 * through the entry.
 *
 * SpiralWork sets a `--focus` custom property (1 at the focal point, falling to
 * 0 as the entry recedes) which drives contrast here, so the front project
 * reads as the lit one and the rest fall back into the dark.
 */
const ProjectCard = forwardRef<
  HTMLAnchorElement,
  { project: Project; index: number; total: number; onFocus?: () => void }
>(function ProjectCard({ project, index, total, onFocus }, ref) {
  const [accent] = project.accent;

  return (
    <Link
      ref={ref}
      href={`/work/${project.slug}`}
      // The project opens as an overlay over this page. Next's own scroll
      // management would jump the coil behind it to bring the new route
      // segment into view, so it is disabled for this navigation.
      scroll={false}
      onFocus={onFocus}
      data-cursor="Open"
      aria-label={`${project.title} — ${project.tagline}`}
      className="spiral-card group"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="spiral-entry">
        {/* Index + domain, on one hairline rule */}
        <div className="flex items-center gap-4 border-b border-white/15 pb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">
          <span className="text-white/80">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-500 ease-expo group-hover:scale-150"
            style={{ background: accent }}
          />
          <span className="truncate">{project.domain}</span>
          <span className="ml-auto shrink-0 text-white/35">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <h3 className="spiral-title display mt-5 font-semibold">
          {project.title}
        </h3>

        <p className="spiral-tagline mt-3 max-w-[36ch] leading-snug text-white/70">
          {project.tagline}
        </p>

        <div className="mt-6 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
          <span>{project.year}</span>
          <span className="hidden sm:inline">{project.role}</span>
          <span className="spiral-cta ml-auto inline-flex items-center gap-2 whitespace-nowrap">
            Case study
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-0.5"
              aria-hidden
            >
              <path
                d="M1 13L13 1M13 1H4M13 1V10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
});

export default ProjectCard;
