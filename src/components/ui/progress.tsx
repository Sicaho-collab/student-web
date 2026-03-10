import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'linear' | 'circular'
  indeterminate?: boolean
}

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'linear', indeterminate = false, ...props }, ref) => {
  if (variant === 'circular') {
    const size = 48
    const strokeWidth = 4
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - ((value ?? 0) / 100) * circumference

    return (
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : (value ?? 0)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('inline-flex', indeterminate && 'animate-spin', className)}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-m3-surface-container-highest"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
            strokeLinecap="round"
            className="text-m3-primary transition-all duration-300"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
      </div>
    )
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-1 w-full overflow-hidden rounded-full bg-m3-surface-container-highest', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full bg-m3-primary rounded-full transition-all duration-300',
          indeterminate && 'animate-[indeterminate_1.5s_ease-in-out_infinite] w-1/3'
        )}
        style={indeterminate ? undefined : { width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = 'Progress'

export { Progress }
