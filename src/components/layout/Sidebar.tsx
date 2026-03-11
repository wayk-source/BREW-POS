 'use client'
 
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, CreditCard, Users2, FileBarChart2, Settings } from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Businesses', href: '/admin/businesses', icon: Building2 },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Users', href: '/admin/users', icon: Users2 },
  { label: 'Reports', href: '/admin/reports', icon: FileBarChart2 },
  { label: 'System Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-72 shrink-0 min-h-screen bg-gradient-to-b from-[color:var(--color-coffee)] to-[#241312] text-cream flex flex-col border-r border-white/10">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center font-semibold bg-[color:var(--color-caramel)] text-[color:var(--color-coffee)] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            B
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-wide">BREW POS</div>
            <div className="text-xs text-cream/70">System Admin</div>
          </div>
        </div>
      </div>

      <nav className="px-3 pb-4 space-y-1 flex-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link key={href} href={href} className={`sidebar-link ${active ? 'active' : ''}`}>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Icon size={18} />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-sm font-semibold">
            SA
          </div>
          <div>
            <div className="text-sm font-medium">System Admin</div>
            <div className="text-xs text-cream/70">admin@brewpos.com</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
