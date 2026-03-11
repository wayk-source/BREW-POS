'use client'

import Link from 'next/link'
import { Building2, CreditCard, Users2, AlertTriangle } from 'lucide-react'
import { SummaryCard } from '../../components/ui/SummaryCard'
import { Table, Th, Td } from '../../components/ui/Table'
import { analytics, expiringSubscriptions } from '../../lib/data'

export default function DashboardPage() {
  const expiringHint = `${expiringSubscriptions.length} sample${expiringSubscriptions.length !== 1 ? 's' : ''}`
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-coffee">Dashboard Overview</h1>
        <p className="text-coffee/70">Monitor and manage your POS subscription platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Registered Businesses"
          value={analytics.totalBusinesses}
          icon={<Building2 className="h-6 w-6" />}
          tone="default"
        />
        <SummaryCard
          title="Active Subscriptions"
          value={analytics.activeSubscriptions}
          icon={<CreditCard className="h-6 w-6" />}
          tone="success"
          hint="Active"
        />
        <SummaryCard
          title="Expiring Subscriptions"
          value={analytics.expiringCount}
          icon={<AlertTriangle className="h-6 w-6" />}
          tone="warn"
          hint={`${expiringHint}`}
          href="/admin/subscriptions?status=Expiring&plan=All"
        />
        <SummaryCard
          title="Current Active Users"
          value={analytics.activeUsers}
          icon={<Users2 className="h-6 w-6" />}
          href="/admin/users"
        />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-coffee">Expiring Subscriptions</h2>
            <p className="text-sm text-coffee/70">Businesses with subscriptions expiring soon</p>
          </div>
          <Link href="/admin/subscriptions?status=Expiring&plan=All" className="chip chip-warn">
            <AlertTriangle className="h-4 w-4" />
            View {analytics.expiringCount} Expiring
          </Link>
        </div>
        <div className="card p-3">
          <input
            type="text"
            placeholder="Search by business name, owner, or plan..."
            className="w-full px-3 py-2.5 rounded-lg bg-cream border border-black/10 focus:ring-2 focus:ring-caramel/50 outline-none"
          />
        </div>
        <Table>
          <thead>
            <tr>
              <Th>Business Name</Th>
              <Th>Owner Name</Th>
              <Th>Subscription Plan</Th>
              <Th>Expiration Date</Th>
              <Th className="text-right">Days Remaining</Th>
            </tr>
          </thead>
          <tbody>
            {expiringSubscriptions.map(b => (
              <tr key={b.id} className="hover:bg-cream/60">
                <Td className="font-medium">{b.name}</Td>
                <Td>{b.ownerName}</Td>
                <Td>{b.plan} Plan</Td>
                <Td>{new Date(b.expirationDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</Td>
                <Td className="text-right">
                  <span className="chip chip-warn">{b.daysRemaining} days</span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  )
}
