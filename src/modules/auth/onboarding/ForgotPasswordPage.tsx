import { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, TextField, Button } from '@sicaho-collab/m3-design-system'
import { AlertCircle, Mail } from 'lucide-react'
import { validateEmail } from './types'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  // Resend cooldown
  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startCooldown = useCallback(() => {
    setCooldown(60)
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const emailError = touched ? validateEmail(email) : null
  const isValid = !validateEmail(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    if (!isValid) return

    setIsLoading(true)
    setServerError(null)

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: email.toLowerCase() }) })
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmittedEmail(email.toLowerCase())
      setSuccess(true)
    } catch {
      setServerError('No account found with that email.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      startCooldown()
    } catch {
      // Silently handle resend errors
    }
  }

  // Success state
  if (success) {
    return (
      <div className="max-w-[480px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex justify-center mb-6">
          <img src={`${import.meta.env.BASE_URL}alumable-horizontal.png`} alt="Alumable" className="h-10" />
        </div>

        <h1 className="text-xl font-semibold text-m3-on-surface text-center">
          Check Your Email
        </h1>

        <Card variant="outlined" className="p-4 md:p-8 flex flex-col items-center gap-4 bg-m3-surface-container-lowest mt-8">
          <div className="w-12 h-12 rounded-full bg-m3-primary-container flex items-center justify-center">
            <Mail className="size-6 text-m3-on-primary-container" />
          </div>
          <p className="text-sm text-m3-on-surface-variant text-center">
            We&apos;ve sent a password reset link to
          </p>
          <p className="text-sm font-semibold text-m3-on-surface">{submittedEmail}</p>
          <p className="text-sm text-m3-on-surface-variant">Didn&apos;t receive it?</p>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleResend}
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Resend Email (${cooldown}s)` : 'Resend Email'}
          </Button>
        </Card>

        <div className="flex justify-center mt-6">
          <Button variant="text" asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
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
        Forgot Password
      </h1>
      <p className="text-sm text-m3-on-surface-variant text-center mb-8">
        Enter your email to receive a reset link
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
            onBlur={() => setTouched(true)}
            error={!!emailError}
            errorText={emailError ?? undefined}
            disabled={isLoading}
          />

          <Button
            variant="filled"
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Card>
      </form>

      {/* Back link */}
      <div className="flex justify-center mt-6">
        <Button variant="text" asChild>
          <Link to="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  )
}
