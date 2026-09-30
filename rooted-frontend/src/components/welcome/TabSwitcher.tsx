import React from 'react';
import { useReducedMotion } from '../../lib/gsap';

export type TabMode = 'login' | 'signup';

interface TabSwitcherProps {
  activeTab: TabMode;
  onChange: (tab: TabMode) => void;
  labels: {
    login: string;
    signup: string;
  };
}

export function TabSwitcher({ activeTab, onChange, labels }: TabSwitcherProps) {
  const reducedMotion = useReducedMotion();
  const isSignup = activeTab === 'signup';

  return (
    <div 
      className="relative flex items-center p-1 rounded-full bg-sand-100 mb-8 w-full"
      role="tablist"
      aria-label="Welcome Options"
    >
      {/* Sliding Background Pill */}
      <div 
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-sage-600 rounded-full shadow-sm z-0"
        style={{
          transform: `translateX(${isSignup ? '100%' : '0'})`,
          transition: reducedMotion ? 'none' : 'transform 250ms cubic-bezier(0.15,0.85,0.35,1)'
        }}
      />

      <TabButton 
        id="login" 
        label={labels.login} 
        isActive={!isSignup} 
        onClick={() => onChange('login')}
      />
      <TabButton 
        id="signup" 
        label={labels.signup} 
        isActive={isSignup} 
        onClick={() => onChange('signup')}
      />
    </div>
  );
}

function TabButton({ id, label, isActive, onClick }: { 
  id: string, 
  label: string, 
  isActive: boolean, 
  onClick: () => void 
}) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-panel`}
      id={`${id}-tab`}
      onClick={onClick}
      className={`relative flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 ${
        isActive ? 'text-cream' : 'text-muted hover:text-primary'
      }`}
    >
      {label}
    </button>
  );
}
