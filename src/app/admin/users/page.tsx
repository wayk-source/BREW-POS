'use client'

import { useMemo, useState } from 'react'
import { Table, Th, Td } from '../../../components/ui/Table'
import { activeUsers } from '../../../lib/data'

export default function UsersPage() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'All' | 'Business Owner' | 'Manager' | 'Cashier'>('All')
  const [business, setBusiness] = useState<'All' | string>('All')

  const businesses = useMemo(
    () => Array.from(new Set(activeUsers.map(u => u.businessName))),
    []
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return activeUsers.filter(u => {
      const matchQ =
        !q ||
        [u.name, u.businessName, u.branchName].some(v =>
          v.toLowerCase().includes(q)
        )
      const matchRole = role === 'All' || u.role === role
      const matchBusiness = business === 'All' || u.businessName === business
      return matchQ && matchRole && matchBusiness
    })
  }, [query, role, business])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-coffee">Users</h1>
        <p className="text-sm text-coffee/70">
          Search and filter platform users by business and role
        </p>
      </div>
      <div className="card p-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          placeholder="Search by name, business, or branch..."
          className="flex-1 px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 focus:ring-2 focus:ring-caramel/40 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        />
        <select
          value={role}
          onChange={e =>
            setRole(e.target.value as 'All' | 'Business Owner' | 'Manager' | 'Cashier')
          }
          className="px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
          <option>All</option>
          <option>Business Owner</option>
          <option>Manager</option>
          <option>Cashier</option>
        </select>
        <select
          value={business}
          onChange={e => setBusiness(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
          <option>All</option>
          {businesses.map(b => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>User Name</Th>
            <Th>Role</Th>
            <Th>Business Name</Th>
            <Th>Branch</Th>
            <Th>Status</Th>
            <Th>Last Login</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id} className="hover:bg-cream/60">
              <Td className="font-medium">{u.name}</Td>
              <Td>{u.role}</Td>
              <Td>{u.businessName}</Td>
              <Td>{u.branchName}</Td>
              <Td>
                <span
                  className={`chip ${
                    u.status === 'Online'
                      ? 'chip-success'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {u.status}
                </span>
              </Td>
              <Td>{u.lastLogin ?? u.loginTime}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
