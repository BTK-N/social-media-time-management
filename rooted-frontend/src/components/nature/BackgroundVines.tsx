import React, { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../lib/gsap';

export interface BackgroundVinesProps {
  className?: string;
}

export function BackgroundVines({ className }: BackgroundVinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const path3Ref = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion) {
      gsap.set([path1Ref.current, path2Ref.current, path3Ref.current], { drawSVG: "100%" });
      return;
    }

    // Set initial states
    gsap.set([path1Ref.current, path2Ref.current, path3Ref.current], { 
      drawSVG: "0%", 
      opacity: 0.8 
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 20%",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    // Draw vines organically as the user scrolls
    tl.to(path1Ref.current, { drawSVG: "100%", ease: "power2.inOut", duration: 2 })
      .to(path2Ref.current, { drawSVG: "100%", ease: "power1.inOut", duration: 2.5 }, "-=1.5")
      .to(path3Ref.current, { drawSVG: "100%", ease: "power3.inOut", duration: 3 }, "-=2");

  }, { scope: containerRef, dependencies: [reducedMotion] });

  return (
    <div 
      ref={containerRef} 
      className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}
    >
      <svg
        viewBox="0 0 1000 2000"
        preserveAspectRatio="xMidYMin slice"
        className="w-full h-[200vh] absolute top-0 left-0"
        style={{ stroke: 'var(--color-sage-300)', fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round' }}
      >
        {/* Left flowing vine */}
        <path
          ref={path1Ref}
          d="M 100 -50 C 150 200, 50 400, 120 600 C 190 800, 80 1000, 150 1200 C 220 1400, 100 1600, 180 1800 C 260 2000, 150 2200, 200 2400"
          className="opacity-40 mix-blend-multiply"
        />
        {/* Right thick branch */}
        <path
          ref={path2Ref}
          d="M 900 -50 C 850 150, 950 350, 880 550 C 810 750, 920 950, 850 1150 C 780 1350, 900 1550, 820 1750 C 740 1950, 850 2150, 800 2350"
          className="opacity-30 mix-blend-multiply"
          style={{ strokeWidth: 2.5 }}
        />
        {/* Center subtle crossover */}
        <path
          ref={path3Ref}
          d="M 400 300 C 600 500, 300 800, 500 1100 C 700 1400, 400 1700, 600 2000"
          className="opacity-20 mix-blend-multiply"
          style={{ strokeWidth: 1 }}
        />
      </svg>
    </div>
  );
}
