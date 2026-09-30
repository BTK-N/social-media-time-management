import React from 'react';
import { Blob } from './Blob';
import { FallingLeaves } from './FallingLeaves';
import { VineFrame } from './VineFrame';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../lib/gsap';

export interface PageAmbienceProps {
  variant?: 'quiet' | 'standard' | 'rich';
  className?: string;
}

export function PageAmbience({ variant = 'standard', className }: PageAmbienceProps) {
  const reducedMotion = useReducedMotion();

  const config = {
    quiet: {
      blobs: 1,
      leaves: 3,
      vines: false,
    },
    standard: {
      blobs: 2,
      leaves: 6,
      vines: false,
    },
    rich: {
      blobs: 2,
      leaves: 10,
      vines: true,
    },
  }[variant];

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-0 overflow-hidden", className)} aria-hidden="true">
      {/* Blobs */}
      {config.blobs >= 1 && (
        <Blob 
          color="var(--color-sage-200)" 
          size={500} 
          blur={80} 
          speed="drift" 
          intensity="whisper" 
          className="absolute -top-32 -left-32 opacity-20" 
        />
      )}
      {config.blobs >= 2 && (
        <Blob 
          color="var(--color-ochre-200)" 
          size={600} 
          blur={100} 
          speed="slow" 
          intensity="whisper" 
          className="absolute top-1/3 -right-32 opacity-15" 
        />
      )}

      {/* Leaves */}
      {!reducedMotion && config.leaves > 0 && (
        <FallingLeaves count={config.leaves} intensity="subtle" />
      )}

      {/* Vines (only for rich) */}
      {config.vines && (
        <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.08]">
          <VineFrame edges={['top', 'right']} />
        </div>
      )}
    </div>
  );
}
