import React, { useRef } from 'react';
import { Button, ButtonProps } from '../ui/Button';
import { Vine } from '../nature/Vine';
import { cn } from '../../lib/utils';

export interface BreathingButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'ghost' | 'warm';
  loading?: boolean;
}

export function BreathingButton({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  className,
  ...props
}: BreathingButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Map our wrapper variant to the underlying standard Button variant
  const getButtonVariant = (): ButtonProps['variant'] => {
    if (variant === 'primary') return 'default';
    if (variant === 'ghost') return 'ghost';
    if (variant === 'warm') return 'secondary'; // using secondary as our warm tone
    return 'default';
  };

  const isWarm = variant === 'warm';

  return (
    <Button
      ref={buttonRef}
      variant={getButtonVariant()}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        // The base button handles keyboard, focus, and base layout.
        // We inject our motion-breathe class to make it feel alive.
        "motion-breathe relative overflow-hidden transition-all duration-200 ease-out-soft",
        // Enhanced interaction states
        "hover:-translate-y-px hover:shadow-md",
        "active:translate-y-[0.5px] active:shadow-sm",
        // Warm variant specific override
        isWarm && "bg-ochre-500 text-ochre-50 hover:bg-ochre-600",
        // Loading state
        loading && "pointer-events-none",
        className
      )}
      aria-busy={loading}
      {...props}
    >
      <span className={cn("inline-flex items-center justify-center transition-opacity", loading ? "opacity-0" : "opacity-100")}>
        {children}
      </span>
      
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Vine length={24} direction="up" leaves={0} play={true} duration={1} />
        </span>
      )}
    </Button>
  );
}
