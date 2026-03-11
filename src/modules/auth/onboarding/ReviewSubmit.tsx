import { useState } from 'react'
import { Card, Button, Checkbox, Progress } from '@sicaho-collab/m3-design-system'
import { AlertCircle, Pencil } from 'lucide-react'
import type { StudentOnboardingData } from './student-types'

interface ReviewSubmitProps {
  data: StudentOnboardingData
  patch: (updates: Partial<StudentOnboardingData>) => void
  onBack: () => void
  onGoToStep: (step: number) => void
  onSubmitSuccess: () => void
}

interface SectionProps {
  title: string
  stepIndex: number
  onEdit: (step: number) => void
  children: React.ReactNode
}

function ReviewSection({ title, stepIndex, onEdit, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-m3-on-surface">{title}</h3>
        <Button
          variant="text"
          size="sm"
          onClick={() => onEdit(stepIndex)}
          className="min-h-[44px] min-w-[44px] flex items-center gap-1"
        >
          <Pencil className="size-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </div>
      <div className="text-sm text-m3-on-surface-variant flex flex-col gap-1">
        {children}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2">
      <span className="font-medium text-m3-on-surface min-w-[140px]">{label}:</span>
      <span>{value || '—'}</span>
    </div>
  )
}

export default function ReviewSubmit({
  data,
  patch,
  onBack,
  onGoToStep,
  onSubmitSuccess,
}: ReviewSubmitProps) {
  const [attempted, setAttempted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const termsError = attempted && !data.termsAccepted
    ? 'You must accept the Terms & Conditions'
    : null

  const handleSubmit = async () => {
    setAttempted(true)
    if (!data.termsAccepted) return

    setIsLoading(true)
    setServerError(null)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      onSubmitSuccess()
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      variant="outlined"
      className="p-4 md:p-5 flex flex-col gap-6 bg-m3-surface-container-lowest"
    >
      <p className="text-sm text-m3-on-surface-variant">
        Please review your information before submitting.
      </p>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="bg-m3-error-container rounded-m3-sm p-4 flex items-center gap-3"
        >
          <AlertCircle className="size-5 text-m3-on-error-container shrink-0" />
          <span className="text-m3-on-error-container text-sm">{serverError}</span>
        </div>
      )}

      {/* Section 1: Account */}
      <ReviewSection title="Account" stepIndex={1} onEdit={onGoToStep}>
        <Field label="Name" value={data.fullName} />
        <Field label="Email" value={data.email} />
      </ReviewSection>

      <hr className="border-m3-outline-variant" />

      {/* Section 2: Profile */}
      <ReviewSection title="Profile" stepIndex={2} onEdit={onGoToStep}>
        <Field label="University" value={data.university} />
        <Field label="Major" value={data.fieldOfStudy} />
        <Field label="Year" value={data.yearOfStudy} />
        {data.bio && <Field label="Bio" value={data.bio} />}
      </ReviewSection>

      <hr className="border-m3-outline-variant" />

      {/* Section 3: Skills & Interests */}
      <ReviewSection title="Skills & Interests" stepIndex={3} onEdit={onGoToStep}>
        <Field label="Skills" value={data.skills.join(', ')} />
        <Field label="Interests" value={data.interests.join(', ')} />
      </ReviewSection>

      <hr className="border-m3-outline-variant" />

      {/* Section 4: Availability */}
      <ReviewSection title="Availability" stepIndex={4} onEdit={onGoToStep}>
        <Field label="Hours/week" value={data.availableHours} />
        <Field label="Start date" value={data.earliestStartDate} />
        <Field label="Contact" value={data.preferredContact.join(', ')} />
        {data.preferredContact.includes('Phone') && data.phoneNumber && (
          <Field label="Phone" value={data.phoneNumber} />
        )}
      </ReviewSection>

      <hr className="border-m3-outline-variant" />

      {/* Terms */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <Checkbox
            checked={data.termsAccepted}
            onCheckedChange={checked => patch({ termsAccepted: checked === true })}
            disabled={isLoading}
          />
          <span className="text-sm text-m3-on-surface">
            I agree to the{' '}
            <button
              type="button"
              className="text-m3-primary font-medium hover:underline"
            >
              Terms &amp; Conditions
            </button>
          </span>
        </label>
        {termsError && (
          <div role="alert" className="flex items-center gap-2 mt-1 ml-8">
            <AlertCircle className="size-4 text-m3-error shrink-0" />
            <span className="text-xs text-m3-error">{termsError}</span>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center">
          <Progress variant="circular" indeterminate />
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t border-m3-outline-variant">
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-auto min-h-[44px]"
        >
          Back
        </Button>
        <Button
          variant="filled"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto min-h-[44px]"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </Card>
  )
}
