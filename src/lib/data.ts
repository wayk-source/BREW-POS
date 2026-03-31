import { ActiveUser, Business } from '../types'
import { getBusinesses, getSalesHistory, getEmployees } from './supabase-db'

// ============ Supabase Integration ============

/**
 * Fetch businesses from Supabase
 */
export async function fetchBusinesses(): Promise<Business[]> {
  const data = await getBusinesses()
  const result: Business[] = data.map(b => ({
    id: b.id.toString(),
    name: b.name,
    ownerName: b.ownerName || 'N/A',
    plan: b.plan || 'Basic',
    expirationDate: b.expirationDate || '',
    daysRemaining: b.daysRemaining || 0,
    status: b.status || 'Active',
    registrationDate: b.registrationDate,
    contactEmail: b.contactEmail,
    contactPhone: b.contactPhone,
  }))
  return result
}

/**
 * Fetch active users from Supabase
 * Note: This requires implementing a Supabase query that joins user_manager, user_cashier, and business_name tables
 * Currently returns empty array - implement based on your schema
 */
export async function fetchActiveUsers(businessId?: number): Promise<ActiveUser[]> {
  // TODO: Implement with Supabase query
  // The schema has user_manager and user_cashier tables that need to be joined
  console.warn('fetchActiveUsers is not implemented yet')
  return []
}

/**
 * Fetch expiring subscriptions from Supabase
 * Note: There is no subscription table in the current schema
 * Returns empty array until the feature is implemented
 */
export async function fetchExpiringSubscriptions(): Promise<Business[]> {
  // TODO: Implement when subscription table is added to schema
  console.warn('fetchExpiringSubscriptions is not implemented yet')
  return []
}

/**
 * Fetch sales history for a business
 */
export async function fetchSalesHistory(businessId: number, limit?: number) {
  return getSalesHistory(businessId, limit)
}

/**
 * Fetch employees for a business
 */
export async function fetchEmployees(businessId: number) {
  return getEmployees(businessId)
}

// ============ Mock Data for Components ============
// These are stub implementations until real data sources are available

/** Mock active users data */
export const activeUsers: ActiveUser[] = []

/** Mock analytics data */
export const analytics = {
  totalBusinesses: 0,
  activeUsers: 0,
  totalRevenue: 0,
  averageTransactionValue: 0,
}

/** Mock businesses data - replaces fetchBusinesses() for backward compatibility */
export const businesses: Business[] = []

/** Mock expiring subscriptions data */
export const expiringSubscriptions: Business[] = []

/** Mock expired subscriptions data */
export const expiredSubscriptions: Business[] = []

/** Pricing in PHP */
export const pricingPHP = {
  Basic: 2999,
  Standard: 4999,
  Premium: 7999,
}
