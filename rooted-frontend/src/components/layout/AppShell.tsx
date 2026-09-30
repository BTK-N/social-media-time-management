import React, { useRef } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../../lib/store';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sidebar } from './Sidebar';
import { MobileTopBar } from './MobileTopBar';
import { Sheet, SheetContent, SheetPortal } from '../ui/sheet';
import { cn } from '../../lib/utils';
import { PageAmbience } from '../nature/PageAmbience';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AppShell() {
  const { sidebarCollapsed } = useUIStore();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Route transition (fade out/in)
  useGSAP(() => {
    if (!mainRef.current) return;
    
    // Import smoother
    import('../../lib/smooth-scroll').then(({ smoother }) => {
      if (smoother) smoother.scrollTop(0);
      // Wait a tick for render, then refresh
      setTimeout(() => ScrollTrigger.refresh(), 50);
    });

    // Animate in the new page
    gsap.fromTo(mainRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'rooted', clearProps: 'all' }
    );
  }, [location.pathname]);

  const getAmbienceVariant = (path: string) => {
    if (path.includes('diagnosis')) return 'quiet';
    if (path.includes('goals')) return 'rich';
    return 'standard';
  };

  return (
    <div className="flex min-h-screen bg-canvas shell-wrapper antialiased selection-leaf">
      {/* Mobile Nav Drawer */}
      <Sheet>
        <MobileTopBar />
        {/* We use side="left" but it handles RTL inside SheetContent automatically */}
        <SheetContent side="left" className="w-[260px] p-0 border-r-0 sm:max-w-[260px]">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Nav Trunk */}
      <div className="hidden md:block shrink-0 h-screen sticky top-0 z-20 shadow-soft">
        <Sidebar />
      </div>

      {/* Main Content Branch */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 flex flex-col min-w-0 relative transition-all duration-300 z-10",
          "pt-14 md:pt-0" // Add top padding for mobile top bar
        )}
      >
        <PageAmbience variant={getAmbienceVariant(location.pathname)} />
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
        <main 
          ref={mainRef}
          className="flex-1 relative z-10"
        >
          <div className="max-w-4xl mx-auto px-6 py-8 md:px-12 md:py-12 pb-24">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
