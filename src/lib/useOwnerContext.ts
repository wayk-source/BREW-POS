'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface OwnerContext {
  businessId: string | null
  businessName: string | null
  ownerEmail: string | null
  ownerName: string | null
  loading: boolean
  error: string | null
}

/**
 * Hook to get current owner's business context
 * This ensures each owner portal is isolated to their business
 */
export function useOwnerContext(): OwnerContext {
  const [context, setContext] = useState<OwnerContext>({
    businessId: null,
    businessName: null,
    ownerEmail: null,
    ownerName: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function loadOwnerContext() {
      try {
        const supabase = createClient()
        
        // Get current user session
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          setContext(prev => ({
            ...prev,
            loading: false,
            error: 'Not authenticated',
          }))
          return
        }

        // Get business info from auth metadata
        const metadata = user.user_metadata as any
        const businessId = metadata?.businessId
        const ownerName = metadata?.name
        const ownerEmail = user.email

        if (!businessId) {
          setContext(prev => ({
            ...prev,
            loading: false,
            error: 'No business associated with this account',
          }))
          return
        }

        // Fetch business details to confirm ownership and get business name
        const { data: businessData, error: businessError } = await supabase
          .from('business_name')
          .select('id, name')
          .eq('id', businessId)
          .single()

        if (businessError || !businessData) {
          setContext(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load business information',
          }))
          return
        }

        setContext({
          businessId: businessData.id.toString(),
          businessName: businessData.name,
          ownerEmail: ownerEmail || null,
          ownerName: ownerName || null,
          loading: false,
          error: null,
        })
      } catch (err) {
        console.error('Error loading owner context:', err)
        setContext(prev => ({
          ...prev,
          loading: false,
          error: 'Error loading context',
        }))
      }
    }

    loadOwnerContext()
  }, [])

  return context
}
