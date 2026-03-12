import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button, Card, TextField, Checkbox } from '@sicaho-collab/ui-web'
import type { StudentGig } from './types'

interface ApplyFormProps {
  gig: StudentGig
}

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export default function ApplyForm({ gig }: ApplyFormProps) {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [messageTouched, setMessageTouched] = useState(false)
  const [availabilityConfirmed, setAvailabilityConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const messageRef = useRef<HTMLTextAreaElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // Focus on message field when form appears
  useEffect(() => {
    messageRef.current?.focus()
  }, [])

  // Focus on success heading after submit
  useEffect(() => {
    if (submitted) {
      successRef.current?.focus()
    }
  }, [submitted])

  // Focus on error banner when error appears
  useEffect(() => {
    if (error) {
      errorRef.current?.focus()
    }
  }, [error])

  const trimmedMessage = message.trim()
  const isValid = trimmedMessage.length > 0 && trimmedMessage.length <= 500 && availabilityConfirmed
  const messageError =
    messageTouched && trimmedMessage.length === 0 ? 'Please enter a message' : undefined
  const isAtMax = message.length >= 500

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    if (val.length <= 500) {
      setMessage(val)
    }
  }

  async function handleSubmit() {
    if (!isValid || isSubmitting) return
    setIsSubmitting(true)
    setError(false)

    // Simulate API call
    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1200)
      })
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card variant="filled" className="p-6 text-center">
        <CheckCircle size={48} className="mx-auto text-m3-primary" />
        <h2
          ref={successRef}
          tabIndex={-1}
          className="text-[var(--text-lg)] font-semibold text-m3-on-surface mt-3"
        >
          Application submitted!
        </h2>
        <p className="text-[var(--text-sm)] text-m3-on-surface-variant mt-2">
          The employer will review your application. You'll be notified when they respond.
        </p>
        <Button
          variant="outlined"
          className="mt-4"
          onClick={() => navigate('/earn')}
        >
          Back to Gigs
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface">
        Apply to this Gig
      </h2>

      <Card variant="outlined" className="p-4">
        <TextField
          ref={messageRef as any}
          variant="outlined"
          multiline
          rows={4}
          label="Message to employer"
          placeholder="Tell the employer why you're a great fit for this gig..."
          value={message}
          onChange={handleMessageChange as unknown as React.ChangeEventHandler<HTMLInputElement>}
          onBlur={() => setMessageTouched(true)}
          error={!!messageError}
          errorText={messageError}
          disabled={isSubmitting}
        />
        <p
          className={`text-[var(--text-xs)] mt-1 text-right ${
            isAtMax ? 'text-m3-error' : 'text-m3-on-surface-variant'
          }`}
        >
          {message.length} / 500
        </p>
      </Card>

      <div className="flex items-start gap-3 mt-1">
        <Checkbox
          id="availability-confirm"
          checked={availabilityConfirmed}
          onCheckedChange={checked => setAvailabilityConfirmed(checked === true)}
          disabled={isSubmitting}
        />
        <label
          htmlFor="availability-confirm"
          className="text-[var(--text-sm)] text-m3-on-surface cursor-pointer leading-snug"
        >
          I confirm I am available for the dates listed ({formatShortDate(gig.startDate)} &ndash;{' '}
          {formatShortDate(gig.endDate)})
        </label>
      </div>

      <Button
        variant="filled"
        size="lg"
        className="w-full mt-2 min-h-[44px]"
        disabled={!isValid || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>

      {error && (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="bg-m3-error-container text-m3-on-error-container text-[var(--text-sm)] p-3 rounded-m3-sm mt-1"
        >
          Something went wrong. Please try again.
        </div>
      )}
    </div>
  )
}
