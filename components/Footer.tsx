import { site } from "@/content/site";
import BackToTop from "./BackToTop";

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t border-line">
      <div className="shell py-20 md:py-28">
        <p className="eyebrow">Contact</p>
        <h2 className="display mt-6 text-[13vw] font-semibold leading-[0.85] md:text-[7vw]">
          Let&rsquo;s build
          <br />
          something.
        </h2>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          <div>
            <p className="eyebrow">Email</p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-3 block break-all text-sm text-white/80 hover:text-white"
            >
              {site.email}
            </a>
          </div>
          <div>
            <p className="eyebrow">Phone</p>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="link-underline mt-3 block text-sm text-white/80 hover:text-white"
            >
              {site.phone}
            </a>
          </div>
          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-3 space-y-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-sm text-white/80 hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:flex-row md:items-center md:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {site.name}
          </span>
          <span>{site.location}</span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
