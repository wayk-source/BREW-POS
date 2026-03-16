'use client'

import { usePathname } from 'next/navigation'
import { ManagerSidebar } from '../../components/layout/ManagerSidebar'
import { ManagerTopbar } from '../../components/layout/ManagerTopbar'
import { useLocalStorageState } from '../../lib/useLocalStorageState'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useLocalStorageState<boolean>('sidebar.manager.expanded', false)
  const isLogin = pathname === '/manager/login'
  if (isLogin) {
    return <main className="min-h-screen">{children}</main>
  }
  return (
    <div className="flex min-h-screen bg-[color:var(--color-cream)]">
      <ManagerSidebar expanded={expanded} onToggle={() => setExpanded(v => !v)} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <ManagerTopbar expanded={expanded} onToggle={() => setExpanded(v => !v)} />
        <main className="flex-1 overflow-auto pl-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
