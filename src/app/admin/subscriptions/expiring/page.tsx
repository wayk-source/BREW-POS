'use client'

import { useMemo, useState } from 'react'
import { Table, Th, Td } from '../../../../components/ui/Table'
import { expiringSubscriptions } from '../../../../lib/data'

export default function ExpiringSubscriptionsPage() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return expiringSubscriptions.filter(b =>
      [b.name, b.ownerName, b.plan].some(v => v.toLowerCase().includes(q))
    )
  }, [query])
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-coffee">Expiring Subscriptions</h1>
        <p className="text-sm text-coffee/70">Businesses with subscriptions expiring soon</p>
      </div>
      <div className="card p-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
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
          {filtered.map(b => (
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
    </div>
  )
}
