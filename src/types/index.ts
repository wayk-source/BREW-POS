export type SubscriptionStatus = 'active' | 'expiring' | 'expired'

export interface Business {
  id: string
  name: string
  ownerName: string
  plan: 'Basic' | 'Standard' | 'Premium'
  expirationDate: string
  daysRemaining: number
  status?: 'Active' | 'Expiring' | 'Expired'
  registrationDate?: string
  contactEmail?: string
  contactPhone?: string
}

export interface ActiveUser {
  id: string
  name: string
  role: 'Business Owner' | 'Manager' | 'Cashier'
  businessName: string
  branchName: string
  loginTime: string
  status: 'Online' | 'Idle'
  lastLogin?: string
}
