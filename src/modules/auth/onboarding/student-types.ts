export interface StudentOnboardingData {
  // Step 1: Account Setup
  fullName: string
  email: string
  password: string
  confirmPassword: string

  // Step 2: Profile
  university: string
  fieldOfStudy: string
  yearOfStudy: YearOfStudy | ''
  bio: string

  // Step 3: Skills & Interests
  skills: string[]
  interests: string[]

  // Step 4: Availability
  availableHours: string
  earliestStartDate: string
  preferredContact: string[]
  phoneNumber: string

  // Step 5: Review & Submit
  termsAccepted: boolean
}

export type YearOfStudy =
  | 'Freshman'
  | 'Sophomore'
  | 'Junior'
  | 'Senior'
  | 'Graduate'
  | 'Other'

export const YEAR_OPTIONS: YearOfStudy[] = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Graduate',
  'Other',
]

export const SKILLS_LIST = [
  'Writing',
  'Design',
  'Marketing',
  'Data Entry',
  'Research',
  'Social Media',
  'Photography',
  'Video Editing',
  'Web Development',
  'Customer Service',
  'Tutoring',
  'Event Planning',
] as const

export const INTERESTS_LIST = [
  'Part-time',
  'Remote',
  'On-campus',
  'Freelance',
  'Internship',
] as const

export const HOURS_OPTIONS = [
  '< 10 hrs',
  '10–20 hrs',
  '20–30 hrs',
  '30+ hrs',
] as const

export const CONTACT_METHODS = ['Email', 'Phone', 'In-App'] as const

export const STEPPER_STEPS = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Skills' },
  { label: 'Availability' },
  { label: 'Review' },
]

export function createInitialData(): StudentOnboardingData {
  return {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    fieldOfStudy: '',
    yearOfStudy: '',
    bio: '',
    skills: [],
    interests: [],
    availableHours: '',
    earliestStartDate: '',
    preferredContact: [],
    phoneNumber: '',
    termsAccepted: false,
  }
}
