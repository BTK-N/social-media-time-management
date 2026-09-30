import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../../lib/utils';

export interface BlobProps {
  color?: string;
  size?: number;
  blur?: number;
  speed?: 'slow' | 'base' | 'drift';
  intensity?: 'whisper' | 'soft' | 'present';
  className?: string;
}

export function Blob({ color = 'var(--color-sage-200)', size = 480, blur = 60, speed = 'drift', intensity = 'soft', className }: BlobProps) {
  const blobRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const getDuration = () => {
    switch (speed) {
      case 'slow': return 20;
      case 'base': return 8;
      case 'drift': return 12;
      default: return 12;
    }
  };

  const getOpacity = () => {
    switch (intensity) {
      case 'whisper': return 0.15;
      case 'soft': return 0.28;
      case 'present': return 0.40;
      default: return 0.28;
    }
  };

  // Same number of points for native SVG morphing fallback if MorphSVG isn't present
  const shapes = [
    "M 120 40 C 180 20, 220 80, 200 140 C 180 200, 100 220, 60 180 C 20 140, 40 80, 120 40 Z",
    "M 140 50 C 200 30, 210 100, 180 160 C 150 220, 80 200, 50 160 C 20 120, 60 60, 140 50 Z",
    "M 110 30 C 160 40, 230 70, 210 130 C 190 190, 120 230, 70 170 C 20 110, 50 50, 110 30 Z"
  ];

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: "sine.inOut" });
    const dur = getDuration() / 2;

    tl.to(pathRef.current, { attr: { d: shapes[1] }, duration: dur })
      .to(pathRef.current, { attr: { d: shapes[2] }, duration: dur });

  }, { scope: blobRef, dependencies: [speed] });

  return (
    <div 
      className={cn("relative pointer-events-none mix-blend-multiply", className)}
      style={{ width: size, height: size, opacity: getOpacity() }}
    >
      <svg
        ref={blobRef}
        viewBox="0 0 240 240"
        width={size}
        height={size}
        style={{ filter: `blur(${blur}px)` }}
      >
        <path
          ref={pathRef}
          d={shapes[0]}
          fill={color}
          className="origin-center"
        />
      </svg>
    </div>
  );
}
