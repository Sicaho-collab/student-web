import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button, Chip, Progress } from '@sicaho-collab/ui-web'
import { cn } from '@/lib/utils'
import { MOCK_GIGS, type StudentGig } from './types'
import ApplyForm from './ApplyForm'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function postedAgo(iso: string): string {
  const now = new Date()
  const posted = new Date(iso)
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Posted today'
  if (diffDays === 1) return 'Posted 1 day ago'
  return `Posted ${diffDays} days ago`
}

function businessDaysBetween(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  let count = 0
  const current = new Date(s)
  while (current <= e) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) count++
    current.setDate(current.getDate() + 1)
  }
  return count
}

const LOCATION_LABELS: Record<string, string> = {
  remote: 'Remote',
  'on-site': 'On-Site',
  hybrid: 'Hybrid',
}

function KeyValueRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn('flex justify-between py-2', className)}>
      <span className="text-[var(--text-sm)] text-m3-on-surface-variant">{label}</span>
      <span className="text-[var(--text-sm)] font-medium text-m3-on-surface">{value}</span>
    </div>
  )
}

export default function GigDetailPage() {
  const { gigId } = useParams<{ gigId: string }>()
  const navigate = useNavigate()
  const backButtonRef = useRef<HTMLButtonElement>(null)

  const [loading, setLoading] = useState(true)
  const [gig, setGig] = useState<StudentGig | null>(null)
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const found = MOCK_GIGS.find(g => g.id === gigId) ?? null
      setGig(found)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [gigId])

  // Focus back button on load
  useEffect(() => {
    if (!loading && gig) {
      backButtonRef.current?.focus()
    }
  }, [loading, gig])

  const applyFormRef = useRef<HTMLDivElement>(null)

  function handleApplyNow() {
    setShowApplyForm(true)
    // Scroll to form after state update
    setTimeout(() => {
      applyFormRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Check if deadline has passed
  const deadlinePassed = gig ? new Date(gig.applicationDeadline) < new Date() : false

  if (loading) {
    return (
      <div className="px-4 md:px-6 py-6 md:py-8 max-w-[720px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-m3-full bg-m3-surface-container-highest animate-pulse" />
          <div className="h-5 w-24 rounded bg-m3-surface-container-highest animate-pulse" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-7 w-3/4 rounded bg-m3-surface-container-highest animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-m3-surface-container-highest animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-m3-surface-container-highest animate-pulse" />
          <hr className="border-m3-outline-variant" />
          <div className="h-5 w-24 rounded bg-m3-surface-container-highest animate-pulse" />
          <div className="h-20 w-full rounded bg-m3-surface-container-highest animate-pulse" />
          <hr className="border-m3-outline-variant" />
          <div className="h-5 w-24 rounded bg-m3-surface-container-highest animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-28 rounded bg-m3-surface-container-highest animate-pulse" />
            <div className="h-8 w-28 rounded bg-m3-surface-container-highest animate-pulse" />
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <Progress variant="circular" indeterminate />
        </div>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="px-4 md:px-6 py-6 md:py-8 max-w-[720px] mx-auto text-center">
        <p className="text-[var(--text-base)] text-m3-on-surface-variant mt-12">
          This gig is no longer available.
        </p>
        <Button variant="outlined" className="mt-4" onClick={() => navigate('/earn')}>
          Back to Gigs
        </Button>
      </div>
    )
  }

  const duration = businessDaysBetween(gig.startDate, gig.endDate)

  return (
    <div className="px-4 md:px-6 py-4 md:py-8 max-w-[720px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          ref={backButtonRef}
          variant="ghost"
          size="icon"
          onClick={() => navigate('/earn')}
          aria-label="Back to gig listings"
          className="min-h-[44px] min-w-[44px]"
        >
          <ChevronLeft size={24} />
        </Button>
        <span className="text-[var(--text-base)] font-semibold text-m3-on-surface">
          Gig Details
        </span>
      </div>

      {/* Title block */}
      <section className="mb-4">
        <h1 className="text-[var(--text-xl)] font-bold text-m3-on-surface">
          {gig.title}
        </h1>
        <p className="text-[var(--text-sm)] text-m3-on-surface-variant mt-1">
          {gig.employerName}
        </p>
        <p className="text-[var(--text-xs)] text-m3-on-surface-variant mt-0.5">
          {postedAgo(gig.postedAt)}
        </p>
      </section>

      <hr className="border-m3-outline-variant mb-4" />

      {/* Description */}
      <section className="mb-4">
        <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface mb-2">
          Description
        </h2>
        <p className="text-[var(--text-sm)] text-m3-on-surface-variant whitespace-pre-wrap">
          {gig.description}
        </p>
      </section>

      <hr className="border-m3-outline-variant mb-4" />

      {/* Capabilities */}
      {gig.capabilities.length > 0 && (
        <>
          <section className="mb-4">
            <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface mb-2">
              Capabilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {gig.capabilities.map(cap => (
                <Chip key={cap} variant="assist">
                  {cap}
                </Chip>
              ))}
            </div>
          </section>
          <hr className="border-m3-outline-variant mb-4" />
        </>
      )}

      {/* Timeline */}
      <section className="mb-4">
        <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface mb-2">
          Timeline
        </h2>
        <KeyValueRow
          label="Start Date"
          value={`${formatDate(gig.startDate)}${gig.flexibleStart ? ' (flexible)' : ''}`}
        />
        <KeyValueRow
          label="End Date"
          value={`${formatDate(gig.endDate)}${gig.flexibleEnd ? ' (flexible)' : ''}`}
        />
        <KeyValueRow label="Duration" value={`${duration} business days`} />
        {gig.scheduleNotes && (
          <div className="pt-2">
            <span className="text-[var(--text-sm)] text-m3-on-surface-variant">Schedule Notes</span>
            <p className="text-[var(--text-sm)] font-medium text-m3-on-surface mt-0.5">
              {gig.scheduleNotes}
            </p>
          </div>
        )}
      </section>

      <hr className="border-m3-outline-variant mb-4" />

      {/* Pay & Hours */}
      <section className="mb-4">
        <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface mb-2">
          Pay &amp; Hours
        </h2>
        <KeyValueRow label="Student Payment" value={`$${gig.studentPayment.toFixed(2)}`} />
        <KeyValueRow label="Estimated Hours" value={`${gig.estimatedHours} hours`} />
        <KeyValueRow label="Max Hours" value={`Up to ${gig.maxHours} hours`} />
      </section>

      <hr className="border-m3-outline-variant mb-4" />

      {/* Location */}
      <section className="mb-4">
        <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface mb-2">
          Location
        </h2>
        <KeyValueRow label="Type" value={LOCATION_LABELS[gig.locationType] || 'Not specified'} />
        {(gig.locationType === 'on-site' || gig.locationType === 'hybrid') &&
          gig.locationDetails && (
            <KeyValueRow label="Details" value={gig.locationDetails} />
          )}
      </section>

      <hr className="border-m3-outline-variant mb-4" />

      {/* Application Deadline */}
      <section className="mb-4">
        <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface mb-2">
          Application Deadline
        </h2>
        <p
          className={cn(
            'text-[var(--text-sm)] font-medium',
            deadlinePassed ? 'text-m3-error' : 'text-m3-primary'
          )}
        >
          {deadlinePassed ? 'Applications closed' : `Apply by ${formatDate(gig.applicationDeadline)}`}
        </p>
      </section>

      {/* Additional Notes */}
      {gig.additionalNotes && (
        <>
          <hr className="border-m3-outline-variant mb-4" />
          <section className="mb-4">
            <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface mb-2">
              Additional Notes
            </h2>
            <p className="text-[var(--text-sm)] text-m3-on-surface-variant">
              {gig.additionalNotes}
            </p>
          </section>
        </>
      )}

      <hr className="border-m3-outline-variant mb-6" />

      {/* Apply section */}
      <div ref={applyFormRef}>
        {showApplyForm ? (
          <ApplyForm gig={gig} />
        ) : (
          <div className="sticky bottom-0 bg-m3-surface py-3 px-4 -mx-4 md:-mx-6 md:px-6 border-t border-m3-outline-variant">
            <Button
              variant="filled"
              size="lg"
              className="w-full min-h-[44px]"
              onClick={handleApplyNow}
              disabled={deadlinePassed}
            >
              {deadlinePassed ? 'Applications Closed' : 'Apply Now'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
