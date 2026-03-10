import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textFieldVariants = cva(
  'relative w-full',
  {
    variants: {
      variant: {
        filled: '',
        outlined: '',
      },
    },
    defaultVariants: {
      variant: 'filled',
    },
  }
)

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof textFieldVariants> {
  label?: string
  supportingText?: string
  error?: boolean
  errorText?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  multiline?: boolean
  rows?: number
}

const TextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      className,
      variant,
      label,
      supportingText,
      error,
      errorText,
      leadingIcon,
      trailingIcon,
      multiline = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId()
    const supportId = React.useId()

    const wrapperClass = cn(
      'relative flex',
      multiline ? 'items-start' : 'items-center',
      variant === 'filled' &&
        'bg-m3-surface-container-highest rounded-t-m3-xs border-b-2 border-m3-on-surface-variant focus-within:border-m3-primary',
      variant === 'outlined' &&
        'border border-m3-outline rounded-m3-xs focus-within:border-2 focus-within:border-m3-primary',
      error && 'border-m3-error focus-within:border-m3-error'
    )

    const sharedInputClass = cn(
      'peer w-full bg-transparent outline-none text-m3-on-surface text-sm font-[inherit]',
      leadingIcon && 'pl-2',
      trailingIcon && 'pr-2'
    )

    return (
      <div className={cn(textFieldVariants({ variant }), className)}>
        <div className={wrapperClass}>
          {leadingIcon && (
            <span className="pl-3 text-m3-on-surface-variant [&_svg]:size-5">
              {leadingIcon}
            </span>
          )}
          <div className={cn('relative flex-1 min-w-0', multiline && 'bg-m3-surface')}>
            {multiline ? (
              <textarea
                ref={ref as React.Ref<HTMLTextAreaElement>}
                id={inputId}
                rows={rows}
                aria-describedby={supportingText || errorText ? supportId : undefined}
                aria-invalid={error}
                className={cn(sharedInputClass, 'resize-vertical px-4 pt-6 pb-2 placeholder-transparent leading-relaxed')}
                placeholder={label}
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              />
            ) : (
              <input
                ref={ref as React.Ref<HTMLInputElement>}
                id={inputId}
                aria-describedby={supportingText || errorText ? supportId : undefined}
                aria-invalid={error}
                className={cn(sharedInputClass, 'h-14 px-4 pt-4 pb-1 placeholder-transparent')}
                placeholder={label}
                {...props}
              />
            )}
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'absolute text-m3-on-surface-variant text-base transition-all duration-200 pointer-events-none',
                  multiline
                    ? 'left-3 right-3 top-0 pt-1.5 pb-0.5 z-[1] bg-inherit peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs'
                    : 'left-4 top-1/2 -translate-y-1/2 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs',
                  leadingIcon && 'left-2',
                  error
                    ? 'text-m3-error'
                    : 'peer-focus:text-m3-primary peer-[:not(:placeholder-shown):not(:focus)]:text-m3-on-surface-variant'
                )}
              >
                {label}
              </label>
            )}
          </div>
          {trailingIcon && !multiline && (
            <span className="pr-3 text-m3-on-surface-variant [&_svg]:size-5">
              {trailingIcon}
            </span>
          )}
        </div>
        {(supportingText || errorText) && (
          <p
            id={supportId}
            className={cn(
              'text-xs mt-1 px-4',
              error ? 'text-m3-error' : 'text-m3-on-surface-variant'
            )}
          >
            {error ? errorText : supportingText}
          </p>
        )}
      </div>
    )
  }
)
TextField.displayName = 'TextField'

export { TextField, textFieldVariants }
