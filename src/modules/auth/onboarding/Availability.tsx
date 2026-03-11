import { useState } from 'react'
import { Card, Chip, TextField, Button } from '@sicaho-collab/m3-design-system'
import { AlertCircle } from 'lucide-react'
import type { StudentOnboardingData } from './student-types'
import { HOURS_OPTIONS, CONTACT_METHODS } from './student-types'

interface AvailabilityProps {
  data: StudentOnboardingData
  patch: (updates: Partial<StudentOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

function getTodayString(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function Availability({ data, patch, onNext, onBack }: AvailabilityProps) {
  const [attempted, setAttempted] = useState(false)

  const today = getTodayString()

  const hoursError =
    attempted && !data.availableHours ? 'Select your available hours' : null

  const dateError =
    attempted && !data.earliestStartDate
      ? 'Start date is required'
      : attempted && data.earliestStartDate && data.earliestStartDate < today
        ? 'Start date must be today or later'
        : null

  const contactError =
    attempted && data.preferredContact.length === 0
      ? 'Select at least 1 contact method'
      : null

  const selectHours = (hours: string) => {
    patch({ availableHours: hours })
  }

  const toggleContact = (method: string) => {
    const next = data.preferredContact.includes(method)
      ? data.preferredContact.filter(m => m !== method)
      : [...data.preferredContact, method]
    patch({ preferredContact: next })
  }

  const isStepValid =
    data.availableHours !== '' &&
    data.earliestStartDate !== '' &&
    data.earliestStartDate >= today &&
    data.preferredContact.length >= 1

  const handleContinue = () => {
    setAttempted(true)
    if (isStepValid) onNext()
  }

  return (
    <Card
      variant="outlined"
      className="p-4 md:p-5 flex flex-col gap-6 bg-m3-surface-container-lowest"
    >
      {/* Available hours per week */}
      <div>
        <p className="text-sm font-semibold text-m3-on-surface mb-2">
          Available hours per week
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Available hours">
          {HOURS_OPTIONS.map(hours => (
            <Chip
              key={hours}
              variant="filter"
              selected={data.availableHours === hours}
              onClick={() => selectHours(hours)}
              className="cursor-pointer min-h-[44px]"
            >
              {hours}
            </Chip>
          ))}
        </div>
        {hoursError && (
          <div role="alert" className="flex items-center gap-2 mt-2">
            <AlertCircle className="size-4 text-m3-error shrink-0" />
            <span className="text-xs text-m3-error">{hoursError}</span>
          </div>
        )}
      </div>

      {/* Earliest start date */}
      <div>
        <TextField
          variant="outlined"
          label="Earliest Start Date"
          type="date"
          value={data.earliestStartDate}
          onChange={e => patch({ earliestStartDate: e.target.value })}
          min={today}
          error={!!dateError}
          errorText={dateError ?? undefined}
        />
      </div>

      {/* Preferred contact method */}
      <div>
        <p className="text-sm font-semibold text-m3-on-surface mb-2">
          Preferred contact method
        </p>
        <div className="flex flex-wrap gap-2" role="listbox" aria-label="Contact methods">
          {CONTACT_METHODS.map(method => (
            <Chip
              key={method}
              variant="filter"
              selected={data.preferredContact.includes(method)}
              onClick={() => toggleContact(method)}
              className="cursor-pointer min-h-[44px]"
            >
              {method}
            </Chip>
          ))}
        </div>
        {contactError && (
          <div role="alert" className="flex items-center gap-2 mt-2">
            <AlertCircle className="size-4 text-m3-error shrink-0" />
            <span className="text-xs text-m3-error">{contactError}</span>
          </div>
        )}
      </div>

      {/* Phone number (conditional) */}
      {data.preferredContact.includes('Phone') && (
        <TextField
          variant="outlined"
          label="Phone Number (optional)"
          type="tel"
          autoComplete="tel"
          value={data.phoneNumber}
          onChange={e => patch({ phoneNumber: e.target.value })}
        />
      )}

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t border-m3-outline-variant">
        <Button
          variant="outlined"
          onClick={onBack}
          className="w-full sm:w-auto min-h-[44px]"
        >
          Back
        </Button>
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
