import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const chipVariants = cva(
  'inline-flex items-center gap-2 rounded-m3-sm font-medium transition-all duration-200 select-none [&_svg]:size-[18px] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        assist:
          'border border-m3-outline text-m3-on-surface hover:bg-m3-on-surface/8 h-8 px-4 text-sm',
        filter:
          'border border-m3-outline text-m3-on-surface-variant hover:bg-m3-on-surface/8 h-8 px-4 text-sm data-[selected=true]:bg-m3-secondary-container data-[selected=true]:text-m3-on-secondary-container data-[selected=true]:border-transparent',
        input:
          'border border-m3-outline text-m3-on-surface-variant hover:bg-m3-on-surface/8 h-8 pl-4 pr-2 text-sm',
        suggestion:
          'border border-m3-outline text-m3-on-surface-variant hover:bg-m3-on-surface/8 h-8 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'assist',
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  selected?: boolean
  onRemove?: () => void
  icon?: React.ReactNode
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, selected, onRemove, icon, children, ...props }, ref) => (
    <div
      ref={ref}
      role={variant === 'filter' ? 'option' : undefined}
      aria-selected={variant === 'filter' ? selected : undefined}
      data-selected={selected}
      className={cn(chipVariants({ variant, className }))}
      {...props}
    >
      {icon}
      <span>{children}</span>
      {(variant === 'input' || onRemove) && (
        <button
          onClick={onRemove}
          className="rounded-full p-0.5 hover:bg-m3-on-surface/12 transition-colors"
          aria-label="Remove"
        >
          <X className="!size-4" />
        </button>
      )}
    </div>
  )
)
Chip.displayName = 'Chip'

export { Chip, chipVariants }
