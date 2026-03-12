import { useState } from 'react'
import { Card, Button } from '@sicaho-collab/m3-design-system'
import { TextField } from '@/components/ui/text-field'
import { Eye, EyeOff } from 'lucide-react'
import {
  validateEmail,
  validatePassword,
  getPasswordStrength,
} from '@/modules/auth/onboarding/types'
import type { StudentOnboardingData } from './student-types'

interface AccountSetupProps {
  data: StudentOnboardingData
  patch: (updates: Partial<StudentOnboardingData>) => void
  onNext: () => void
}

type TouchedFields = Record<
  'fullName' | 'email' | 'password' | 'confirmPassword',
  boolean
>

export default function AccountSetup({ data, patch, onNext }: AccountSetupProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState<TouchedFields>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const fullNameError = touched.fullName
    ? !data.fullName
      ? 'Full name is required'
      : data.fullName.length < 2
        ? 'Name must be at least 2 characters'
        : null
    : null

  const emailError = touched.email ? validateEmail(data.email) : null
  const passwordError = touched.password ? validatePassword(data.password) : null

  const confirmPasswordError = touched.confirmPassword
    ? !data.confirmPassword
      ? 'Please confirm your password'
      : data.confirmPassword !== data.password
        ? 'Passwords do not match'
        : null
    : null

  const strength = data.password ? getPasswordStrength(data.password) : null

  const isStepValid =
    data.fullName.length >= 2 &&
    !validateEmail(data.email) &&
    !validatePassword(data.password) &&
    data.confirmPassword === data.password &&
    data.confirmPassword.length > 0

  const handleContinue = () => {
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    })
    if (isStepValid) onNext()
  }

  return (
    <Card
      variant="outlined"
      className="p-4 md:p-5 flex flex-col gap-4 bg-m3-surface-container-lowest"
    >
      <TextField
        variant="outlined"
        label="Full Name"
        type="text"
        autoComplete="name"
        value={data.fullName}
        onChange={e => patch({ fullName: e.target.value })}
        onBlur={() => handleBlur('fullName')}
        error={!!fullNameError}
        errorText={fullNameError ?? undefined}
      />

      <TextField
        variant="outlined"
        label="Email"
        type="email"
        autoComplete="email"
        value={data.email}
        onChange={e => patch({ email: e.target.value })}
        onBlur={() => handleBlur('email')}
        error={!!emailError}
        errorText={emailError ?? undefined}
      />

      <div>
        <TextField
          variant="outlined"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={data.password}
          onChange={e => patch({ password: e.target.value })}
          onBlur={() => handleBlur('password')}
          error={!!passwordError}
          errorText={passwordError ?? undefined}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          }
        />
        {strength && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <div className="flex-1 h-1 rounded-full bg-m3-surface-container-highest overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.colorClass}`}
                style={{ width: strength.percent }}
              />
            </div>
            <span className="text-xs text-m3-on-surface-variant">
              {strength.label}
            </span>
          </div>
        )}
      </div>

      <TextField
        variant="outlined"
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        value={data.confirmPassword}
        onChange={e => patch({ confirmPassword: e.target.value })}
        onBlur={() => handleBlur('confirmPassword')}
        error={!!confirmPasswordError}
        errorText={confirmPasswordError ?? undefined}
        trailingIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(v => !v)}
            className="cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            tabIndex={-1}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        }
      />

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-m3-outline-variant">
        <Button
          variant="filled"
          onClick={handleContinue}
          className="w-full sm:w-auto min-h-[44px]"
        >
          Continue
        </Button>
      </div>
    </Card>
  )
}
