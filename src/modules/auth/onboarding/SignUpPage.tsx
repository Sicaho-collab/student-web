import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Button, Chip, Checkbox } from '@sicaho-collab/ui-web'
import { TextField } from '@/components/ui/text-field'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  type SignUpFormData,
} from './types'

type TouchedFields = Record<keyof Pick<SignUpFormData, 'fullName' | 'email' | 'password' | 'confirmPassword'>, boolean>

export default function SignUpPage() {
  const navigate = useNavigate()

  const [data, setData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    termsAccepted: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [touched, setTouched] = useState<TouchedFields>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  const patch = useCallback((updates: Partial<SignUpFormData>) => {
    setData(prev => ({ ...prev, ...updates }))
    setServerError(null)
  }, [])

  const handleBlur = useCallback((field: keyof TouchedFields) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  // Validation
  const fullNameError = touched.fullName
    ? !data.fullName ? 'Full name is required'
    : data.fullName.length < 2 ? 'Name must be at least 2 characters'
    : null
    : null

  const emailError = touched.email ? validateEmail(data.email) : null
  const passwordError = touched.password ? validatePassword(data.password) : null

  const confirmPasswordError = touched.confirmPassword
    ? !data.confirmPassword ? 'Please confirm your password'
    : data.confirmPassword !== data.password ? 'Passwords do not match'
    : null
    : null

  const strength = data.password ? getPasswordStrength(data.password) : null

  const isValid =
    data.fullName.length >= 2 &&
    !validateEmail(data.email) &&
    !validatePassword(data.password) &&
    data.confirmPassword === data.password &&
    data.confirmPassword.length > 0 &&
    data.role !== null &&
    data.termsAccepted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true })

    if (!isValid) return

    setIsLoading(true)
    setServerError(null)

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ ...data, email: data.email.toLowerCase() }) })
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch {
      setServerError('An account with this email already exists.')
    } finally {
      setIsLoading(false)
    }
  }

  // Success confirmation state
  if (success) {
    return (
      <div className="max-w-[480px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex justify-center mb-6">
          <img src={`${import.meta.env.BASE_URL}alumable-horizontal.png`} alt="Alumable" className="h-10" />
        </div>

        <h1 className="text-xl font-semibold text-m3-on-surface text-center mb-8">
          Create Account
        </h1>

        <Card variant="outlined" className="p-4 md:p-8 flex flex-col items-center gap-4 bg-m3-surface-container-lowest">
          <div className="w-12 h-12 rounded-full bg-m3-primary-container flex items-center justify-center">
            <Check className="size-6 text-m3-on-primary-container" />
          </div>
          <h2 className="text-lg font-semibold text-m3-on-surface">Account Created</h2>
          <p className="text-sm text-m3-on-surface-variant text-center">
            Your student account has been created successfully. You can now log in.
          </p>
          <Button variant="filled" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[480px] mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src={`${import.meta.env.BASE_URL}alumable-horizontal.png`} alt="Alumable" className="h-10" />
      </div>

      {/* Heading */}
      <h1 className="text-xl font-semibold text-m3-on-surface text-center">
        Create Account
      </h1>
      <p className="text-sm text-m3-on-surface-variant text-center mb-8">
        Join Alumable as a student
      </p>

      {/* Error Banner */}
      {serverError && (
        <div
          role="alert"
          className="bg-m3-error-container rounded-m3-sm p-4 mb-4 flex items-center gap-3"
        >
          <AlertCircle className="size-5 text-m3-on-error-container shrink-0" />
          <span className="text-m3-on-error-container text-sm">{serverError}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <Card variant="outlined" className="p-4 md:p-5 flex flex-col gap-4 bg-m3-surface-container-lowest">
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
            disabled={isLoading}
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
            disabled={isLoading}
          />

          {/* Password + strength indicator */}
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
              disabled={isLoading}
              trailingIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="cursor-pointer"
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
                <span className="text-xs text-m3-on-surface-variant">{strength.label}</span>
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
            disabled={isLoading}
            trailingIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="cursor-pointer"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            }
          />

          {/* Role selector — defaulted to Student */}
          <div>
            <p className="text-sm font-semibold text-m3-on-surface mb-2">I am a:</p>
            <div className="flex gap-2 flex-wrap">
              <Chip
                variant="filter"
                selected={data.role === 'student'}
                onClick={() => patch({ role: 'student' })}
                className="cursor-pointer"
              >
                Student
              </Chip>
              <Chip
                variant="filter"
                selected={data.role === 'employer'}
                onClick={() => patch({ role: 'employer' })}
                className="cursor-pointer"
              >
                Employer
              </Chip>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={data.termsAccepted}
              onCheckedChange={(checked) => patch({ termsAccepted: checked === true })}
              disabled={isLoading}
            />
            <span className="text-sm text-m3-on-surface">
              I agree to the{' '}
              <button type="button" className="text-m3-primary font-medium hover:underline">
                Terms &amp; Conditions
              </button>
            </span>
          </label>

          <Button
            variant="filled"
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </Button>
        </Card>
      </form>

      {/* Footer link */}
      <p className="text-sm text-m3-on-surface-variant text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-m3-primary font-medium hover:underline">
          Log In
        </Link>
      </p>
    </div>
  )
}
