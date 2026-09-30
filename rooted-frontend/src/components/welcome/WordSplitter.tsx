import React, { useRef } from 'react';
import { gsap, SplitText } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../lib/gsap';

interface WordSplitterProps {
  text: string;
  className?: string;
  delay?: number;
}

export function WordSplitter({ text, className, delay = 0 }: WordSplitterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !textRef.current || !containerRef.current) {
      gsap.set(containerRef.current, { opacity: 1 });
      return;
    }

    gsap.set(containerRef.current, { opacity: 1 });
    
    const split = new SplitText(textRef.current, { type: "words,chars" });
    
    gsap.fromTo(split.words, 
      { opacity: 0, y: 24 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'rooted', 
        stagger: 0.06,
        delay 
      }
    );

    return () => split.revert();
  }, { scope: containerRef, dependencies: [text, delay, reducedMotion] });

  return (
    <div ref={containerRef} className={cn('opacity-0', className)}>
      <div ref={textRef}>{text}</div>
    </div>
  );
}

