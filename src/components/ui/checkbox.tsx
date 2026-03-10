import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-[18px] w-[18px] shrink-0 rounded-[2px] border-2 border-m3-on-surface-variant transition-all duration-200',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m3-primary',
      'disabled:cursor-not-allowed disabled:opacity-38',
      'data-[state=checked]:bg-m3-primary data-[state=checked]:border-m3-primary data-[state=checked]:text-m3-on-primary',
      'data-[state=indeterminate]:bg-m3-primary data-[state=indeterminate]:border-m3-primary data-[state=indeterminate]:text-m3-on-primary',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      {props.checked === 'indeterminate' ? (
        <Minus className="size-3.5 stroke-[3]" />
      ) : (
        <Check className="size-3.5 stroke-[3]" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

export { Checkbox }
