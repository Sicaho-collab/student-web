import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m3-primary disabled:pointer-events-none disabled:opacity-38 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0 select-none',
  {
    variants: {
      variant: {
        filled:
          'bg-m3-primary text-m3-on-primary hover:shadow-m3-1 active:shadow-none rounded-m3-full',
        outlined:
          'border border-m3-outline text-m3-primary hover:bg-m3-primary/8 active:bg-m3-primary/12 rounded-m3-full',
        text:
          'text-m3-primary hover:bg-m3-primary/8 active:bg-m3-primary/12 rounded-m3-full',
        elevated:
          'bg-m3-surface-container-low text-m3-primary shadow-m3-1 hover:shadow-m3-2 active:shadow-m3-1 rounded-m3-full',
        tonal:
          'bg-m3-secondary-container text-m3-on-secondary-container hover:shadow-m3-1 active:shadow-none rounded-m3-full',
        ghost:
          'text-m3-on-surface hover:bg-m3-on-surface/8 active:bg-m3-on-surface/12 rounded-m3-full',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
