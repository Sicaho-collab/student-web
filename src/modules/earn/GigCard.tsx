import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Calendar } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { cn } from '@/lib/utils'
import type { StudentGig } from './types'

interface GigCardProps {
  gig: StudentGig
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

function postedAgo(iso: string): string {
  const now = new Date()
  const posted = new Date(iso)
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Posted today'
  if (diffDays === 1) return 'Posted 1d ago'
  return `Posted ${diffDays}d ago`
}

const LOCATION_STYLES: Record<string, string> = {
  remote: 'bg-green-100 text-green-800 border-green-300',
  'on-site': 'bg-blue-100 text-blue-800 border-blue-300',
  hybrid: 'bg-purple-100 text-purple-800 border-purple-300',
}

const LOCATION_LABELS: Record<string, string> = {
  remote: 'Remote',
  'on-site': 'On-Site',
  hybrid: 'Hybrid',
}

export default function GigCard({ gig }: GigCardProps) {
  const navigate = useNavigate()
  const visibleCaps = gig.capabilities.slice(0, 3)
  const extraCount = gig.capabilities.length - 3

  return (
    <Card
      variant="outlined"
      className="cursor-pointer hover:shadow-m3-2 transition-shadow"
      onClick={() => navigate(`/earn/${gig.id}`)}
      role="article"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/earn/${gig.id}`)
        }
      }}
    >
      <CardHeader>
        <h3 className="text-[var(--text-base)] font-semibold text-m3-on-surface">
          {gig.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[var(--text-xs)] text-m3-on-surface-variant">
            {gig.employerName}
          </span>
          <span className="text-[var(--text-xs)] text-m3-on-surface-variant">
            {postedAgo(gig.postedAt)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Description snippet */}
        <p className="text-[var(--text-sm)] text-m3-on-surface-variant line-clamp-2">
          {gig.description}
        </p>

        {/* Capability chips */}
        {gig.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleCaps.map(cap => (
              <Chip key={cap} variant="assist" className="pointer-events-none">
                {cap}
              </Chip>
            ))}
            {extraCount > 0 && (
              <span className="inline-flex items-center text-[var(--text-xs)] text-m3-on-surface-variant font-medium">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        {/* Metadata row */}
        <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-4">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[var(--text-xs)] font-medium rounded-m3-sm border px-2 py-0.5 w-fit',
              LOCATION_STYLES[gig.locationType] || ''
            )}
          >
            <MapPin size={14} />
            {LOCATION_LABELS[gig.locationType] || 'Not specified'}
          </span>
          <span className="text-[var(--text-sm)] font-semibold text-m3-on-surface">
            ${gig.studentPayment.toFixed(2)}
          </span>
          <span className="inline-flex items-center gap-1 text-[var(--text-xs)] text-m3-on-surface-variant">
            <Clock size={14} />
            Up to {gig.maxHours} hrs
          </span>
        </div>

        {/* Dates row */}
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4 text-[var(--text-xs)] text-m3-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(gig.startDate)} &ndash; {formatDate(gig.endDate)}
            {(gig.flexibleStart || gig.flexibleEnd) && (
              <span className="text-m3-tertiary font-medium ml-1">Flexible</span>
            )}
          </span>
          <span className="font-medium text-m3-primary">
            Apply by {formatShortDate(gig.applicationDeadline)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
