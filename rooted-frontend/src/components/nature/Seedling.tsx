import React, { useRef } from 'react';
import { gsap, MorphSVGPlugin } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../../lib/utils';

export interface SeedlingProps {
  stage: 1 | 2 | 3;
  size?: number;
  animateTransition?: boolean;
  className?: string;
}

export function Seedling({ stage, size = 64, animateTransition = true, className }: SeedlingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const prevStageRef = useRef(stage);

  // Exact same number of control points across all stages to allow native SVG morphing 
  // without the MorphSVG plugin (which is premium).
  const stagePaths = {
    // Stage 1: Pebble/Seed in the ground.
    1: "M 28 50 C 28 45, 36 45, 36 50 C 36 55, 28 55, 28 50 C 28 50, 32 50, 32 50",
    
    // Stage 2: Sprout with a tiny stem and two small leaves.
    2: "M 32 50 C 32 40, 26 38, 26 34 C 26 38, 32 40, 32 32 C 32 40, 38 38, 38 34",
    
    // Stage 3: Small Sapling with trunk and canopy loops.
    3: "M 32 50 C 32 25, 15 25, 25 15 C 32 15, 32 5,  40 15 C 45 25, 32 25, 32 50"
  };

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (stage === 3 && prevStageRef.current !== 3 && containerRef.current && !prefersReduced) {
      // Apply .motion-bloom on mount to stage 3
      containerRef.current.classList.add('motion-bloom');
      setTimeout(() => {
        if (containerRef.current) containerRef.current.classList.remove('motion-bloom');
      }, 1200);
    }

    if (animateTransition && !prefersReduced && prevStageRef.current !== stage) {
      gsap.to(pathRef.current, {
        morphSVG: stagePaths[stage],
        duration: 0.6,
        ease: 'rooted'
      });
    } else {
      // Instant snap
      gsap.set(pathRef.current, { morphSVG: stagePaths[stage] });
    }

    prevStageRef.current = stage;
  }, { scope: containerRef, dependencies: [stage, animateTransition] });

  return (
    <div 
      ref={containerRef}
      className={cn("relative inline-flex items-end justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="seedling-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="var(--sage-800)" floodOpacity="0.15" />
          </filter>
        </defs>
        
        {/* Soil line */}
        <line x1="16" y1="52" x2="48" y2="52" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
        
        <path
          ref={pathRef}
          d={stagePaths[stage]}
          fill="var(--sage-200)"
          stroke="var(--moss-700)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#seedling-shadow)"
        />
      </svg>
    </div>
  );
}

