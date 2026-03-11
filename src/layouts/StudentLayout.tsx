import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, DollarSign, FileText, User } from 'lucide-react'
import { Card, Button, NavigationRail } from '@sicaho-collab/m3-design-system'
import type { NavRailItem } from '@sicaho-collab/m3-design-system'

const NAV_ITEMS: (NavRailItem & { to: string })[] = [
  { to: '/earn',         label: 'Earn',         icon: <DollarSign className="size-6" /> },
  { to: '/applications', label: 'Applications', icon: <FileText className="size-6" /> },
  { to: '/profile',      label: 'Profile',      icon: <User className="size-6" /> },
]

export default function StudentLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const activeIndex = useMemo(() => {
    const idx = NAV_ITEMS.findIndex(item => location.pathname.startsWith(item.to))
    return idx >= 0 ? idx : 0
  }, [location.pathname])

  const handleSelect = (index: number) => {
    navigate(NAV_ITEMS[index].to)
  }

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
    <div className="min-h-screen flex bg-m3-surface">
      {/* ── Left Sidebar: Brand Logo + NavigationRail ── */}
      {/* ── Left Sidebar: NavigationRail with logo ── */}
      <NavigationRail
        items={NAV_ITEMS}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        defaultExpanded={false}
        header={
          <img
            src={`${import.meta.env.BASE_URL}alumable-stacked.png`}
            alt="Alumable"
            className="h-10"
          />
        }
      />

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with user menu */}
        <header className="sticky top-0 z-40 h-[60px] bg-white border-b border-m3-outline-variant flex items-center justify-end px-4 md:px-6">
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
    </div>
  )
}
