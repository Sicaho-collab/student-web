import { useState, useRef, useEffect, useCallback } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Button } from '@sicaho-collab/m3-design-system'

const NAV_ITEMS = [
  { to: '/earn',         label: 'Earn'         },
  { to: '/applications', label: 'Applications' },
  { to: '/profile',      label: 'Profile'      },
] as const

export default function StudentLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Close on click outside
  useEffect(() => {
    if (!menuOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [menuOpen, closeMenu])

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen, closeMenu])

  const handleSignOut = () => {
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-m3-surface">
      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-40 h-[60px] bg-m3-surface border-b border-m3-outline-variant flex items-center px-4 md:px-6 gap-4 md:gap-8">
        {/* Brand */}
        <img
          src={`${import.meta.env.BASE_URL}alumable-horizontal.png`}
          alt="Alumable"
          className="h-8 shrink-0"
        />

        {/* Module Links */}
        <nav className="flex items-center gap-1 flex-1 overflow-x-auto whitespace-nowrap">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'px-3 md:px-4 py-2 rounded-m3-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-m3-secondary-container text-m3-on-secondary-container shadow-m3-1'
                    : 'text-m3-on-surface-variant hover:bg-m3-on-surface/8 hover:scale-[1.02] active:scale-[0.98]'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            ref={triggerRef}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label="User menu"
            className="w-9 h-9 rounded-full bg-m3-primary flex items-center justify-center text-m3-on-primary text-sm font-bold cursor-pointer transition-shadow hover:shadow-m3-1"
          >
            ST
          </button>

          {menuOpen && (
            <Card
              variant="elevated"
              role="menu"
              className="absolute right-0 top-full mt-2 w-[240px] z-50"
            >
              <div className="p-4 flex flex-col gap-1">
                <p className="text-sm font-medium text-m3-on-surface">Student User</p>
                <p className="text-xs text-m3-on-surface-variant">student@example.com</p>
              </div>
              <hr className="border-m3-outline-variant" />
              <div className="p-2">
                <Button
                  variant="text"
                  size="sm"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </div>
            </Card>
          )}
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
