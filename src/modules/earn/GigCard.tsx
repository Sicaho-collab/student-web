import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { StudentGig } from './types'

interface GigCardProps {
  gig: StudentGig
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = d.toLocaleString('en-AU', { month: 'short' })
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export default function GigCard({ gig }: GigCardProps) {
  const navigate = useNavigate()

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
      <CardContent className="flex flex-col gap-3 pt-4">
        {/* Gig title */}
        <h3 className="text-[var(--text-base)] font-semibold text-m3-on-surface">
          {gig.title}
        </h3>

        {/* Capability tags in accent colour */}
        {gig.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {gig.capabilities.map(cap => (
              <span
                key={cap}
                className="inline-flex items-center rounded-full bg-m3-tertiary-container text-m3-on-tertiary-container text-[var(--text-xs)] font-medium px-3 py-1"
              >
                {cap}
              </span>
            ))}
          </div>
        )}

        {/* Start–end date */}
        <span className="inline-flex items-center gap-1.5 text-[var(--text-sm)] text-m3-on-surface-variant">
          <Calendar size={16} />
          {formatDate(gig.startDate)} – {formatDate(gig.endDate)}
        </span>

        {/* Earnings */}
        <p className="text-[var(--text-sm)] font-semibold text-m3-on-surface">
          You will earn: ${gig.studentPayment.toFixed(2)}{' '}
          <span className="font-normal text-m3-on-surface-variant">(incl. super)</span>
        </p>

        {/* Disclaimer */}
        <p className="text-[var(--text-xs)] text-m3-on-surface-variant/70 italic">
          Estimated gross earnings subject to fees and taxes
        </p>
      </CardContent>
    </Card>
  )
}
