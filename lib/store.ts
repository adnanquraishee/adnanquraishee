import { create } from "zustand";

type State = {
  /** Normalised pointer, -1..1, origin at screen centre. */
  pointer: { x: number; y: number };
  /** Smoothed scroll velocity in px/frame — skews and streaks the scene. */
  scrollVelocity: number;
  scrollY: number;
  /** 0 → 1 as the preloader completes; the scene fades up on this. */
  intro: number;
  /** Accent pair driving the hero object's palette. */
  accent: [string, string];
  /** 0 → 1 across the project section; the coil turns in step with the cards. */
  workProgress: number;
  /**
   * Lenis' scrollTo, published by SmoothScroll. Anything that moves the page
   * must go through this: globals.css sets `scroll-behavior: auto !important`
   * while Lenis is active, so a native smooth scroll silently teleports.
   */
  scrollTo: ((target: number | HTMLElement, offset?: number) => void) | null;
  /** Freezes the page behind an open overlay. Published by SmoothScroll. */
  lockScroll: ((locked: boolean) => void) | null;

  setPointer: (x: number, y: number) => void;
  setScroll: (y: number, velocity: number) => void;
  setIntro: (v: number) => void;
  setAccent: (a: [string, string]) => void;
  setWorkProgress: (v: number) => void;
  setScrollTo: (fn: State["scrollTo"]) => void;
  setLockScroll: (fn: State["lockScroll"]) => void;
};

export const useScene = create<State>((set) => ({
  pointer: { x: 0, y: 0 },
  scrollVelocity: 0,
  scrollY: 0,
  intro: 0,
  accent: ["#2f6fe4", "#0a1733"],
  workProgress: 0,
  scrollTo: null,
  lockScroll: null,

  setPointer: (x, y) => set({ pointer: { x, y } }),
  setScroll: (scrollY, scrollVelocity) => set({ scrollY, scrollVelocity }),
  setIntro: (intro) => set({ intro }),
  setAccent: (accent) => set({ accent }),
  setWorkProgress: (workProgress) => set({ workProgress }),
  setScrollTo: (scrollTo) => set({ scrollTo }),
  setLockScroll: (lockScroll) => set({ lockScroll }),
}));
