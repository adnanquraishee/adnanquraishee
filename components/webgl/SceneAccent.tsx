"use client";

import { useEffect } from "react";
import { useScene } from "@/lib/store";

/**
 * Sets the palette the persistent 3D object and particle field lerp toward.
 * The scene itself never unmounts, so navigating between case studies reads as
 * the same object changing colour rather than a new one being built.
 */
export default function SceneAccent({ accent }: { accent: [string, string] }) {
  useEffect(() => {
    useScene.getState().setAccent(accent);
    return () => useScene.getState().setAccent(["#2f6fe4", "#0a1733"]);
  }, [accent]);

  return null;
}
