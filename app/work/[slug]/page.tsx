import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import SceneAccent from "@/components/webgl/SceneAccent";
import { projects, getProject } from "@/content/projects";
import { getLiveUrl } from "@/lib/github";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject(params.slug);
  if (!project) notFound();

  // An explicit liveUrl wins; otherwise read the deployed URL off the repo at
  // build time so publishing a project is enough to make it appear here.
  const liveUrl = project.liveUrl || (await getLiveUrl(project.repoUrl));

  const [from, to] = project.accent;

  return (
    <article>
      <SceneAccent accent={project.accent} />
      {/* Hero */}
      <header className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden pb-14 pt-32">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(155deg, ${from} 0%, ${to} 55%, #050505 100%)`,
            opacity: 0.6,
          }}
        />
        {project.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.55) 45%, rgba(5,5,5,0.25) 100%)",
          }}
        />

        <div className="shell relative">
          <Link
            href="/#work"
            className="link-underline font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white"
          >
            &larr; All projects
          </Link>

          <h1 className="display mt-10 text-[14vw] font-semibold md:text-[8vw]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-2xl">
            {project.tagline}
          </p>

          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-white/20 pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 md:grid-cols-4">
            <div>
              <dt>Year</dt>
              <dd className="mt-2 font-sans text-base tracking-normal text-white">
                {project.year}
              </dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd className="mt-2 font-sans text-base tracking-normal text-white">
                {project.role}
              </dd>
            </div>
            <div>
              <dt>Domain</dt>
              <dd className="mt-2 font-sans text-base tracking-normal text-white">
                {project.domain}
              </dd>
            </div>
            <div>
              <dt>Links</dt>
              <dd className="mt-2 flex flex-col gap-1 font-sans text-base tracking-normal text-white">
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline"
                  >
                    Live site
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline"
                  >
                    Source
                  </a>
                ) : null}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Overview */}
      <section className="shell py-20 md:py-28">
        <Reveal>
          <p className="max-w-4xl text-2xl leading-snug text-white/90 md:text-4xl md:leading-[1.2]">
            {project.summary}
          </p>
        </Reveal>
      </section>

      {/* Problem */}
      <section className="shell border-t border-line py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-20">
          <Reveal>
            <p className="eyebrow md:sticky md:top-28">The problem</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">
              {project.problem}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Approach */}
      <section className="shell border-t border-line py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-20">
          <Reveal>
            <p className="eyebrow md:sticky md:top-28">Approach</p>
          </Reveal>
          <ol className="max-w-3xl">
            {project.approach.map((step, i) => (
              <Reveal key={step} delay={i * 0.06}>
                <li className="flex gap-6 border-b border-line py-6 last:border-0">
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base leading-relaxed text-white/80 md:text-lg">
                    {step}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="shell border-t border-line py-16 md:py-24">
        <Reveal>
          <p className="eyebrow">What it does</p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {project.features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.07}>
              <div
                className="h-full border border-line p-7 transition-colors duration-500 ease-expo hover:border-white/25"
                style={{
                  background: `linear-gradient(160deg, ${from}14, transparent 70%)`,
                }}
              >
                <h3 className="text-lg font-medium tracking-tight">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stack + outcomes */}
      <section className="shell border-t border-line py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="eyebrow">Stack</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow">Outcome</p>
            <ul className="mt-6 space-y-4">
              {project.outcomes.map((o) => (
                <li
                  key={o}
                  className="border-l border-white/25 pl-5 text-base leading-relaxed text-white/80"
                >
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Visit CTA */}
      {liveUrl || project.repoUrl ? (
        <section className="shell border-t border-line py-16">
          <Reveal>
            <div className="flex flex-wrap gap-4">
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-ink transition-transform duration-500 ease-expo hover:scale-[1.03]"
                >
                  Visit the project
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-3 rounded-full border border-line px-7 py-4 text-sm font-medium text-white transition-colors duration-500 hover:border-white/40"
                >
                  View source
                </a>
              ) : null}
            </div>
          </Reveal>
        </section>
      ) : null}

    </article>
  );
}
