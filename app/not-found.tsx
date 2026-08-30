import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80svh] flex-col justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="display mt-8 text-[14vw] font-semibold md:text-[7vw]">
        Nothing here.
      </h1>
      <Link
        href="/"
        className="link-underline mt-10 w-fit font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 hover:text-white"
      >
        &larr; Back to index
      </Link>
    </div>
  );
}
