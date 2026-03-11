import { useState } from 'react'
import { Card, Chip, Button } from '@sicaho-collab/m3-design-system'
import { AlertCircle } from 'lucide-react'
import type { StudentOnboardingData } from './student-types'
import { SKILLS_LIST, INTERESTS_LIST } from './student-types'

interface SkillsInterestsProps {
  data: StudentOnboardingData
  patch: (updates: Partial<StudentOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function SkillsInterests({ data, patch, onNext, onBack }: SkillsInterestsProps) {
  const [attempted, setAttempted] = useState(false)

  const toggleSkill = (skill: string) => {
    const next = data.skills.includes(skill)
      ? data.skills.filter(s => s !== skill)
      : [...data.skills, skill]
    patch({ skills: next })
  }

  const toggleInterest = (interest: string) => {
    const next = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest]
    patch({ interests: next })
  }

  const skillsError = attempted && data.skills.length === 0
    ? 'Select at least 1 skill'
    : null

  const interestsError = attempted && data.interests.length === 0
    ? 'Select at least 1 interest'
    : null

  const isStepValid = data.skills.length >= 1 && data.interests.length >= 1

  const handleContinue = () => {
    setAttempted(true)
    if (isStepValid) onNext()
  }

  return (
    <Card
      variant="outlined"
      className="p-4 md:p-5 flex flex-col gap-6 bg-m3-surface-container-lowest"
    >
      {/* Skills */}
      <div>
        <p className="text-sm font-semibold text-m3-on-surface mb-2">
          Skills
        </p>
        <p className="text-xs text-m3-on-surface-variant mb-3">
          Select the skills you can offer (at least 1)
        </p>
        <div className="flex flex-wrap gap-2" role="listbox" aria-label="Skills">
          {SKILLS_LIST.map(skill => (
            <Chip
              key={skill}
              variant="filter"
              selected={data.skills.includes(skill)}
              onClick={() => toggleSkill(skill)}
              className="cursor-pointer min-h-[44px]"
            >
              {skill}
            </Chip>
          ))}
        </div>
        {skillsError && (
          <div role="alert" className="flex items-center gap-2 mt-2">
            <AlertCircle className="size-4 text-m3-error shrink-0" />
            <span className="text-xs text-m3-error">{skillsError}</span>
          </div>
        )}
      </div>

      {/* Interests */}
      <div>
        <p className="text-sm font-semibold text-m3-on-surface mb-2">
          Interests / Categories
        </p>
        <p className="text-xs text-m3-on-surface-variant mb-3">
          What types of work interest you? (at least 1)
        </p>
        <div className="flex flex-wrap gap-2" role="listbox" aria-label="Interests">
          {INTERESTS_LIST.map(interest => (
            <Chip
              key={interest}
              variant="filter"
              selected={data.interests.includes(interest)}
              onClick={() => toggleInterest(interest)}
              className="cursor-pointer min-h-[44px]"
            >
              {interest}
            </Chip>
          ))}
        </div>
        {interestsError && (
          <div role="alert" className="flex items-center gap-2 mt-2">
            <AlertCircle className="size-4 text-m3-error shrink-0" />
            <span className="text-xs text-m3-error">{interestsError}</span>
          </div>
        )}
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
