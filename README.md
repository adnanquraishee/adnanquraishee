# Adnan Quraishee — Portfolio

A dark, WebGL-led portfolio built around one idea: the projects ride a spiral.
A particle coil turns behind the page, and scrolling the work section carries
each project around and through the focal point on that same coil. Each project
opens into a full case study.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**,
**three.js / react-three-fiber** with hand-written GLSL, and **Lenis** smooth
scroll.

## Run it

```bash
npm install
npm run dev
```

Then open http://adnanquraishee.vercel.app.

```bash
npm run build && npm start   # production
```

## Where to edit things

Almost everything you'll want to change lives in two files.

| File | Contains |
| --- | --- |
| `content/projects.ts` | Every project: copy, case-study sections, accent colours, links |
| `content/site.ts` | Name, contact details, social links, experience, education, certifications, skills |

### Adding or editing a project

Each entry in `content/projects.ts` generates both a position on the coil and
its own page at `/work/<slug>`. The scroll track and the WebGL coil's rotation
both derive from the project count, so adding one needs no other change. Fields worth knowing:

- `accent` — two hex stops. The first is the project's accent: it colours the
  entry on the coil, the case-study hero, and the WebGL particle field while
  that project is on screen. Adjacent projects should not share a hue.
- `cover` — optional. Drop an image at `public/work/<slug>.jpg` and set
  `cover: "/work/<slug>.jpg"`. Without one, the gradient is used.
- `liveUrl` / `repoUrl` — **currently empty.** Until you fill these in, the
  case study shows "On request" instead of buttons, and the "Visit the project"
  call to action is hidden entirely. Add the URLs to switch them on.

### Things to fill in

These are placeholders in the committed code:

1. `liveUrl` and `repoUrl` for all nine projects in `content/projects.ts`.
2. `socials` in `content/site.ts` — the LinkedIn and GitHub handles are guesses.
3. Project cover images in `public/work/` (optional, but they lift the grid a lot).

## Structure

```
app/
  layout.tsx          Root shell: fonts, nav, footer, cursor, grain
  page.tsx            Index — hero and the project coil
  about/page.tsx      Experience, education, certifications, skills
  work/[slug]/page.tsx  Case study template (statically generated per project)
components/
  Hero.tsx            Landing headline, CSS keyframe entrance
  SpiralWork.tsx      The scroll-driven helix the projects ride
  ProjectCard.tsx     One project set as type, positioned by SpiralWork
  Reveal.tsx          Scroll reveal wrapper
  Cursor.tsx          Trailing dot + ring cursor (pointer:fine only)
  Preloader.tsx       Counter intro; drives the scene fade-up
  Transition.tsx      Route-change curtain
  SmoothScroll.tsx    Lenis + the only writer of scroll/pointer scene state
  BackToTop.tsx       Footer control; scrolls via Lenis, not a route change
  Nav.tsx / Footer.tsx / Grain.tsx
  webgl/
    Scene.tsx         Fixed full-viewport Canvas, post-processing chain
    Spiral.tsx        The particle coil (14k points, all motion in GLSL)
    Particles.tsx     Ambient curl-noise field
    SceneAccent.tsx   Per-case-study palette
lib/
  glsl.ts             Shared simplex + curl noise
  spiral.ts           Coil geometry, shared by the DOM and WebGL layers
  github.ts           Build-time live-URL lookup from each project's repo
  store.ts            Zustand bridge between the DOM and the render loop
content/
  projects.ts         Project data
  site.ts             Bio, experience, education, skills
public/
  Resume_Adnan_Quraishee.pdf   Linked from the About page
```

## How the spiral works

The work section is a 700vh scroll track containing a sticky, full-viewport
stage with a CSS `perspective`. The projects are positioned on a vertical
helix around a central axis:

```
u     = index - progress * (total - 1)   // 0 when this project is at the front
theta = u * STEP_ANGLE
x     = sin(theta) * RADIUS
z     = cos(theta) * RADIUS - RADIUS     // 0 at the front, -2R at the back
y     = u * STEP_Y
```

Each entry gets `translate3d(x, y, z) rotateY(theta * FACING)`, so scrolling
turns the whole coil and each project swings around, faces you at the focal
point, then rises away. Opacity and brightness fall off with distance from the
front, and only the focal entry takes pointer events.

Two constraints shape the numbers:

- **`FACING` damps the card rotation to half the orbit angle.** At 90deg an
  entry is edge-on, and past it `backface-visibility: hidden` culls it — which
  had left only the focal project visible.
- **Perspective sits on the entries' immediate parent and they stay
  `transform-style: flat`.** `preserve-3d` depth sorting is unreliable when a
  child has `opacity < 1`: the browser composites it into its own group and
  paints in DOM order, which drew far entries over near ones. Flat plus an
  explicit `z-index` sorts correctly.

Projects are set as type rather than as cards — no panel, no border, no filled
rectangle. The coil stays visible through the entries.

Positions are written imperatively in a `requestAnimationFrame` loop — one
transform per project per frame, no React re-renders — and once synchronously
on mount, so
the layout is correct even before the first frame arrives.

The WebGL coil behind it is driven by the same progress value: it slides to
centre and turns in step with the cards, so the particles read as the physical
thread the projects are travelling along. `SceneAccent` sets a palette per case
study and the coil and particle field lerp toward it, so navigating between
projects reads as one continuous object changing colour.

## Scrolling

Lenis owns the scroll position, and `globals.css` sets
`scroll-behavior: auto !important` while it is active. That means **native
scrolling APIs silently misbehave**: `#hash` links are swallowed, and
`window.scrollTo({ behavior: "smooth" })` teleports instead of animating.

Everything that moves the page therefore goes through Lenis. `SmoothScroll`
publishes its `scrollTo` on the scene store, and intercepts same-page anchor
clicks. If you add a control that scrolls, use `useScene.getState().scrollTo`
rather than calling `window.scrollTo` directly.

Browser scroll restoration is also disabled (`history.scrollRestoration =
'manual'`, set in the inline script in `layout.tsx` so it applies before the
browser can restore). Lenis keeps its own offset and does not reset on a route
change, so between the two, reloading or opening a project could land part-way
down the page. `SmoothScroll` resets to the top on every pathname change, or
scrolls to the anchor when the URL carries a hash.

The trade-off: pressing Back from a case study returns to the top of the index
rather than your previous position on the coil.

## Degradation

The site is built to survive its own effects failing.

- **No WebGL** — `Scene` probes for a context before mounting. Without one the
  canvas never appears and the CSS gradient fallbacks (`.gl-fallback`, hidden
  only under `html.webgl`) show instead.
- **No JavaScript** — the reveal hidden-state is scoped to `html.js`, set by an
  inline script before first paint, so an unscripted render is fully visible
  rather than blank. The spiral is opt-in too: `SpiralWork` adds `.spiral-3d`
  only once it is running, and the default styles are a plain vertical stack of
  project cards.
- **Backgrounded tab** — a hidden tab never advances CSS transitions, so reveals
  triggered while hidden snap in without animating, and the preloader carries a
  hard timeout so the curtain can never trap the page.
- **Low-power devices** — under 768px wide or 4 cores or fewer, the
  post-processing chain is skipped, DPR is capped lower, and the particle counts
  drop.
- **`prefers-reduced-motion`** — smooth scroll, post-processing and all reveal
  motion are disabled, and the work section stays a plain stack rather than
  700vh of sticky scrolling.

## Deploy

The site is fully static (every case study is prerendered). Push to a Git
remote and import on Vercel — no configuration or environment variables needed.
