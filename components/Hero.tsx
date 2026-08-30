"use client";

import { site } from "@/content/site";
import { projects } from "@/content/projects";

/**
 * Entrance is CSS keyframes (see globals.css) rather than JS-driven, so the
 * headline never gets stranded mid-animation if the frame loop is throttled.
 */
export default function Hero() {
  const headline = ["Adnan", "Quraishee"];

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-12 pt-32 md:pb-16">
      {/* Ambient field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 20%, rgba(47,111,228,0.16), transparent 60%), radial-gradient(50% 45% at 85% 35%, rgba(15,138,95,0.14), transparent 62%)",
        }}
      />

      <div className="shell relative">
        <p className="eyebrow anim-fade-up" style={{ animationDelay: "0.1s" }}>
          Portfolio — {new Date().getFullYear()}
        </p>

        <h1 className="display mt-8 text-[16vw] font-semibold md:text-[11vw]">
          {headline.map((word, i) => (
            <span key={word} className="block overflow-hidden pb-[0.06em]">
              <span
                className="anim-rise block"
                style={{ animationDelay: `${0.15 + i * 0.09}s` }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div
          className="anim-fade-up mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-[1.4fr_1fr] md:gap-16"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            {site.intro}
          </p>

          <dl className="grid grid-cols-3 gap-6 self-end font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            <div>
              <dt>Projects</dt>
              <dd className="mt-2 font-sans text-2xl tracking-normal text-white">
                {projects.length}
              </dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd className="mt-2 font-sans text-2xl tracking-normal text-white">
                14 mo
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd className="mt-2 font-sans text-2xl tracking-normal text-white">
                BLR
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div
        className="anim-fade-up shell relative mt-14 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
        style={{ animationDelay: "1.1s" }}
      >
        <span className="h-8 w-px bg-white/30" />
        Scroll to explore
      </div>
    </section>
  );
}
