"use client";

import { useScene } from "@/lib/store";

/**
 * Actually returns to the top of the current page. This was a `<Link href="/">`
 * labelled "Back to top", which on a case study navigated to the index instead
 * — the label and the behaviour disagreed.
 */
export default function BackToTop() {
  return (
    <button
      type="button"
      className="link-underline w-fit hover:text-white"
      onClick={() => {
        const scrollTo = useScene.getState().scrollTo;
        if (scrollTo) scrollTo(0);
        else window.scrollTo({ top: 0 });
      }}
    >
      Back to top
    </button>
  );
}
