import React, { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface UnderlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const UnderlineInput = forwardRef<HTMLInputElement, UnderlineInputProps>(
  ({ className, type, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative group">
        <input
          type={inputType}
          className={cn(
            "flex w-full bg-transparent px-0 py-2.5 text-[15px] font-body",
            "border-0 border-b border-border-subtle",
            "transition-all duration-200 ease-out-soft",
            "placeholder:text-muted focus-visible:outline-none",
            "focus-visible:border-border-focus focus-visible:shadow-[0_1px_0_0_var(--border-focus)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-state-error focus-visible:border-state-error focus-visible:shadow-[0_1px_0_0_var(--state-error)]",
            isPassword && "pr-8",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    );
  }
);
UnderlineInput.displayName = 'UnderlineInput';
