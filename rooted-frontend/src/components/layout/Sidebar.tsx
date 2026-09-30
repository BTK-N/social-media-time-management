import React, { useRef, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../lib/store';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, Sprout, MessageSquare, 
  Flower2, Waves, Network, LogOut 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Flip from 'gsap/Flip';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { LanguagePill } from './LanguagePill';
import { Leaf } from '../nature/Leaf';

gsap.registerPlugin(Flip);

const navItems = [
  { to: '/diagnosis', icon: Sprout, labelKey: 'sidebar.diagnosis', defaultLabel: 'Check your soil' },
  { to: '/chat', icon: MessageSquare, labelKey: 'sidebar.chat', defaultLabel: 'The Arborist' },
  { to: '/goals', icon: Flower2, labelKey: 'sidebar.goals', defaultLabel: 'Tending the garden' },
  { to: '/history', icon: Waves, labelKey: 'sidebar.history', defaultLabel: 'Growth rings' },
  { to: '/insights', icon: Network, labelKey: 'sidebar.insights', defaultLabel: 'The Mycelium Network' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isUrdu = i18n.language.startsWith('ur');

  // Greeting logic
  const hour = new Date().getHours();
  let greeting = t('sidebar.greeting.afternoon', 'Good afternoon');
  if (hour < 12) greeting = t('sidebar.greeting.morning', 'Good morning');
  else if (hour > 18) greeting = t('sidebar.greeting.evening', 'Good evening');
  else if (hour > 22) greeting = t('sidebar.greeting.night', 'Rest well');

  // Mock days since account creation, since we don't have created_at in user type yet
  const daysActive = 12;

  const handleLogout = async () => {
    // Subtle mist fade out before routing
    gsap.to('.shell-wrapper', {
      opacity: 0,
      filter: 'blur(4px)',
      duration: 0.6,
      ease: 'rooted',
      onComplete: async () => {
        await logout();
        navigate('/welcome');
        gsap.set('.shell-wrapper', { opacity: 1, filter: 'blur(0px)' });
      }
    });
  };

  const handleToggle = () => {
    // We get the state of the toggle before mutating
    const state = Flip.getState('.sidebar-collapse-icon');
    toggleSidebar();
    
    // We delay the flip slightly to allow React to render the new state
    setTimeout(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;
      Flip.from(state, {
        duration: 0.32,
        ease: 'rooted',
        absolute: true,
      });
    }, 0);
  };

  // Flip active accent bar
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const state = Flip.getState('.active-nav-accent');
    // On location change, React re-renders and the accent bar moves in DOM.
    // Flip animates it from the old position to the new position.
    Flip.from(state, {
      duration: 0.26,
      ease: 'rooted',
      absolute: true,
    });
  }, [location.pathname]);

  return (
    <TooltipProvider delayDuration={300}>
      <aside 
        ref={containerRef}
        className={cn(
          "h-full flex flex-col bg-trunk-bg text-trunk-text transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-30 print:hidden",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* 1. Header */}
        <div className="h-16 flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <div className="w-5 h-5 rounded-t-full rounded-bl-full bg-sage-500 transform -rotate-45 shrink-0" />
              <span className="font-display font-semibold tracking-tight text-trunk-active-text">Rooted</span>
            </div>
          )}
          <button 
            onClick={handleToggle}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md text-trunk-text hover:text-trunk-active-text hover:bg-trunk-hover-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              sidebarCollapsed && "mx-auto"
            )}
          >
            <ChevronLeft className={cn(
              "w-5 h-5 transition-transform duration-300 sidebar-collapse-icon",
              sidebarCollapsed ? "rotate-180 rtl:rotate-0" : "rtl:rotate-180"
            )} />
          </button>
        </div>

        {/* 2. User Block */}
        <div className={cn("px-4 py-4 mb-8 flex items-center gap-3", sidebarCollapsed && "justify-center")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="w-10 h-10 ring-1 ring-border shrink-0 bg-trunk-hover-bg">
                <AvatarFallback className="bg-transparent text-trunk-active-text">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side={isUrdu ? "left" : "right"} sideOffset={12}>
                {user?.username}
              </TooltipContent>
            )}
          </Tooltip>
          
          {!sidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="font-body text-sm font-medium text-trunk-active-text truncate">
                {greeting}, {user?.username} {hour < 12 && '🌿'}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-trunk-text mt-0.5">
                Rooted · Day {daysActive}
              </p>
            </div>
          )}
        </div>

        {/* 3. Divider */}
        <div className="px-6 py-2 group cursor-default">
          <div className="h-[1px] w-full bg-trunk-hover-bg relative flex items-center justify-center">
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
              <Leaf size={12} color="var(--trunk-text)" animate="none" />
            </div>
          </div>
        </div>

        {/* 4. Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hide-scrollbar">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => cn(
                      "group relative flex items-center h-11 px-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                      isActive 
                        ? "bg-trunk-hover-bg text-trunk-active-text font-medium" 
                        : "text-trunk-text hover:bg-trunk-hover-bg hover:text-trunk-active-text"
                    )}
                  >
                    {isActive && (
                      <div className="active-nav-accent absolute left-0 rtl:left-auto rtl:right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-trunk-active-indicator rounded-r-full rtl:rounded-r-none rtl:rounded-l-full" />
                    )}
                    <item.icon className={cn(
                      "w-[18px] h-[18px] shrink-0 transition-transform duration-220 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                      !isActive && !sidebarCollapsed && "group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
                      sidebarCollapsed && "mx-auto"
                    )} strokeWidth={1.75} />
                    
                    {!sidebarCollapsed && (
                      <span className="ml-3 rtl:ml-0 rtl:mr-3 font-body text-[14.5px] truncate flex-1">
                        {t(item.labelKey, item.defaultLabel)}
                      </span>
                    )}
                    
                    {!sidebarCollapsed && isActive && (
                      <div className="animate-in fade-in zoom-in duration-300">
                        <Leaf size={10} color="var(--trunk-active-indicator)" animate="none" />
                      </div>
                    )}
                  </NavLink>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side={isUrdu ? "left" : "right"} sideOffset={12}>
                    {t(item.labelKey, item.defaultLabel)}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* 5. Footer */}
        <div className={cn("p-4 flex flex-col gap-4", sidebarCollapsed ? "items-center" : "")}>
          <div className={cn("flex", sidebarCollapsed ? "justify-center" : "px-2")}>
            <LanguagePill variant="dark" className={sidebarCollapsed ? "scale-90" : ""} />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleLogout}
                className={cn(
                  "group flex items-center h-10 rounded-lg text-trunk-text hover:text-trunk-active-text hover:bg-trunk-hover-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  sidebarCollapsed ? "w-10 justify-center" : "px-3 w-full"
                )}
              >
                <LogOut className={cn(
                  "w-4 h-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                  !sidebarCollapsed && "group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                )} />
                {!sidebarCollapsed && (
                  <span className="ml-3 rtl:ml-0 rtl:mr-3 font-medium text-sm">
                    {t('sidebar.logout', 'Step away')}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side={isUrdu ? "left" : "right"} sideOffset={12}>
                {t('sidebar.logout', 'Step away')}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
