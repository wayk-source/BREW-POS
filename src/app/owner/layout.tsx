'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { OwnerSidebar } from '../../components/layout/OwnerSidebar'
import { OwnerTopbar } from '../../components/layout/OwnerTopbar'
import { useLocalStorageState } from '../../lib/useLocalStorageState'

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useLocalStorageState<boolean>('sidebar.owner.expanded', false)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const isLogin = pathname === '/owner/login'

  useEffect(() => {
    // Check authentication
    async function checkAuth() {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          // Not authenticated - redirect to login if not already there
          if (!isLogin) {
            router.push('/owner/login')
          }
          setLoading(false)
          return
        }

        // Check if user is an owner
        const metadata = user.user_metadata as any
        if (metadata?.role !== 'owner') {
          // Not an owner - redirect to appropriate dashboard
          if (metadata?.role === 'manager') {
            router.push('/manager')
          } else if (metadata?.role === 'cashier') {
            router.push('/cashier')
          } else {
            router.push('/login')
          }
          setLoading(false)
          return
        }

        setAuthenticated(true)
        setLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        if (!isLogin) {
          router.push('/owner/login')
        }
        setLoading(false)
      }
    }

    checkAuth()
  }, [isLogin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--color-cream)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee mx-auto mb-4"></div>
          <p className="text-coffee/70">Loading...</p>
        </div>
      </div>
    )
  }

  if (isLogin) {
    return <main className="min-h-screen">{children}</main>
  }

  if (!authenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="flex min-h-screen bg-[color:var(--color-cream)]">
      <OwnerSidebar expanded={expanded} onToggle={() => setExpanded(v => !v)} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <OwnerTopbar expanded={expanded} onToggle={() => setExpanded(v => !v)} />
        <main className="flex-1 overflow-auto pl-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
