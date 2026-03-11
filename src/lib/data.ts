import { ActiveUser, Business } from '../types'

export const analytics = {
  totalBusinesses: 1247,
  activeSubscriptions: 1089,
  expiringCount: 47,
  activeUsers: 328,
}

export const expiringSubscriptions: Business[] = [
  {
    id: 'b1',
    name: 'Brew Haven Café',
    ownerName: 'Sarah Johnson',
    plan: 'Premium',
    expirationDate: '2026-03-14',
    daysRemaining: 3,
    status: 'Expiring',
    registrationDate: '2024-05-12',
    contactEmail: 'contact@brewhaven.com',
    contactPhone: '+63 912 345 6789',
  },
  {
    id: 'b2',
    name: 'Mocha Moments',
    ownerName: 'Daniel Kim',
    plan: 'Standard',
    expirationDate: '2026-03-16',
    daysRemaining: 5,
    status: 'Expiring',
    registrationDate: '2024-02-03',
    contactEmail: 'hello@mochamoments.ph',
    contactPhone: '+63 987 654 3210',
  },
  {
    id: 'b3',
    name: 'Caramel Corner',
    ownerName: 'Priya Singh',
    plan: 'Basic',
    expirationDate: '2026-03-10',
    daysRemaining: 0,
    status: 'Expired',
    registrationDate: '2023-11-28',
    contactEmail: 'info@caramelcorner.ph',
    contactPhone: '+63 900 111 2233',
  },
]

export const activeUsers: ActiveUser[] = [
  {
    id: 'u1',
    name: 'Michael Chen',
    role: 'Cashier',
    businessName: 'Brew Haven Café',
    branchName: 'Downtown',
    loginTime: '9:12 AM',
    status: 'Online',
    lastLogin: '2026-03-10 09:12',
  },
  {
    id: 'u2',
    name: 'Aisha Khan',
    role: 'Manager',
    businessName: 'Mocha Moments',
    branchName: 'Uptown',
    loginTime: '8:40 AM',
    status: 'Online',
    lastLogin: '2026-03-10 08:40',
  },
  {
    id: 'u3',
    name: 'Jorge Alvarez',
    role: 'Cashier',
    businessName: 'Caramel Corner',
    branchName: 'Harbor',
    loginTime: '10:02 AM',
    status: 'Idle',
    lastLogin: '2026-03-10 10:02',
  },
  {
    id: 'u4',
    name: 'Sarah Johnson',
    role: 'Business Owner',
    businessName: 'Brew Haven Café',
    branchName: 'HQ',
    loginTime: '7:20 AM',
    status: 'Online',
    lastLogin: '2026-03-10 07:20',
  },
]

export const businesses: Business[] = [
  {
    id: 'b1',
    name: 'Brew Haven Café',
    ownerName: 'Sarah Johnson',
    plan: 'Premium',
    expirationDate: '2026-03-14',
    daysRemaining: 3,
    status: 'Active',
    registrationDate: '2024-05-12',
    contactEmail: 'contact@brewhaven.com',
    contactPhone: '+63 912 345 6789',
  },
  {
    id: 'b2',
    name: 'Mocha Moments',
    ownerName: 'Daniel Kim',
    plan: 'Standard',
    expirationDate: '2026-05-16',
    daysRemaining: 66,
    status: 'Active',
    registrationDate: '2024-02-03',
    contactEmail: 'hello@mochamoments.ph',
    contactPhone: '+63 987 654 3210',
  },
  {
    id: 'b3',
    name: 'Caramel Corner',
    ownerName: 'Priya Singh',
    plan: 'Basic',
    expirationDate: '2026-03-10',
    daysRemaining: 0,
    status: 'Expired',
    registrationDate: '2023-11-28',
    contactEmail: 'info@caramelcorner.ph',
    contactPhone: '+63 900 111 2233',
  },
  {
    id: 'b4',
    name: 'Bean & Bloom',
    ownerName: 'Nina Patel',
    plan: 'Standard',
    expirationDate: '2026-06-20',
    daysRemaining: 101,
    status: 'Active',
    registrationDate: '2025-07-19',
    contactEmail: 'hello@beanbloom.ph',
    contactPhone: '+63 930 555 0199',
  },
  {
    id: 'b5',
    name: 'Roast & Co.',
    ownerName: 'Jared Cruz',
    plan: 'Premium',
    expirationDate: '2026-09-01',
    daysRemaining: 174,
    status: 'Active',
    registrationDate: '2025-09-01',
    contactEmail: 'contact@roastco.ph',
    contactPhone: '+63 940 222 7788',
  },
]

export const pricingPHP: Record<Business['plan'], number> = {
  Basic: 499,
  Standard: 999,
  Premium: 1499,
}

export const expiredSubscriptions: Business[] = expiringSubscriptions.filter(
  b => (b.status ?? 'Active') === 'Expired' || b.daysRemaining <= 0
)
