'use client'

import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Table, Th, Td } from '../../../components/ui/Table'
import {
  employeesSeed,
  storesSeed,
  type Employee,
  type StoreLocation,
  type StoreStatus,
} from '../../../lib/owner-data'
import { useLocalStorageState } from '../../../lib/useLocalStorageState'

export default function OwnerStoresPage() {
  const [stores, setStores] = useLocalStorageState<StoreLocation[]>('owner.stores', storesSeed)
  const [employees, setEmployees] = useLocalStorageState<Employee[]>('owner.employees', employeesSeed)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<StoreStatus>('Active')

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    employees.forEach(e => map.set(e.storeId, (map.get(e.storeId) ?? 0) + 1))
    return map
  }, [employees])

  function addStore() {
    const n = name.trim()
    const a = address.trim()
    const p = phone.trim()
    if (!n || !a) return
    const id = `s${Date.now()}`
    setStores([{ id, name: n, address: a, phone: p, status }, ...stores])
    setName('')
    setAddress('')
    setPhone('')
    setStatus('Active')
  }

  function removeStore(id: string) {
    const c = counts.get(id) ?? 0
    if (c > 0) return
    setStores(stores.filter(s => s.id !== id))
  }

  function setEmployeeStore(employeeId: string, storeId: string) {
    setEmployees(employees.map(e => (e.id === employeeId ? { ...e, storeId } : e)))
  }

  function setStoreStatus(storeId: string, s: StoreStatus) {
    setStores(stores.map(st => (st.id === storeId ? { ...st, status: s } : st)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-coffee">Store Management</h1>
        <p className="text-sm text-coffee/70">Manage multiple café branches and assign employees</p>
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-semibold text-coffee">Add Store Location</div>
          <button
            onClick={addStore}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[color:var(--color-mocha)] text-cream hover:brightness-95"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Store name"
            className="px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:col-span-2"
          />
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Address"
            className="px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:col-span-2"
          />
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone"
            className="px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value as StoreStatus)}
            className="px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-black/5">
          <h2 className="text-base font-semibold text-coffee">Stores</h2>
          <p className="text-sm text-coffee/70">Add, modify, or delete store locations</p>
        </div>
        <Table variant="plain">
          <thead>
            <tr>
              <Th>Store</Th>
              <Th>Address</Th>
              <Th>Phone</Th>
              <Th className="text-right">Employees</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {stores.map(s => {
              const c = counts.get(s.id) ?? 0
              return (
                <tr key={s.id} className="hover:bg-cream/60">
                  <Td className="font-medium">{s.name}</Td>
                  <Td>{s.address}</Td>
                  <Td>{s.phone}</Td>
                  <Td className="text-right">{c}</Td>
                  <Td>
                    <select
                      value={s.status}
                      onChange={e => setStoreStatus(s.id, e.target.value as StoreStatus)}
                      className="px-2 py-1.5 rounded-lg bg-white/80 border border-black/10"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={() => removeStore(s.id)}
                      disabled={c > 0}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-black/10 bg-white/80 hover:bg-black/5 disabled:opacity-40"
                      aria-label="Remove"
                      title={c > 0 ? 'Reassign employees before deleting' : 'Delete store'}
                    >
                      <Trash2 className="h-4 w-4 text-coffee/70" />
                    </button>
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-black/5">
          <h2 className="text-base font-semibold text-coffee">Employee Assignment</h2>
          <p className="text-sm text-coffee/70">Assign employees to store locations</p>
        </div>
        <Table variant="plain">
          <thead>
            <tr>
              <Th>Employee</Th>
              <Th>Role</Th>
              <Th>Assigned Store</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id} className="hover:bg-cream/60">
                <Td className="font-medium">{e.name}</Td>
                <Td>{e.role}</Td>
                <Td>
                  <select
                    value={e.storeId}
                    onChange={ev => setEmployeeStore(e.id, ev.target.value)}
                    className="px-2 py-1.5 rounded-lg bg-white/80 border border-black/10"
                  >
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </Td>
                <Td>
                  <span className={`chip ${e.status === 'Active' ? 'chip-success' : 'chip-warn'}`}>{e.status}</span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

