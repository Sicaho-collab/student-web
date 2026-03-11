import { ArrowUpDown } from 'lucide-react'
import { Chip } from '@sicaho-collab/m3-design-system'
import { cn } from '@/lib/utils'
import { CAPABILITY_OPTIONS, type LocationFilter, type SortOption } from './types'

interface FilterBarProps {
  locationFilter: LocationFilter | null
  onLocationFilterChange: (filter: LocationFilter | null) => void
  capabilityFilters: string[]
  onCapabilityFiltersChange: (filters: string[]) => void
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
}

const LOCATION_OPTIONS: { value: LocationFilter; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'on-site', label: 'On-Site' },
  { value: 'hybrid', label: 'Hybrid' },
]

export default function FilterBar({
  locationFilter,
  onLocationFilterChange,
  capabilityFilters,
  onCapabilityFiltersChange,
  sortOption,
  onSortChange,
}: FilterBarProps) {
  function toggleLocation(value: LocationFilter) {
    onLocationFilterChange(locationFilter === value ? null : value)
  }

  function toggleCapability(cap: string) {
    if (capabilityFilters.includes(cap)) {
      onCapabilityFiltersChange(capabilityFilters.filter(c => c !== cap))
    } else {
      onCapabilityFiltersChange([...capabilityFilters, cap])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Sort control */}
      <div className="flex items-center justify-end gap-2">
        <ArrowUpDown size={16} className="text-m3-on-surface-variant" />
        <select
          value={sortOption}
          onChange={e => onSortChange(e.target.value as SortOption)}
          className={cn(
            'bg-transparent text-[var(--text-sm)] font-medium text-m3-on-surface',
            'border border-m3-outline rounded-m3-sm px-3 py-1.5 min-h-[44px]',
            'focus:outline-2 focus:outline-offset-2 focus:outline-m3-primary'
          )}
          aria-label="Sort gigs"
        >
          <option value="newest">Newest</option>
          <option value="highest-pay">Highest Pay</option>
          <option value="deadline">Deadline (Soonest)</option>
        </select>
      </div>

      {/* Location filter chips */}
      <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 md:flex-wrap md:overflow-visible" role="listbox" aria-label="Filter by location">
        {LOCATION_OPTIONS.map(({ value, label }) => (
          <Chip
            key={value}
            variant="filter"
            selected={locationFilter === value}
            onClick={() => toggleLocation(value)}
            className="shrink-0 cursor-pointer min-h-[44px]"
          >
            {label}
          </Chip>
        ))}
      </div>

      {/* Capability filter chips */}
      <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 md:flex-wrap md:overflow-visible" role="listbox" aria-label="Filter by capability">
        {CAPABILITY_OPTIONS.map(cap => (
          <Chip
            key={cap}
            variant="filter"
            selected={capabilityFilters.includes(cap)}
            onClick={() => toggleCapability(cap)}
            className="shrink-0 cursor-pointer min-h-[44px]"
          >
            {cap}
          </Chip>
        ))}
      </div>
    </div>
  )
}
