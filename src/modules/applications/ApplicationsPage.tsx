import { FileText } from 'lucide-react'

export default function ApplicationsPage() {
  return (
    <div className="px-4 md:px-6 py-6 md:py-8 max-w-[900px] mx-auto">
      <h1 className="text-[var(--text-lg)] font-bold text-m3-on-surface mb-8">
        Applications
      </h1>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText size={48} className="text-m3-on-surface-variant mb-4" />
        <p className="text-[var(--text-base)] font-medium text-m3-on-surface">
          Coming soon
        </p>
        <p className="text-[var(--text-sm)] text-m3-on-surface-variant mt-1">
          Track your gig applications here.
        </p>
      </div>
    </div>
  )
}
