export interface LoginFormData {
  email: string
  password: string
}

export interface SignUpFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: 'employer' | 'student' | null
  termsAccepted: boolean
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordStrengthInfo {
  score: PasswordStrength
  percent: string
  label: string
  colorClass: string
}

export function getPasswordStrength(password: string): PasswordStrengthInfo {
  if (password.length < 8) {
    return { score: 'weak', percent: '25%', label: 'Weak', colorClass: 'bg-m3-error' }
  }

  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)
  const hasMixedCase = hasUpper && hasLower

  if (hasMixedCase && hasNumber && hasSymbol) {
    return { score: 'strong', percent: '100%', label: 'Strong', colorClass: 'bg-m3-primary' }
  }
  if (hasMixedCase && hasNumber) {
    return { score: 'good', percent: '75%', label: 'Good', colorClass: 'bg-m3-primary' }
  }
  return { score: 'fair', percent: '50%', label: 'Fair', colorClass: 'bg-m3-tertiary' }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required'
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}
