/**
 * Resolves a project's live URL from its GitHub repository, so a deployment
 * does not also need its URL pasted into `content/projects.ts`.
 *
 * This runs at BUILD TIME only — the site is statically generated and has no
 * server, so nothing here executes in the browser. A newly published site
 * therefore appears on the case study after the next rebuild, not instantly.
 *
 * An explicit `liveUrl` in projects.ts always wins; this is only the fallback.
 */

const API = "https://api.github.com";

/** Pulls `owner/repo` out of any normal GitHub URL form. */
export function parseRepo(url?: string): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com[/:]([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

const headers = (): HeadersInit => {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-build",
  };
  // Optional. Unauthenticated builds are capped at 60 requests/hour per IP,
  // which shared CI runners can exhaust; a token raises that to 5000.
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
};

async function json(url: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(url, {
      headers: headers(),
      // Re-checked hourly if the project is ever moved to ISR.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    // Offline, rate-limited, or DNS-blocked: the build must still succeed.
    return null;
  }
}

/**
 * Returns the deployed URL for a repo, or null.
 *
 * Checks the repository's "Website" field first — GitHub Pages sets this
 * automatically, and it can be set by hand for a Vercel or Netlify deploy —
 * then falls back to the Pages API for repos that publish without setting it.
 */
export async function getLiveUrl(repoUrl?: string): Promise<string | null> {
  const parsed = parseRepo(repoUrl);
  if (!parsed) return null;
  const { owner, repo } = parsed;

  const meta = await json(`${API}/repos/${owner}/${repo}`);
  const homepage = typeof meta?.homepage === "string" ? meta.homepage.trim() : "";
  if (homepage) {
    return homepage.startsWith("http") ? homepage : `https://${homepage}`;
  }

  const pages = await json(`${API}/repos/${owner}/${repo}/pages`);
  const html = typeof pages?.html_url === "string" ? pages.html_url.trim() : "";
  return html || null;
}
