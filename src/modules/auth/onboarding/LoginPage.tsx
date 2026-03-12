import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Button } from '@sicaho-collab/ui-web'
import { TextField } from '@/components/ui/text-field'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { validateEmail, validatePassword } from './types'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = touched.email ? validateEmail(email) : null
  const passwordError = touched.password ? validatePassword(password) : null

  const isValid = !validateEmail(email) && !validatePassword(password)

  const handleBlur = useCallback((field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    if (!isValid) return

    setIsLoading(true)
    setServerError(null)

    try {
      // TODO: Replace with actual API call
      // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: email.toLowerCase(), password }) })
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate: check if first-time user → onboarding, else → earn
      const isFirstTime = false // TODO: derive from API response
      navigate(isFirstTime ? '/onboarding' : '/earn')
    } catch {
      setServerError('Invalid email or password.')
      setPassword('')
      setTouched(prev => ({ ...prev, password: false }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-[480px] mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src={`${import.meta.env.BASE_URL}alumable-horizontal.png`} alt="Alumable" className="h-10" />
      </div>

      {/* Heading */}
      <h1 className="text-xl font-semibold text-m3-on-surface text-center">
        Welcome Back
      </h1>
      <p className="text-sm text-m3-on-surface-variant text-center mb-8">
        Log in to your student account
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
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setServerError(null) }}
            onBlur={() => handleBlur('email')}
            error={!!emailError}
            errorText={emailError ?? undefined}
            disabled={isLoading}
          />

          <TextField
            variant="outlined"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setServerError(null) }}
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

          <div className="flex justify-end">
            <Button variant="text" size="sm" type="button" asChild>
              <Link to="/forgot-password">Forgot Password?</Link>
            </Button>
          </div>

          <Button
            variant="filled"
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </Card>
      </form>

      {/* Footer link */}
      <p className="text-sm text-m3-on-surface-variant text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/sign-up" className="text-m3-primary font-medium hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
