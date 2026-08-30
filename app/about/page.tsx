import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { site, experience, education, certifications, skills } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: site.summary,
};

export default function AboutPage() {
  return (
    <div className="pb-10 pt-36 md:pt-44">
      <section className="shell">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="display mt-8 text-[13vw] font-semibold md:text-[7vw]">
            Analytics,
            <br />
            applied.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-12 max-w-4xl border-t border-line pt-10 text-xl leading-relaxed text-white/80 md:text-2xl md:leading-relaxed">
            {site.summary}
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <a
            href={site.resumeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-ink transition-transform duration-500 ease-expo hover:scale-[1.03]"
          >
            Download resume
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 1v11M2.5 7.5L7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </Reveal>
      </section>

      {/* Experience */}
      <section className="shell mt-24 border-t border-line pt-10 md:mt-32">
        <Reveal>
          <p className="eyebrow">Experience</p>
        </Reveal>
        <div className="mt-10">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.08}>
              <div className="grid gap-6 border-b border-line py-10 md:grid-cols-[260px_1fr] md:gap-16">
                <div>
                  <h3 className="text-2xl font-medium tracking-tight">
                    {job.company}
                  </h3>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {job.location} · {job.period}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-white/90">{job.title}</p>
                  <ul className="mt-5 space-y-3">
                    {job.points.map((p) => (
                      <li
                        key={p}
                        className="border-l border-white/20 pl-5 text-base leading-relaxed text-white/70"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="shell mt-20 border-t border-line pt-10">
        <Reveal>
          <p className="eyebrow">Education</p>
        </Reveal>
        <div className="mt-8">
          {education.map((e, i) => (
            <Reveal key={e.qualification} delay={i * 0.05}>
              <div className="grid grid-cols-1 items-baseline gap-2 border-b border-line py-6 md:grid-cols-[140px_1fr_auto] md:gap-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {e.period}
                </span>
                <div>
                  <p className="text-base text-white/90">{e.qualification}</p>
                  <p className="mt-1 text-sm text-white/50">{e.institute}</p>
                </div>
                <span className="font-mono text-[11px] tracking-[0.12em] text-white/70">
                  {e.score}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="shell mt-20 border-t border-line pt-10">
        <Reveal>
          <p className="eyebrow">Certifications</p>
        </Reveal>
        <div className="mt-8">
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05}>
              <div className="grid grid-cols-1 items-baseline gap-2 border-b border-line py-6 md:grid-cols-[1fr_260px_80px] md:gap-10">
                <p className="text-base text-white/90">{c.name}</p>
                <p className="text-sm text-white/50">{c.platform}</p>
                <span className="font-mono text-[11px] text-white/70">{c.year}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="shell mt-20 border-t border-line pt-10">
        <Reveal>
          <p className="eyebrow">Skills</p>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.07}>
              <h3 className="text-lg font-medium tracking-tight">{group.group}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
