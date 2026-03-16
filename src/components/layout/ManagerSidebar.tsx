'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, UtensilsCrossed, Banknote, Users2, Settings } from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/manager', icon: LayoutDashboard },
  { label: 'Transactions', href: '/manager/transactions', icon: Receipt },
  { label: 'Menu & Stock', href: '/manager/menu', icon: UtensilsCrossed },
  { label: 'Cash Oversight', href: '/manager/cash', icon: Banknote },
  { label: 'Staff', href: '/manager/staff', icon: Users2 },
  { label: 'Settings', href: '/manager/settings', icon: Settings },
]

export function ManagerSidebar({ expanded = false, onToggle }: { expanded?: boolean; onToggle?: () => void }) {
  const pathname = usePathname()
  return (
    <aside
      className={`fixed left-3 top-20 bottom-6 z-40 bg-white transition-all duration-300 ease-in-out shadow-2xl rounded-3xl overflow-hidden flex flex-col ${
        expanded ? 'w-64' : 'w-20'
      }`}
      aria-expanded={expanded}
    >
      <nav className="flex-1 flex flex-col gap-2 px-3 py-3 overflow-y-auto overflow-x-hidden">
        {nav.map(({ label, href, icon: Icon }, idx) => {
          const isRootItem = href.split('/').filter(Boolean).length === 1
          const active = pathname === href || (!isRootItem && pathname.startsWith(`${href}/`))
          return (
            <Link key={href} href={href} 
              className={`group relative flex items-center h-14 w-full rounded-2xl transition-all duration-200 ${
                active ? 'bg-black/5' : 'hover:bg-black/5'
              }`}
            >
              <span
                className={`absolute left-0 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3b221d] text-cream ring-1 ring-black/20 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all z-10 ${
                  active ? 'ring-2 ring-[color:var(--color-caramel)] scale-105' : 'group-hover:scale-105'
                }`}
              >
                <Icon size={18} />
              </span>
              
              <span 
                className={`ml-16 whitespace-nowrap text-sm font-medium transition-opacity duration-300 font-sans ${
                  expanded ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'
                } ${active ? 'text-black font-semibold' : 'text-black/70 group-hover:text-black'}`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
