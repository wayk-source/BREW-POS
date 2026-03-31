import { Bell, Search, Menu, User, LogOut, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { BrewPosLogo } from '../ui/BrewPosLogo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

export function OwnerTopbar({ expanded, onToggle }: { expanded?: boolean; onToggle?: () => void }) {
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const today = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur">
      <div className="w-full pl-3 pr-3 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-20 shrink-0">
            <button
              aria-label="Toggle sidebar"
              onClick={onToggle}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-coffee/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              title={expanded ? 'Collapse' : 'Expand'}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <BrewPosLogo />
          </div>
          <div className="flex-1" />

          <button
            aria-label="Notifications"
            className="relative h-11 w-11 inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-coffee/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 inline-block h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="hidden sm:block text-sm text-coffee/70 mr-2">{today}</div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-11 w-11 rounded-2xl bg-[#3b221d] text-cream flex items-center justify-center hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            >
              <User className="h-5 w-5" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/5 p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-3 py-2 border-b border-black/5 mb-1">
                  <p className="text-sm font-semibold text-coffee">Business Owner</p>
                  <p className="text-xs text-coffee/60">owner@brewpos.com</p>
                </div>
                
                <Link 
                  href="/owner/settings" 
                  className="flex items-center gap-2 px-3 py-2 text-sm text-coffee/80 hover:bg-black/5 rounded-xl transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
                
                <button
                  onClick={async () => {
                    await logout()
                    router.push('/login')
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
