import { createBrowserRouter, Navigate } from 'react-router-dom'

import StudentOnboardingPage from '@/modules/auth/onboarding/StudentOnboardingPage'

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { path: 'onboarding', element: <StudentOnboardingPage /> },
      { index: true, element: <Navigate to="/onboarding" replace /> },
      { path: '*', element: <Navigate to="/onboarding" replace /> },
    ],
  },
], { basename: '/student-web' })
