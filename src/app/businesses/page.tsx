'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Table, Th, Td } from '../../components/ui/Table'
import { businesses } from '../../lib/data'

export default function BusinessesPage() {
  const [query, setQuery] = useState('')
  const [plan, setPlan] = useState<'All' | 'Basic' | 'Standard' | 'Premium'>('All')
  const [status, setStatus] = useState<'All' | 'Active' | 'Expiring' | 'Expired'>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return businesses.filter(b => {
      const matchQ =
        !q ||
        [b.name, b.ownerName, b.plan].some(v => v.toLowerCase().includes(q))
      const matchPlan = plan === 'All' || b.plan === plan
      const matchStatus = status === 'All' || (b.status ?? 'Active') === status
      return matchQ && matchPlan && matchStatus
    })
  }, [query, plan, status])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-coffee">Businesses</h1>
          <p className="text-sm text-coffee/70">
            Manage all subscribed businesses across the platform
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search businesses, owner, or plan..."
            className="h-9 w-64 rounded-lg bg-cream border border-black/10 px-3 outline-none"
          />
          <select
            value={plan}
            onChange={e =>
              setPlan(e.target.value as 'All' | 'Basic' | 'Standard' | 'Premium')
            }
            className="h-9 rounded-lg bg-cream border border-black/10 px-2"
          >
            <option>All</option>
            <option>Basic</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
          <select
            value={status}
            onChange={e =>
              setStatus(e.target.value as 'All' | 'Active' | 'Expiring' | 'Expired')
            }
            className="h-9 rounded-lg bg-cream border border-black/10 px-2"
          >
            <option>All</option>
            <option>Active</option>
            <option>Expiring</option>
            <option>Expired</option>
          </select>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Business Name</Th>
            <Th>Owner Name</Th>
            <Th>Subscription Plan</Th>
            <Th>Status</Th>
            <Th>Registration Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(b => (
            <tr key={b.id} className="hover:bg-cream/60">
              <Td className="font-medium">
                <Link href={`/businesses/${b.id}`} className="underline underline-offset-2">
                  {b.name}
                </Link>
              </Td>
              <Td>{b.ownerName}</Td>
              <Td>{b.plan}</Td>
              <Td>
                <span
                  className={`chip ${
                    (b.status ?? 'Active') === 'Expiring'
                      ? 'chip-warn'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {b.status ?? 'Active'}
                </span>
              </Td>
              <Td>{b.registrationDate}</Td>
              <Td>
                <Link href={`/businesses/${b.id}`} className="chip bg-cream border border-black/10">
                  View
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
