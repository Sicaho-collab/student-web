import { createBrowserRouter, Navigate } from 'react-router-dom'

import StudentOnboardingPage from '@/modules/auth/onboarding/StudentOnboardingPage'
import LoginPage from '@/modules/auth/onboarding/LoginPage'
import SignUpPage from '@/modules/auth/onboarding/SignUpPage'
import ForgotPasswordPage from '@/modules/auth/onboarding/ForgotPasswordPage'
import StudentLayout from '@/layouts/StudentLayout'
import EarnPage from '@/modules/earn/EarnPage'
import GigDetailPage from '@/modules/earn/GigDetailPage'
import ApplicationsPage from '@/modules/applications/ApplicationsPage'
import ProfilePage from '@/modules/profile/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      // Auth routes (no layout wrapper)
      { path: 'login', element: <LoginPage /> },
      { path: 'sign-up', element: <SignUpPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },

      // Standalone onboarding route (no layout wrapper)
      { path: 'onboarding', element: <StudentOnboardingPage /> },

      // Student app routes wrapped in StudentLayout (bottom nav)
      {
        element: <StudentLayout />,
        children: [
          { path: 'earn', element: <EarnPage /> },
          { path: 'earn/:gigId', element: <GigDetailPage /> },
          { path: 'applications', element: <ApplicationsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },

      // Default redirect
      { index: true, element: <Navigate to="/login" replace /> },
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
], { basename: '/student-web' })
