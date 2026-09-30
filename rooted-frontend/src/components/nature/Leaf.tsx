import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../../lib/utils';

export interface LeafProps {
  size?: number;
  color?: string;
  rotate?: number;
  animate?: 'none' | 'sway' | 'grow';
  className?: string;
}

export function Leaf({ size = 16, color = 'var(--accent-primary)', rotate = 0, animate = 'none', className }: LeafProps) {
  const leafRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const veinRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (animate === 'grow') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        // Fallback for DrawSVG using standard strokeDashoffset
        gsap.fromTo([pathRef.current, veinRef.current], 
          { strokeDasharray: 100, strokeDashoffset: 100, fillOpacity: 0 },
          { strokeDashoffset: 0, fillOpacity: 1, duration: 0.4, ease: 'rooted', stagger: 0.1 }
        );
      }
    }
  }, { scope: leafRef, dependencies: [animate] });

  // Asymmetric organic leaf shape
  const leafPath = "M 5 25 C 0 15, 10 5, 20 0 C 25 10, 20 20, 5 25 Z";
  const veinPath = "M 5 25 C 10 18, 15 10, 20 0";

  return (
    <svg 
      ref={leafRef}
      width={size} 
      height={size} 
      viewBox="0 0 26 26" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-transform",
        animate === 'sway' && "motion-sway",
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <defs>
        <filter id="warm-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="var(--sage-800)" floodOpacity="0.2" />
        </filter>
      </defs>
      <path 
        ref={pathRef}
        d={leafPath} 
        fill={color} 
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#warm-shadow)"
      />
      <path 
        ref={veinRef}
        d={veinPath} 
        stroke="var(--canvas)" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}
