import * as React from "react"
import { cn } from "../../lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  labels?: [string, string];
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, labels, ...props }, ref) => {
    return (
      <div className={cn("w-full py-4", className)}>
        <input
          type="range"
          className="w-full h-1 bg-surface-raised rounded-full appearance-none outline-none cursor-pointer accent-accent"
          ref={ref}
          {...props}
        />
        {labels && (
          <div className="flex justify-between mt-2 text-xs text-muted font-medium">
            <span>{labels[0]}</span>
            <span>{labels[1]}</span>
          </div>
        )}
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
