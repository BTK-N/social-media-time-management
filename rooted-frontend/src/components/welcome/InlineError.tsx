import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Leaf } from '../nature';

export interface InlineErrorProps {
  message?: string;
  className?: string;
}

export const InlineError = forwardRef<HTMLDivElement, InlineErrorProps>(
  ({ message, className }, ref) => {
    if (!message) return null;
    
    return (
      <div 
        ref={ref} 
        className={cn("flex items-start gap-1.5 mt-2 text-state-error text-xs", className)}
        role="alert"
      >
        {/* A wilted leaf metaphor */}
        <div className="rotate-180 mt-0.5 shrink-0 opacity-80">
          <Leaf size={12} animate="none" color="var(--state-error)" />
        </div>
        <span>{message}</span>
      </div>
    );
  }
);
InlineError.displayName = 'InlineError';
