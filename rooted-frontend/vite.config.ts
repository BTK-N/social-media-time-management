import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  optimizeDeps: {
    include: [
      "gsap",
      "gsap/ScrollTrigger",
      "gsap/ScrollSmoother",
      "gsap/SplitText",
      "gsap/MorphSVGPlugin",
      "gsap/DrawSVGPlugin",
      "gsap/Flip",
      "gsap/ScrollToPlugin",
      "gsap/Observer",
      "gsap/CustomEase",
      "gsap/TextPlugin",
      "gsap/ScrambleTextPlugin",
      "gsap/InertiaPlugin",
      "gsap/CustomWiggle",
      "gsap/CustomBounce",
      "gsap/MotionPathPlugin"
    ],
  },
});
