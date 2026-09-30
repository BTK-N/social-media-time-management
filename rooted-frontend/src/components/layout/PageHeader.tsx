import React, { useRef } from 'react';
import { gsap, SplitText } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !titleRef.current) return;

    const split = new SplitText(titleRef.current, { type: "words,chars" });
    
    gsap.fromTo(split.words, 
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.06, 
        ease: 'rooted',
        clearProps: 'all'
      }
    );

    return () => split.revert();
  }, [title]);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold tracking-wider text-muted uppercase mb-2">
              {eyebrow}
            </p>
          )}
          <h1 
            ref={titleRef}
            className="font-display text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-primary"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-base text-secondary max-w-[60ch] mt-3">
              {subtitle}
            </p>
          )}
        </div>
        
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

