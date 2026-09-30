import { gsap, ScrollSmoother, ScrollTrigger } from "./gsap";

let smoother: globalThis.ScrollSmoother | null = null;

export function initSmoother() {
  if (typeof window === "undefined") return;

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  // Ensure it's not already initialized
  if (smoother) return;

  smoother = ScrollSmoother.create({
    smooth: 1.15,
    effects: true,
    normalizeScroll: true,
    smoothTouch: 0.1,
  });

  ScrollTrigger.refresh();

  return smoother;
}

export function destroySmoother() {
  if (smoother) {
    smoother.kill();
    smoother = null;
  }
}

export { smoother };
