import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CustomWiggle } from "gsap/CustomWiggle";
import { CustomBounce } from "gsap/CustomBounce";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useEffect, useState } from "react";

// 1. Register ALL FREE GSAP Plugins
gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  MorphSVGPlugin,
  DrawSVGPlugin,
  Flip,
  ScrollToPlugin,
  Observer,
  CustomEase,
  TextPlugin,
  ScrambleTextPlugin,
  InertiaPlugin,
  CustomWiggle,
  CustomBounce,
  MotionPathPlugin
);

// Register CustomWiggle + CustomBounce easing presets
CustomWiggle.create("rooted-wiggle", { wiggles: 4, type: "easeOut" });
CustomBounce.create("rooted-bounce", { strength: 0.4, squash: 1, squashID: "seedPop" });

// 2. Register Custom "Rooted" Ease
// This ease mimics a plant settling into the soil — rapid initial push, 
// a slight overshoot (reaching for the sun), and a calm, heavy rest.
CustomEase.create("rooted", "M0,0 C0.15,0.85 0.35,1.05 1,1");
export const rootedEase = "rooted";

// 3. Export Durations matching our CSS tokens for programmatic GSAP usage
export const durations = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  slower: 0.9,
  drift: 2.4
};

// 4. Reduced Motion Guard Hook
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  
  return reduced;
}

// 5. MatchMedia setup for GSAP global configuration
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  // When reduced motion is preferred, disable all scroll triggers 
  // and force all animations to resolve instantly.
  ScrollTrigger.getAll().forEach(st => st.disable());
  gsap.globalTimeline.timeScale(1000); 
  
  return () => {
    // Cleanup if preferences change
    ScrollTrigger.getAll().forEach(st => st.enable());
    gsap.globalTimeline.timeScale(1);
  };
});

// Expose to window for QA testing
if (typeof window !== 'undefined') {
  (window as any).gsap = gsap;
  (window as any).ScrollSmoother = ScrollSmoother;
  (window as any).SplitText = SplitText;
  (window as any).MorphSVGPlugin = MorphSVGPlugin;
  (window as any).DrawSVGPlugin = DrawSVGPlugin;
  (window as any).Flip = Flip;
  (window as any).ScrollToPlugin = ScrollToPlugin;
  (window as any).Observer = Observer;
  (window as any).CustomEase = CustomEase;
  (window as any).TextPlugin = TextPlugin;
  (window as any).ScrambleTextPlugin = ScrambleTextPlugin;
  (window as any).InertiaPlugin = InertiaPlugin;
  (window as any).CustomWiggle = CustomWiggle;
  (window as any).CustomBounce = CustomBounce;
  (window as any).MotionPathPlugin = MotionPathPlugin;
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, DrawSVGPlugin, Flip, ScrollToPlugin, Observer, CustomEase, TextPlugin, ScrambleTextPlugin, InertiaPlugin, CustomWiggle, CustomBounce, MotionPathPlugin };

