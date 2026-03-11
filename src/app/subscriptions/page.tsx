'use client'

import { useMemo, useState } from 'react'
import { Table, Th, Td } from '../../components/ui/Table'
import { businesses, expiringSubscriptions, expiredSubscriptions, pricingPHP } from '../../lib/data'

type Plan = 'Basic' | 'Standard' | 'Premium'

function Section({
  title,
  items,
}: {
  title: string
  items: typeof businesses
}) {
  const [plan, setPlan] = useState<Plan | 'All'>('All')
  const filtered = useMemo(() => {
    return items.filter(b => (plan === 'All' ? true : b.plan === plan))
  }, [plan, items])
  const groups: Record<Plan, typeof filtered> = {
    Basic: filtered.filter(b => b.plan === 'Basic'),
    Standard: filtered.filter(b => b.plan === 'Standard'),
    Premium: filtered.filter(b => b.plan === 'Premium'),
  }
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-coffee">{title}</h2>
          <p className="text-sm text-coffee/70">Grouped by plan type with PHP pricing</p>
        </div>
        <select
          value={plan}
          onChange={e => setPlan(e.target.value as Plan | 'All')}
          className="h-9 rounded-lg bg-cream border border-black/10 px-2"
        >
          <option>All</option>
          <option>Basic</option>
          <option>Standard</option>
          <option>Premium</option>
        </select>
      </div>
      {(Object.keys(groups) as Plan[]).map(p => (
        <div key={p} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-coffee">
              {p} • PHP {pricingPHP[p].toLocaleString()}
            </div>
            <div className="text-xs text-coffee/60">{groups[p].length} businesses</div>
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Business Name</Th>
                <Th>Plan Type</Th>
                <Th>Start Date</Th>
                <Th>Expiration Date</Th>
                <Th>Payment Status</Th>
                <Th className="text-right">Days Remaining</Th>
              </tr>
            </thead>
            <tbody>
              {groups[p].map(b => (
                <tr key={b.id} className="hover:bg-cream/60">
                  <Td className="font-medium">{b.name}</Td>
                  <Td>{b.plan}</Td>
                  <Td>{b.registrationDate}</Td>
                  <Td>{new Date(b.expirationDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</Td>
                  <Td>
                    <span className="chip chip-success">Paid</span>
                  </Td>
                  <Td className="text-right">
                    <span
                      className={`chip ${
                        b.daysRemaining <= 7 ? 'chip-warn' : 'chip-success'
                      }`}
                    >
                      {b.daysRemaining} days
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </section>
  )
}

export default function SubscriptionsPage() {
  const active = businesses.filter(b => (b.status ?? 'Active') === 'Active')
  const expiring = expiringSubscriptions
  const expired = expiredSubscriptions
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-coffee">Subscriptions</h1>
        <p className="text-sm text-coffee/70">Active and expiring subscriptions overview</p>
      </div>
      <Section title="Active Subscriptions" items={active} />
      <Section title="Expiring Subscriptions" items={expiring} />
      <Section title="Expired Subscriptions" items={expired} />
    </div>
  )
}
