export interface StudentGig {
  id: string
  title: string
  description: string
  employerName: string
  capabilities: string[]
  startDate: string
  endDate: string
  flexibleStart: boolean
  flexibleEnd: boolean
  scheduleNotes: string
  studentPayment: number
  maxHours: number
  estimatedHours: string
  locationType: 'remote' | 'on-site' | 'hybrid'
  locationDetails: string
  applicationDeadline: string
  additionalNotes: string
  postedAt: string
  stage: 'POSTED'
}

export interface GigApplication {
  gigId: string
  message: string
  availabilityConfirmed: boolean
}

export type SortOption = 'newest' | 'highest-pay' | 'deadline'

export type LocationFilter = 'remote' | 'on-site' | 'hybrid'

/**
 * Capability options matching employer Step1Details CAPABILITY_OPTIONS.
 */
export const CAPABILITY_OPTIONS = [
  'Analytical & Data Thinking',
  'Communication',
  'Digital & Technical',
  'Project & Execution',
  'Collaboration',
  'Creative Thinking',
  'Business Insight',
  'Leadership',
] as const

/**
 * Budget derivation matching employer Step3Budget.tsx logic:
 *   platformFee = budget * 0.12
 *   processingFee = budget * 0.017
 *   gst = (platformFee + processingFee) * 0.10
 *   studentPayment = budget - platformFee - processingFee - gst
 *   maxHours = ceil(studentPayment / 1.12 / 32)
 */
function deriveFromBudget(budget: number): { studentPayment: number; maxHours: number } {
  const platformFee = budget * 0.12
  const processingFee = budget * 0.017
  const gst = (platformFee + processingFee) * 0.10
  const studentPayment = budget - platformFee - processingFee - gst
  const maxHours = Math.ceil(studentPayment / 1.12 / 32)
  return { studentPayment: Math.round(studentPayment * 100) / 100, maxHours }
}

const gig1Budget = deriveFromBudget(550)
const gig2Budget = deriveFromBudget(460)
const gig3Budget = deriveFromBudget(370)
const gig4Budget = deriveFromBudget(730)
const gig5Budget = deriveFromBudget(640)
const gig6Budget = deriveFromBudget(280)

export const MOCK_GIGS: StudentGig[] = [
  {
    id: 'gig-001',
    title: 'Social Media Content Creator',
    description:
      'Create engaging social media content for our campus recruitment campaign. You\'ll design posts for Instagram, LinkedIn, and TikTok that showcase student life and career opportunities at Acme Corp. Must be comfortable with graphic design tools and have a strong sense of visual storytelling.',
    employerName: 'Acme Corp',
    capabilities: ['Communication', 'Creative Thinking'],
    locationType: 'remote',
    locationDetails: '',
    startDate: '2026-03-20',
    endDate: '2026-04-10',
    flexibleStart: true,
    flexibleEnd: false,
    scheduleNotes: 'Prefer weekday availability, but some weekend work may be needed for event coverage.',
    studentPayment: gig1Budget.studentPayment,
    maxHours: gig1Budget.maxHours,
    estimatedHours: '15',
    applicationDeadline: '2026-03-17',
    additionalNotes:
      'Please have a portfolio of previous social media work ready to share.',
    postedAt: '2026-03-08',
    stage: 'POSTED',
  },
  {
    id: 'gig-002',
    title: 'Data Analysis Assistant',
    description:
      'Help our team analyze student survey data and create visualizations for an upcoming board presentation. You will work with Excel and Python to clean, transform, and visualize data sets. Experience with pandas and matplotlib is a plus.',
    employerName: 'TechStart Inc',
    capabilities: ['Analytical & Data Thinking', 'Digital & Technical'],
    locationType: 'on-site',
    locationDetails: 'TechStart Inc Office, 42 Innovation Drive, Melbourne VIC 3000',
    startDate: '2026-03-25',
    endDate: '2026-04-15',
    flexibleStart: false,
    flexibleEnd: true,
    scheduleNotes: '',
    studentPayment: gig2Budget.studentPayment,
    maxHours: gig2Budget.maxHours,
    estimatedHours: '12',
    applicationDeadline: '2026-03-22',
    additionalNotes: '',
    postedAt: '2026-03-05',
    stage: 'POSTED',
  },
  {
    id: 'gig-003',
    title: 'Event Setup Coordinator',
    description:
      'Coordinate the setup and logistics for a series of campus career fairs. Tasks include liaising with vendors, managing setup timelines, and ensuring the event space is ready. Strong organizational skills required.',
    employerName: 'Campus Events Co',
    capabilities: ['Project & Execution', 'Collaboration'],
    locationType: 'on-site',
    locationDetails: 'University Main Hall, Building 5, Clayton Campus',
    startDate: '2026-03-15',
    endDate: '2026-03-28',
    flexibleStart: false,
    flexibleEnd: false,
    scheduleNotes: 'Must be available for full setup days including early mornings.',
    studentPayment: gig3Budget.studentPayment,
    maxHours: gig3Budget.maxHours,
    estimatedHours: '10',
    applicationDeadline: '2026-03-12',
    additionalNotes: 'Must be available on weekends for event days.',
    postedAt: '2026-03-03',
    stage: 'POSTED',
  },
  {
    id: 'gig-004',
    title: 'Research Literature Review',
    description:
      'Conduct a literature review on sustainable energy solutions for a university research project. You will search academic databases, summarize key findings, and compile an annotated bibliography. Familiarity with academic writing conventions expected.',
    employerName: 'University Lab',
    capabilities: ['Analytical & Data Thinking', 'Communication'],
    locationType: 'remote',
    locationDetails: '',
    startDate: '2026-04-01',
    endDate: '2026-04-25',
    flexibleStart: true,
    flexibleEnd: true,
    scheduleNotes: 'Flexible schedule — work at your own pace as long as milestones are met.',
    studentPayment: gig4Budget.studentPayment,
    maxHours: gig4Budget.maxHours,
    estimatedHours: '20',
    applicationDeadline: '2026-03-28',
    additionalNotes:
      'Access to university library databases will be provided.',
    postedAt: '2026-03-07',
    stage: 'POSTED',
  },
  {
    id: 'gig-005',
    title: 'Website Redesign Assistant',
    description:
      'Assist with redesigning our cafe website to improve user experience and mobile responsiveness. You will work on layout updates, image optimization, and basic SEO improvements using WordPress and CSS. A keen eye for design is essential.',
    employerName: 'Local Cafe',
    capabilities: ['Digital & Technical', 'Creative Thinking'],
    locationType: 'hybrid',
    locationDetails: 'Local Cafe, 88 Chapel Street, South Yarra VIC 3141 (2 days on-site)',
    startDate: '2026-03-22',
    endDate: '2026-04-12',
    flexibleStart: false,
    flexibleEnd: false,
    scheduleNotes: '',
    studentPayment: gig5Budget.studentPayment,
    maxHours: gig5Budget.maxHours,
    estimatedHours: '18',
    applicationDeadline: '2026-03-19',
    additionalNotes: '',
    postedAt: '2026-03-06',
    stage: 'POSTED',
  },
  {
    id: 'gig-006',
    title: 'Business Plan Review',
    description:
      'Review and provide feedback on business plans submitted by early-stage startups. You will assess market analysis sections, financial projections, and overall plan structure. Background in business or economics preferred.',
    employerName: 'Startup Hub',
    capabilities: ['Business Insight', 'Communication'],
    locationType: 'remote',
    locationDetails: '',
    startDate: '2026-03-18',
    endDate: '2026-04-02',
    flexibleStart: true,
    flexibleEnd: false,
    scheduleNotes: 'Reviews must be completed within 48 hours of assignment.',
    studentPayment: gig6Budget.studentPayment,
    maxHours: gig6Budget.maxHours,
    estimatedHours: '8',
    applicationDeadline: '2026-03-15',
    additionalNotes: '',
    postedAt: '2026-03-04',
    stage: 'POSTED',
  },
]
