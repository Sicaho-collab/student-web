import { useNavigate } from 'react-router-dom'
import { Info } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@sicaho-collab/m3-design-system'
import type { StudentGig } from './types'

interface GigCardProps {
  gig: StudentGig
}

const CAPABILITY_COLORS: Record<string, string> = {
  'Analytical & Data Thinking': 'bg-blue-100 text-blue-800',
  'Communication': 'bg-amber-100 text-amber-800',
  'Digital & Technical': 'bg-violet-100 text-violet-800',
  'Project & Execution': 'bg-emerald-100 text-emerald-800',
  'Collaboration': 'bg-pink-100 text-pink-800',
  'Creative Thinking': 'bg-orange-100 text-orange-800',
  'Business Insight': 'bg-cyan-100 text-cyan-800',
  'Leadership': 'bg-rose-100 text-rose-800',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const month = months[d.getMonth()]
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
      <CardHeader>
        <h3 className="text-[var(--text-base)] font-semibold text-m3-on-surface">
          {gig.title}
        </h3>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Capability tags */}
        {gig.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {gig.capabilities.map(cap => (
              <span
                key={cap}
                className={`inline-flex items-center rounded-m3-sm text-[var(--text-xs)] font-medium px-3 py-1 ${CAPABILITY_COLORS[cap] || 'bg-gray-100 text-gray-800'}`}
              >
                {cap}
              </span>
            ))}
          </div>
        )}

        {/* Date range */}
        <p className="text-[var(--text-sm)] text-m3-on-surface-variant">
          {formatDate(gig.startDate)} &ndash; {formatDate(gig.endDate)}
        </p>

        {/* Earnings with hover tooltip */}
        <p className="text-[var(--text-sm)] font-semibold text-m3-on-surface inline-flex items-center gap-1">
          You will earn: ${gig.studentPayment.toFixed(2)} (incl. super)
          <span
            className="relative inline-flex group"
            onClick={e => e.stopPropagation()}
          >
            <Info size={14} className="text-m3-on-surface-variant/70 cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 rounded-m3-sm bg-m3-on-surface text-m3-surface text-[var(--text-xs)] font-normal whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              Estimated gross earnings subject to fees and taxes
            </span>
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
