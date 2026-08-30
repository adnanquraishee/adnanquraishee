import { notFound } from "next/navigation";
import ProjectOverlay from "@/components/ProjectOverlay";
import { getProject } from "@/content/projects";
import { getLiveUrl } from "@/lib/github";

/**
 * Intercepting route: clicking a project from inside the site renders it as a
 * pane over the coil. A direct visit or a refresh falls through to the real
 * /work/[slug] page, so every project stays shareable and indexable.
 */
export default async function InterceptedProject({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const liveUrl = project.liveUrl || (await getLiveUrl(project.repoUrl));

  return <ProjectOverlay project={project} liveUrl={liveUrl} />;
}
