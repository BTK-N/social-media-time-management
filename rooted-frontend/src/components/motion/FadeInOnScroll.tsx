import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect } from 'react';
import { cn } from '../../lib/utils';

export interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function FadeInOnScroll({
  children,
  delay = 0,
  duration = 0.8,
  y = 24,
  once = true,
  as: Component = 'div',
  className
}: FadeInOnScrollProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    // Use GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(containerRef.current, { opacity: 0, y });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
        once: once,
        animation: gsap.to(containerRef.current, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'rooted'
        })
      });

      // Explicitly refresh after creating trigger
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration, y, once]);

  // Failsafe: ensure content reveals even if ScrollTrigger fails
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const timer = setTimeout(() => {
      if (containerRef.current) {
        gsap.set(containerRef.current, { opacity: 1, y: 0, clearProps: 'all' });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: cn('fade-in-on-scroll', className)
    },
    children
  );
}
