import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import M3Stepper from '@/components/ui/M3Stepper'
import AccountSetup from './AccountSetup'
import ProfileInfo from './ProfileInfo'
import SkillsInterests from './SkillsInterests'
import Availability from './Availability'
import ReviewSubmit from './ReviewSubmit'
import { STEPPER_STEPS, createInitialData } from './student-types'
import type { StudentOnboardingData } from './student-types'

export default function StudentOnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<StudentOnboardingData>(createInitialData)
  const [success, setSuccess] = useState(false)

  const patch = useCallback((updates: Partial<StudentOnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const goNext = () => setStep(s => Math.min(s + 1, 5))
  const goBack = () => setStep(s => Math.max(s - 1, 1))
  const goToStep = (target: number) => setStep(target)

  // Success confirmation
  if (success) {
    return (
      <div className="max-w-[480px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex justify-center mb-6">
          <img src={`${import.meta.env.BASE_URL}alumable-horizontal.png`} alt="Alumable" className="h-10" />
        </div>

        <h1 className="text-xl font-semibold text-m3-on-surface text-center mb-8">
          Student Onboarding
        </h1>

        <Card
          variant="outlined"
          className="p-4 md:p-8 flex flex-col items-center gap-4 bg-m3-surface-container-lowest"
        >
          <div className="w-12 h-12 rounded-full bg-m3-primary-container flex items-center justify-center">
            <Check className="size-6 text-m3-on-primary-container" />
          </div>
          <h2 className="text-lg font-semibold text-m3-on-surface">
            You&apos;re All Set!
          </h2>
          <p className="text-sm text-m3-on-surface-variant text-center">
            Your student profile has been created successfully. You can now start
            browsing gigs on Alumable.
          </p>
          <Button
            variant="filled"
            onClick={() => navigate('/login')}
            className="min-h-[44px]"
          >
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
        Student Onboarding
      </h1>
      <p className="text-sm text-m3-on-surface-variant text-center mb-6">
        Set up your student profile on Alumable
      </p>

      {/* Stepper */}
      <M3Stepper steps={STEPPER_STEPS} current={step} className="mb-6" />

      {/* Step content */}
      {step === 1 && (
        <AccountSetup data={data} patch={patch} onNext={goNext} />
      )}
      {step === 2 && (
        <ProfileInfo data={data} patch={patch} onNext={goNext} onBack={goBack} />
      )}
      {step === 3 && (
        <SkillsInterests data={data} patch={patch} onNext={goNext} onBack={goBack} />
      )}
      {step === 4 && (
        <Availability data={data} patch={patch} onNext={goNext} onBack={goBack} />
      )}
      {step === 5 && (
        <ReviewSubmit
          data={data}
          patch={patch}
          onBack={goBack}
          onGoToStep={goToStep}
          onSubmitSuccess={() => setSuccess(true)}
        />
      )}
    </div>
  )
}
