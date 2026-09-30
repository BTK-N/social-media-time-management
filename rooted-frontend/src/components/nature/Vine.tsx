import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Leaf } from './Leaf';
import { cn } from '../../lib/utils';

export interface VineProps {
  length?: number;
  direction?: 'up' | 'down' | 'right' | 'left';
  duration?: number;
  leaves?: number;
  play?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function Vine({ length = 200, direction = 'up', duration = 1.2, leaves = 0, play = false, onComplete, className }: VineProps) {
  const vineRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [showLeaves, setShowLeaves] = useState(false);

  // Generate organic wobbly path
  const controlOffset = 15;
  const generatePath = () => {
    let d = "M 0 0 ";
    const segments = Math.max(3, Math.floor(length / 20));
    const step = length / segments;
    let current = 0;
    
    for (let i = 0; i < segments; i++) {
      const next = current + step;
      const wobble = i % 2 === 0 ? controlOffset : -controlOffset;
      d += `Q ${wobble} ${current + step / 2}, 0 ${next} `;
      current = next;
    }
    return d;
  };

  const getRotation = () => {
    switch (direction) {
      case 'up': return 180;
      case 'down': return 0;
      case 'left': return 90;
      case 'right': return -90;
    }
  };

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReduced) {
      if (pathRef.current) {
        gsap.set(pathRef.current, { strokeDasharray: 'none', strokeDashoffset: 0 });
      }
      if (leaves > 0) setShowLeaves(true);
      if (onComplete) onComplete();
      return;
    }

    if (play && pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      gsap.fromTo(pathRef.current, 
        { strokeDasharray: pathLength, strokeDashoffset: pathLength },
        { 
          strokeDashoffset: 0, 
          duration, 
          ease: 'rooted',
          onComplete: () => {
            if (leaves > 0) setShowLeaves(true);
            if (onComplete) onComplete();
          }
        }
      );
    }
  }, { scope: vineRef, dependencies: [play, duration, leaves, onComplete] });

  // Calculate leaf positions along the vine length roughly
  const leafNodes = Array.from({ length: leaves }).map((_, i) => {
    const progress = (i + 1) / (leaves + 1);
    const yPos = progress * length;
    const xPos = (i % 2 === 0 ? 8 : -8);
    return (
      <div 
        key={i} 
        className="absolute" 
        style={{ 
          top: direction === 'down' ? yPos : direction === 'up' ? length - yPos : length/2, 
          left: direction === 'right' ? yPos : direction === 'left' ? length - yPos : 0,
          transform: `translate(${xPos}px, -8px)` 
        }}
      >
        <Leaf size={12} animate={showLeaves ? 'grow' : 'none'} color="var(--sage-600)" rotate={xPos > 0 ? 45 : -45} />
      </div>
    );
  });

  const isVertical = direction === 'up' || direction === 'down';
  const width = isVertical ? 40 : length;
  const height = isVertical ? length : 40;

  return (
    <div className={cn("relative inline-block", className)} style={{ width, height }}>
      <svg
        ref={vineRef}
        width={width}
        height={height}
        viewBox={`-20 0 40 ${length}`}
        className="absolute top-0 left-0"
        style={{ transform: `rotate(${getRotation()}deg)`, transformOrigin: 'center center' }}
      >
        <path
          ref={pathRef}
          d={generatePath()}
          fill="none"
          stroke="var(--sage-400)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showLeaves && leafNodes}
    </div>
  );
}
