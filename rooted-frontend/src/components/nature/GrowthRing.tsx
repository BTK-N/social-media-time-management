import React, { useRef } from 'react';
import { gsap, DrawSVGPlugin } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../../lib/utils';

export interface GrowthRingProps {
  value: number; // 0-5
  max?: number; // 5
  risk: 'deep' | 'shallow' | 'tangled';
  size?: number | 'sm'; // default 220
  animate?: boolean; // default true
  label?: string;
  className?: string;
}

export function GrowthRing({ 
  value, 
  max = 5, 
  risk, 
  size = 220, 
  animate = true, 
  label, 
  className 
}: GrowthRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getRiskColor = () => {
    switch (risk) {
      case 'deep': return 'var(--risk-deep)';
      case 'shallow': return 'var(--risk-shallow)';
      case 'tangled': return 'var(--risk-tangled)';
    }
  };

  const ringColor = getRiskColor();
  const trackColor = 'var(--growth-ring-track)';
  
  const isSm = size === 'sm';
  const numSize = isSm ? 32 : (size as number);
  const displayMax = isSm ? 1 : max;
  const displayValue = isSm ? (value / max) : value;

  // Calculate radii
  const center = numSize / 2;
  const strokeWidth = isSm ? 2.5 : (numSize * 0.08); 
  const gap = strokeWidth * 1.5;
  const baseRadius = isSm ? (center - strokeWidth) : (numSize * 0.15); // Inner-most radius

  const rings = Array.from({ length: displayMax }).map((_, i) => {
    const isFilled = i < Math.floor(displayValue) || (i === Math.floor(displayValue) && displayValue % 1 !== 0);
    const radius = baseRadius + (i * gap);
    // Handle partial fills for decimals
    const fillRatio = i < Math.floor(displayValue) ? 1 : (i === Math.floor(displayValue) ? displayValue % 1 : 0);
    
    return {
      id: i,
      radius,
      isFilled,
      fillRatio
    };
  });

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const filledPaths = gsap.utils.toArray<SVGPathElement>('.growth-ring-filled', containerRef.current);
    
    if (!animate || prefersReduced) {
      // Instant snap using DrawSVG for consistency
      filledPaths.forEach(path => {
        const fillRatio = parseFloat(path.dataset.fillRatio || "1");
        gsap.set(path, { drawSVG: `0% ${fillRatio * 100}%` });
      });
      return;
    }

    // Initialize to 0%
    gsap.set(filledPaths, { drawSVG: "0% 0%" });

    // Draw them staggered
    filledPaths.forEach((path, i) => {
      const fillRatio = parseFloat(path.dataset.fillRatio || "1");
      gsap.to(path, {
        drawSVG: `0% ${fillRatio * 100}%`,
        duration: 1.2,
        ease: 'rooted',
        delay: i * 0.12
      });
    });

  }, { scope: containerRef, dependencies: [value, max, animate] });

  return (
    <div 
      ref={containerRef} 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: numSize, height: numSize }}
    >
      <svg width={numSize} height={numSize} className="transform -rotate-90">
        <defs>
          <radialGradient id={`inner-shadow-${risk}`} cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor={ringColor} stopOpacity="1" />
            <stop offset="100%" stopColor={ringColor} stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {rings.map((r, i) => (
          <g key={`ring-group-${i}`}>
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={r.radius}
              fill="none"
              stroke={trackColor}
              strokeWidth={isSm ? "1" : "1.5"}
            />
            {/* Filled Foreground Track */}
            {r.isFilled && (
              <circle
                className="growth-ring-filled"
                cx={center}
                cy={center}
                r={r.radius}
                fill="none"
                stroke={isSm ? ringColor : `url(#inner-shadow-${risk})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                data-fill-ratio={r.fillRatio}
              />
            )}
          </g>
        ))}
      </svg>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {!isSm && (
          <span className="font-body italic text-muted text-xs mb-1">
            {label || "Impact"}
          </span>
        )}
        <span className={cn("font-mono font-medium text-foreground", isSm ? "text-[10px]" : "text-lg")} style={{ color: ringColor }}>
          {isSm ? value.toFixed(1) : `${value.toFixed(1)} / ${max}`}
        </span>
      </div>
    </div>
  );
}

