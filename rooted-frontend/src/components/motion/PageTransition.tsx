import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track the current rendered element tree.
  const [displayLocation, setDisplayLocation] = useState(location);
  
  // Track if we are currently animating out.
  const isAnimatingOut = useRef(false);

  useLayoutEffect(() => {
    // If the path hasn't changed, do nothing.
    if (location.pathname === displayLocation.pathname) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReduced) {
      // Instant transition
      setDisplayLocation(location);
      window.scrollTo(0, 0);
      return;
    }

    if (containerRef.current && !isAnimatingOut.current) {
      isAnimatingOut.current = true;
      
      // Animate out
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          // Switch route content
          setDisplayLocation(location);
          // Scroll to top instantly
          window.scrollTo(0, 0);
          
          // Animate in
          if (containerRef.current) {
            gsap.fromTo(containerRef.current, 
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'rooted', onComplete: () => {
                isAnimatingOut.current = false;
              }}
            );
          } else {
            isAnimatingOut.current = false;
          }
        }
      });
    }
  }, [location, displayLocation.pathname]);

  // Initial enter animation
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (containerRef.current && !prefersReduced && location.pathname === displayLocation.pathname && !isAnimatingOut.current) {
       // Only run on first mount
       const tl = gsap.timeline();
       tl.fromTo(containerRef.current, 
         { opacity: 0, y: 8 },
         { opacity: 1, y: 0, duration: 0.5, ease: 'rooted' }
       );
    }
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {/* 
        We pass the router context through by rendering the children 
        associated with the `displayLocation`. However, since React Router 
        v6/v7 `<Outlet>` naturally uses context, we can just wrap the 
        outlet and the key prop forces a re-render/animation.
        Wait, standard <Outlet /> handles this perfectly if we just use the location.key 
        on a wrapper.
      */}
      {children}
    </div>
  );
}
