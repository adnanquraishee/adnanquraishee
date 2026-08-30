import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { projects } from "@/content/projects";

export const runtime = "nodejs";
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card for the site itself. */
export default async function OG() {
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
          background:
            "linear-gradient(140deg, #0b1430 0%, #070709 55%, #050505 100%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#8a8a8f" }}>
          <span>PORTFOLIO</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ marginTop: 22, fontSize: 34, color: "#b6b6bd", maxWidth: 900 }}>
            {site.role}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 22, letterSpacing: 3, color: "#8a8a8f" }}>
          <span style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: "#2f6fe4" }} />
          <span>{projects.length} PROJECTS</span>
          <span style={{ color: "#3a3a40" }}>/</span>
          <span>AI · ML · ANALYTICS</span>
        </div>
      </div>
    ),
    size
  );
}
