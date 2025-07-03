import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  /**
   * The size of the progress bar.
   * @default "default"
   */
  size?: "default" | "sm"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, size = "default", ...props }, ref) => {
    const percentage = value && max ? (value / max) * 100 : 0

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        data-state={value === 0 ? "empty" : value === max ? "full" : "loading"}
        data-value={value}
        data-max={max}
        data-slot="progress"
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          size === "default" ? "h-2" : "h-1",
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
