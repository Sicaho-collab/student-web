import { useState } from 'react'
import { Card, TextField, Button } from '@sicaho-collab/m3-design-system'
import type { StudentOnboardingData } from './student-types'
import { YEAR_OPTIONS } from './student-types'

interface ProfileInfoProps {
  data: StudentOnboardingData
  patch: (updates: Partial<StudentOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

type TouchedFields = Record<'university' | 'fieldOfStudy' | 'yearOfStudy', boolean>

export default function ProfileInfo({ data, patch, onNext, onBack }: ProfileInfoProps) {
  const [touched, setTouched] = useState<TouchedFields>({
    university: false,
    fieldOfStudy: false,
    yearOfStudy: false,
  })

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const universityError = touched.university && !data.university
    ? 'University / School name is required'
    : null

  const fieldOfStudyError = touched.fieldOfStudy && !data.fieldOfStudy
    ? 'Field of study is required'
    : null

  const yearOfStudyError = touched.yearOfStudy && !data.yearOfStudy
    ? 'Year of study is required'
    : null

  const bioRemaining = 300 - data.bio.length

  const isStepValid =
    data.university.length > 0 &&
    data.fieldOfStudy.length > 0 &&
    data.yearOfStudy !== ''

  const handleContinue = () => {
    setTouched({ university: true, fieldOfStudy: true, yearOfStudy: true })
    if (isStepValid) onNext()
  }

  return (
    <Card
      variant="outlined"
      className="p-4 md:p-5 flex flex-col gap-4 bg-m3-surface-container-lowest"
    >
      <TextField
        variant="outlined"
        label="University / School Name"
        type="text"
        value={data.university}
        onChange={e => patch({ university: e.target.value })}
        onBlur={() => handleBlur('university')}
        error={!!universityError}
        errorText={universityError ?? undefined}
      />

      <TextField
        variant="outlined"
        label="Field of Study / Major"
        type="text"
        value={data.fieldOfStudy}
        onChange={e => patch({ fieldOfStudy: e.target.value })}
        onBlur={() => handleBlur('fieldOfStudy')}
        error={!!fieldOfStudyError}
        errorText={fieldOfStudyError ?? undefined}
      />

      {/* Year of Study select */}
      <div>
        <label
          htmlFor="year-of-study"
          className="block text-sm font-medium text-m3-on-surface-variant mb-1 px-1"
        >
          Year of Study
        </label>
        <select
          id="year-of-study"
          value={data.yearOfStudy}
          onChange={e => patch({ yearOfStudy: e.target.value as StudentOnboardingData['yearOfStudy'] })}
          onBlur={() => handleBlur('yearOfStudy')}
          className={`w-full h-14 px-4 text-sm bg-transparent border rounded-m3-xs outline-none transition-colors duration-200 ${
            yearOfStudyError
              ? 'border-m3-error text-m3-error'
              : 'border-m3-outline text-m3-on-surface focus:border-m3-primary focus:border-2'
          }`}
        >
          <option value="" disabled>
            Select year of study
          </option>
          {YEAR_OPTIONS.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {yearOfStudyError && (
          <p className="text-xs mt-1 px-4 text-m3-error">{yearOfStudyError}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <TextField
          variant="outlined"
          label="Short Bio (optional)"
          multiline
          rows={3}
          value={data.bio}
          onChange={e => {
            if (e.target.value.length <= 300) {
              patch({ bio: e.target.value })
            }
          }}
        />
        <p className="text-xs text-m3-on-surface-variant text-right mt-1 px-1">
          {bioRemaining} characters remaining
        </p>
      </div>

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
