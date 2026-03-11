import { useState, useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MOCK_GIGS, type StudentGig, type SortOption, type LocationFilter } from './types'
import FilterBar from './FilterBar'
import GigCard from './GigCard'

export default function EarnPage() {
  const [loading, setLoading] = useState(true)
  const [gigs, setGigs] = useState<StudentGig[]>([])

  // Filters
  const [locationFilter, setLocationFilter] = useState<LocationFilter | null>(null)
  const [capabilityFilters, setCapabilityFilters] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<SortOption>('newest')

  const headingRef = useRef<HTMLHeadingElement>(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setGigs(MOCK_GIGS)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Focus heading on load
  useEffect(() => {
    if (!loading) {
      headingRef.current?.focus()
    }
  }, [loading])

  function clearAllFilters() {
    setLocationFilter(null)
    setCapabilityFilters([])
  }

  // Filter and sort gigs
  const filteredGigs = useMemo(() => {
    let result = [...gigs]

    // Location filter (single-select)
    if (locationFilter) {
      result = result.filter(g => g.locationType === locationFilter)
    }

    // Capability filters (AND logic — gig must have ALL selected capabilities)
    if (capabilityFilters.length > 0) {
      result = result.filter(g =>
        capabilityFilters.every(cap => g.capabilities.includes(cap))
      )
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
        break
      case 'highest-pay':
        result.sort((a, b) => b.studentPayment - a.studentPayment)
        break
      case 'deadline':
        result.sort(
          (a, b) =>
            new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime()
        )
        break
    }

    return result
  }, [gigs, locationFilter, capabilityFilters, sortOption])

  return (
    <div className="px-4 md:px-6 lg:px-6 py-4 md:py-6 lg:py-8 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[var(--text-lg)] font-bold text-m3-on-surface"
        >
          Alumable
        </h1>
        <p className="text-[var(--text-sm)] text-m3-on-surface-variant">
          Find your next gig
        </p>
      </div>

      {/* Filters */}
      {!loading && (
        <div className="mb-4">
          <FilterBar
            locationFilter={locationFilter}
            onLocationFilterChange={setLocationFilter}
            capabilityFilters={capabilityFilters}
            onCapabilityFiltersChange={setCapabilityFilters}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        </div>
      )}

      {/* Gig count */}
      {!loading && filteredGigs.length > 0 && (
        <p className="text-[var(--text-xs)] text-m3-on-surface-variant mb-3">
          {filteredGigs.length} gig{filteredGigs.length !== 1 ? 's' : ''} available
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-m3-md border border-m3-outline-variant p-4 animate-pulse"
            >
              <div className="h-5 w-2/3 bg-m3-surface-container-highest rounded mb-3" />
              <div className="h-3 w-1/3 bg-m3-surface-container-highest rounded mb-4" />
              <div className="h-3 w-full bg-m3-surface-container-highest rounded mb-2" />
              <div className="h-3 w-3/4 bg-m3-surface-container-highest rounded mb-4" />
              <div className="flex gap-2 mb-3">
                <div className="h-8 w-24 bg-m3-surface-container-highest rounded" />
                <div className="h-8 w-24 bg-m3-surface-container-highest rounded" />
              </div>
              <div className="h-3 w-1/2 bg-m3-surface-container-highest rounded" />
            </div>
          ))}
          <div className="flex justify-center mt-4">
            <Progress variant="circular" indeterminate />
          </div>
        </div>
      )}

      {/* Empty state (no gigs at all) */}
      {!loading && gigs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-m3-full bg-m3-surface-container-highest flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-[var(--text-base)] text-m3-on-surface-variant">
            No gigs available right now. Check back soon!
          </p>
        </div>
      )}

      {/* Filtered empty state */}
      {!loading && gigs.length > 0 && filteredGigs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[var(--text-base)] text-m3-on-surface-variant">
            No gigs match your filters.
          </p>
          <Button
            variant="text"
            className="mt-3 min-h-[44px]"
            onClick={clearAllFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Gig list */}
      {!loading && filteredGigs.length > 0 && (
        <div className="flex flex-col gap-3 md:gap-4">
          {filteredGigs.map(gig => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  )
}
