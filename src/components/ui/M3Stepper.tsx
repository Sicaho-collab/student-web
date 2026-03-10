import { cn } from '@/lib/utils'

interface Step {
  label: string
}

interface M3StepperProps {
  steps: Step[]
  current: number   // 1-indexed
  className?: string
}

export default function M3Stepper({ steps, current, className }: M3StepperProps) {
  return (
    <div className={cn('flex items-center gap-0', className)}>
      {steps.map((step, i) => {
        const n     = i + 1
        const done  = n < current
        const active = n === current

        return (
          <div key={n} className="flex items-center flex-1 min-w-0">
            {/* Connector line (before all steps except first) */}
            {i > 0 && (
              <div
                className={cn(
                  'flex-1 h-[2px] mx-1 transition-colors duration-300',
                  done ? 'bg-m3-primary' : 'bg-m3-outline-variant'
                )}
              />
            )}

            {/* Step circle + label */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300',
                  done
                    ? 'bg-m3-primary text-white'
                    : active
                      ? 'bg-m3-primary text-white shadow-m3-1'
                      : 'border-2 border-m3-outline-variant text-m3-on-surface-variant'
                )}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : n}
              </div>
              <span
                className={cn(
                  'text-sm whitespace-nowrap transition-colors duration-200 hidden sm:inline',
                  active
                    ? 'font-semibold text-m3-primary'
                    : done
                      ? 'font-medium text-m3-on-surface'
                      : 'text-m3-on-surface-variant'
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
