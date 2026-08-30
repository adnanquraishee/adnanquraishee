import { ImageResponse } from "next/og";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  return [
    {
      id: params.slug,
      size,
      contentType,
      alt: project ? `${project.title} — ${project.tagline}` : site.name,
    },
  ];
}

/** Social card per project, keyed to that project's accent. */
export default async function OG({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  const [accent, deep] = project?.accent ?? ["#2f6fe4", "#0a1733"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `linear-gradient(140deg, ${accent} -20%, ${deep} 45%, #050505 100%)`,
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 22, letterSpacing: 3, color: "rgba(255,255,255,0.72)" }}>
          <span style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: accent }} />
          <span>{project?.domain.toUpperCase() ?? "PROJECT"}</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
          <span>{project?.year ?? ""}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            {project?.title ?? site.name}
          </div>
          <div style={{ marginTop: 24, fontSize: 36, color: "rgba(255,255,255,0.82)", maxWidth: 940 }}>
            {project?.tagline ?? site.role}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: "rgba(255,255,255,0.6)" }}>
          {site.name.toUpperCase()}
        </div>
      </div>
    ),
    size
  );
}
