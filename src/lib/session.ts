import type { User, Role } from '../types'
import { getCurrentSessionUser } from './auth'

/**
 * Get current user from Supabase session
 */
export async function getSession(): Promise<User | null> {
  const user = await getCurrentSessionUser()
  return user
}

/**
 * Get current user's role from Supabase session
 */
export async function getSessionRole(): Promise<Role | null> {
  const user = await getSession()
  return user?.role ?? null
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getSession()
  return user !== null
}
