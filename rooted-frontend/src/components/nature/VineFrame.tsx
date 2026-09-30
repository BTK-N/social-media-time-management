import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../../lib/gsap';

interface VineFrameProps {
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  duration?: number;
  delay?: number;
  color?: string;
  className?: string;
}

export const VineFrame: React.FC<VineFrameProps> = ({
  edges = ['left', 'top'],
  duration = 1.8,
  delay = 0.4,
  color = 'var(--accent-primary)',
  className = '',
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!containerRef.current) return;

    if (reducedMotion) {
      gsap.set('.vine-path', { drawSVG: '100%' });
      gsap.set('.vine-bud', { scale: 1 });
      return;
    }

    const tl = gsap.timeline({ delay });

    // Draw vines
    tl.fromTo('.vine-path', 
      { drawSVG: '0%' },
      { drawSVG: '100%', duration, ease: 'power2.inOut', stagger: 0.15 }
    );

    // Pop buds
    tl.fromTo('.vine-bud',
      { scale: 0, transformOrigin: 'center' },
      { scale: 1, duration: 0.2, stagger: 0.05, ease: 'back.out(1.7)' },
      "-=0.5" // Start buds before vines finish
    );

  }, [reducedMotion, duration, delay]);

  const inset = 8;
  const showTop = edges.includes('top');
  const showRight = edges.includes('right');
  const showBottom = edges.includes('bottom');
  const showLeft = edges.includes('left');

  return (
    <svg
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-[-1] ${className}`}
      style={{ overflow: 'visible' }}
    >
      {/* Defined paths based on 100% width/height. We use vector-effect="non-scaling-stroke" */}
      <defs>
        <style>
          {`
            .vine-path {
              fill: none;
              stroke: ${color};
              stroke-width: 1.5;
              stroke-linecap: round;
              vector-effect: non-scaling-stroke;
            }
            .vine-bud {
              fill: ${color};
            }
          `}
        </style>
      </defs>

      {showTop && (
        <g>
          <path className="vine-path" d={`M ${inset},${inset} Q 50%,${inset + 5} 100%,${inset}`} />
          <circle className="vine-bud" cx="20%" cy={inset + 2} r="2" />
          <circle className="vine-bud" cx="50%" cy={inset + 5} r="2" />
          <circle className="vine-bud" cx="80%" cy={inset + 2} r="2" />
        </g>
      )}

      {showLeft && (
        <g>
          <path className="vine-path" d={`M ${inset},${inset} Q ${inset + 5},50% ${inset},100%`} />
          <circle className="vine-bud" cx={inset + 2} cy="25%" r="2" />
          <circle className="vine-bud" cx={inset + 5} cy="60%" r="2" />
          <circle className="vine-bud" cx={inset + 1} cy="85%" r="2" />
        </g>
      )}

      {showRight && (
        <g>
          <path className="vine-path" d={`M calc(100% - ${inset}px),${inset} Q calc(100% - ${inset + 5}px),50% calc(100% - ${inset}px),100%`} />
          <circle className="vine-bud" cx={`calc(100% - ${inset + 2}px)`} cy="30%" r="2" />
          <circle className="vine-bud" cx={`calc(100% - ${inset + 4}px)`} cy="70%" r="2" />
        </g>
      )}

      {showBottom && (
        <g>
          <path className="vine-path" d={`M ${inset},calc(100% - ${inset}px) Q 50%,calc(100% - ${inset + 5}px) 100%,calc(100% - ${inset}px)`} />
          <circle className="vine-bud" cx="30%" cy={`calc(100% - ${inset + 3}px)`} r="2" />
          <circle className="vine-bud" cx="70%" cy={`calc(100% - ${inset + 2}px)`} r="2" />
        </g>
      )}
    </svg>
  );
};
