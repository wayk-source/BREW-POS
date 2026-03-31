import type { Role, User } from '../types'
import { createClient } from '@/utils/supabase/client'

/**
 * Authenticate user with email and password using Supabase Auth
 * Returns the user object if authentication succeeds, null otherwise
 */
export async function authenticate(email: string, password: string): Promise<User | null> {
  const normalizedEmail = email.toLowerCase().trim()

  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (error || !data.user) {
      console.error('Supabase authentication error:', error?.message || 'No user data')
      return null
    }

    // Get user metadata to determine role
    const metadata = data.user.user_metadata as {
      name?: string
      role?: string
      businessId?: number | string
      storeId?: number
    } || {}

    // Determine role from metadata
    let role: Role = 'cashier'
    if (metadata.role === 'owner' || metadata.role === 'manager' || metadata.role === 'admin') {
      role = metadata.role
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      name: metadata.name || data.user.email!.split('@')[0],
      role,
      businessId: metadata.businessId ? String(metadata.businessId) : undefined,
    }
  } catch (error) {
    console.error('Authentication exception:', error)
    return null
  }
}

/**
 * Sign up a new business owner
 * Calls server-side API endpoint that uses service role to bypass RLS
 * Returns the created user object if successful, null if failed
 */
export async function signup(
  email: string,
  password: string,
  name: string,
  businessName: string
): Promise<User | null> {
  try {
    // Call the server-side API endpoint to handle signup with service role
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        businessName,
      }),
    })

    let data
    try {
      data = await response.json()
    } catch (parseError) {
      const responseText = await response.text()
      console.error('Failed to parse JSON response. Status:', response.status, 'Response:', responseText?.substring(0, 500))
      return null
    }

    if (!response.ok) {
      const errorMsg = data?.error || 'Signup failed'
      const errorCode = data?.code || 'UNKNOWN_ERROR'
      console.error('Signup API error:', errorMsg, 'Code:', errorCode)
      // Throw a proper Error object with additional details
      const error = new Error(errorMsg) as any
      error.code = errorCode
      throw error
    }

    return data.user as User
  } catch (error) {
    console.error('Signup exception:', error)
    // Re-throw to let caller handle the error
    throw error
  }
}

/**
 * Get all businesses from Supabase
 */
export async function getBusinesses(): Promise<User[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('business_name')
    .select(`
      *,
      user_owner:user_owner (
        username
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  // Map to User type for compatibility
  return data.map(b => ({
    id: String(b.id),
    email: b.user_owner?.[0]?.username || '',
    name: b.user_owner?.[0]?.username || 'N/A',
    role: 'owner' as Role,
    businessId: String(b.id),
  }))
}

/**
 * Get current user from session
 */
export async function getCurrentSessionUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    return null
  }

  if (!authUser) {
    return null
  }

  const metadata = authUser.user_metadata as {
    name?: string
    role?: string
    businessId?: number | string
  } || {}

  return {
    id: authUser.id,
    email: authUser.email!,
    name: metadata.name || authUser.email!.split('@')[0],
    role: (metadata.role as Role) || 'cashier',
    businessId: metadata.businessId ? String(metadata.businessId) : undefined,
  }
}

/**
 * Sign out user
 */
export async function logout(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}
