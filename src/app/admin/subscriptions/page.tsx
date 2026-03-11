'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, Th, Td } from '../../../components/ui/Table'
import { businesses, expiringSubscriptions } from '../../../lib/data'
import type { Business } from '../../../types'

type Plan = 'Basic' | 'Standard' | 'Premium'
type Status = 'Active' | 'Expiring' | 'Expired'
type SortKey = 'name' | 'plan' | 'registrationDate' | 'expirationDate' | 'daysRemaining' | 'status'

function mergeBusinesses(): Business[] {
  const map = new Map<string, Business>()
  businesses.forEach(b => map.set(b.id, { ...b, status: b.status ?? 'Active' }))
  expiringSubscriptions.forEach(b => {
    const existing = map.get(b.id)
    map.set(b.id, { ...(existing ?? b), ...b })
  })
  return Array.from(map.values())
}

export default function SubscriptionsPage() {
  const all = useMemo(() => mergeBusinesses(), [])
  const router = useRouter()

  const [statusFilter, setStatusFilter] = useState<Status>(() => {
    if (typeof window === 'undefined') return 'Active'
    const sp = new URLSearchParams(window.location.search)
    const s = sp.get('status') as Status | null
    if (s === 'Active' || s === 'Expiring' || s === 'Expired') return s
    return 'Active'
  })
  const [plan, setPlan] = useState<Plan | 'All'>(() => {
    if (typeof window === 'undefined') return 'All'
    const sp = new URLSearchParams(window.location.search)
    const p = sp.get('plan') as (Plan | 'All') | null
    if (p === 'All' || p === 'Basic' || p === 'Standard' || p === 'Premium') return p
    return 'All'
  })
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = all.filter(b => {
      const matchStatus = (b.status ?? 'Active') === statusFilter
      const matchPlan = plan === 'All' || b.plan === plan
      const matchQ =
        !q || [b.name, b.ownerName, b.plan, b.registrationDate ?? '']
          .some(v => v?.toLowerCase().includes(q))
      return matchStatus && matchPlan && matchQ
    })
    rows = rows.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      const val = (x: Business) => {
        switch (sortKey) {
          case 'name': return x.name.toLowerCase()
          case 'plan': return x.plan
          case 'status': return (x.status ?? 'Active')
          case 'registrationDate': return new Date(x.registrationDate ?? '1970-01-01').getTime()
          case 'expirationDate': return new Date(x.expirationDate).getTime()
          case 'daysRemaining': return x.daysRemaining
        }
      }
      const av = val(a)
      const bv = val(b)
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return (String(av)).localeCompare(String(bv)) * dir
    })
    return rows
  }, [all, statusFilter, plan, query, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-coffee">Subscriptions</h1>
        <p className="text-sm text-coffee/70">Filter, search, sort, and paginate subscription records</p>
      </div>

      <div className="card p-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={statusFilter}
            onChange={e => {
              const v = e.target.value as Status
              setStatusFilter(v)
              setPage(1)
              const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
              sp.set('status', v)
              router.replace(`/admin/subscriptions?${sp.toString()}`)
            }}
            className="h-10 rounded-xl bg-white/80 border border-black/10 px-2 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <option>Active</option>
            <option>Expiring</option>
            <option>Expired</option>
          </select>
          <select
            value={plan}
            onChange={e => {
              const v = e.target.value as Plan | 'All'
              setPlan(v)
              setPage(1)
              const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
              sp.set('plan', v)
              router.replace(`/admin/subscriptions?${sp.toString()}`)
            }}
            className="h-10 rounded-xl bg-white/80 border border-black/10 px-2 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <option>All</option>
            <option>Basic</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
        </div>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1) }}
          type="text"
          placeholder="Search business, owner, or plan…"
          className="w-full md:w-80 px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 focus:ring-2 focus:ring-caramel/40 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <Table variant="plain">
          <thead>
            <tr>
              <Th><button onClick={() => toggleSort('name')}>Business Name</button></Th>
              <Th><button onClick={() => toggleSort('plan')}>Subscription Plan</button></Th>
              <Th>Payment Status</Th>
              <Th><button onClick={() => toggleSort('registrationDate')}>Start Date</button></Th>
              <Th><button onClick={() => toggleSort('expirationDate')}>Expiration Date</button></Th>
              <Th className="text-right"><button onClick={() => toggleSort('daysRemaining')}>Days Remaining</button></Th>
              <Th><button onClick={() => toggleSort('status')}>Subscription Status</button></Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(b => (
              <tr key={b.id} className="hover:bg-cream/60">
                <Td className="font-medium">{b.name}</Td>
                <Td>{b.plan}</Td>
                <Td><span className="chip chip-success">Paid</span></Td>
                <Td>{b.registrationDate}</Td>
                <Td>{new Date(b.expirationDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</Td>
                <Td className="text-right">
                  <span className={`chip ${b.daysRemaining <= 7 ? 'chip-warn' : 'chip-success'}`}>{b.daysRemaining} days</span>
                </Td>
                <Td>
                  <span
                    className={`chip ${
                      (b.status ?? 'Active') === 'Expired'
                        ? 'chip-danger'
                        : (b.status ?? 'Active') === 'Expiring'
                        ? 'chip-warn'
                        : 'chip-success'
                    }`}
                  >
                    {b.status ?? 'Active'}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-coffee/70">
            Page {page} of {totalPages} • {filtered.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              className="button px-3 py-2 bg-white/80 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="button px-3 py-2 bg-white/80 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
