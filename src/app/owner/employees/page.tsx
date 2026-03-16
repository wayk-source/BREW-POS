'use client'

import { useMemo, useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Plus, ShieldAlert, Trash2, Eye, EyeOff, MoreVertical } from 'lucide-react'
import { Table, Th, Td } from '../../../components/ui/Table'
import { getSessionRole } from '../../../lib/session'
import { employeesSeed, storesSeed, type Employee, type EmployeeStatus, type StoreLocation } from '../../../lib/owner-data'
import { useLocalStorageState } from '../../../lib/useLocalStorageState'

export default function OwnerEmployeesPage() {
  const [role, setRole] = useState('owner')

  useEffect(() => {
    const currentRole = getSessionRole()
    if (currentRole) {
      setRole(currentRole)
    }
  }, [])

  const canViewFinancials = role === 'owner'

  const [employees, setEmployees] = useLocalStorageState<Employee[]>('owner.employees', employeesSeed)
  const [stores] = useLocalStorageState<StoreLocation[]>('owner.stores', storesSeed)
  const [query, setQuery] = useState('')
  const [storeId, setStoreId] = useState<'All' | string>('All')
  const [status, setStatus] = useState<'All' | EmployeeStatus>('All')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [newRole, setNewRole] = useState<'Manager' | 'Cashier'>('Cashier')
  const [newStore, setNewStore] = useState(stores[0]?.id ?? 's1')
  const [newStatus, setNewStatus] = useState<EmployeeStatus>('Active')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [selectedEmployeeForAction, setSelectedEmployeeForAction] = useState<Employee | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return employees.filter(e => {
      const matchQ = !q || [e.name, e.role].some(v => v.toLowerCase().includes(q))
      const matchStore = storeId === 'All' || e.storeId === storeId
      const matchStatus = status === 'All' || e.status === status
      return matchQ && matchStore && matchStatus
    })
  }, [employees, query, storeId, status])

  function addEmployee() {
    const n = name.trim()
    if (!n) return
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, name: n, role: newRole, storeId: newStore, email, password } : e))
      setEditingEmployee(null)
    } else {
      const id = `e${Date.now()}`
      const selectedStore = stores.find(s => s.id === newStore)
      const storePrefix = selectedStore ? selectedStore.name.substring(0, 2).toUpperCase() : 'XX'
      const namePrefix = n.substring(0, 2).toUpperCase()
      const roleSuffix = newRole === 'Manager' ? '01' : '02'
      const code = `${storePrefix}${namePrefix}${roleSuffix}`

      setEmployees([
        {
          id,
          name: n,
          role: newRole,
          storeId: newStore,
          status: newStatus,
          salesToday: 0,
          ordersToday: 0,
          code,
          email,
          password,
        },
        ...employees,
      ])
    }
    setName('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setIsModalOpen(false)
  }

  function openEditModal(e: Employee) {
    setEditingEmployee(e)
    setName(e.name)
    setEmail(e.email || '')
    setPassword(e.password || '')
    setNewRole(e.role)
    setNewStore(e.storeId)
    setIsModalOpen(true)
    setIsActionModalOpen(false)
  }

  function openAddModal() {
    setEditingEmployee(null)
    setName('')
    setEmail('')
    setPassword('')
    setNewRole('Cashier')
    setNewStore(stores[0]?.id ?? 's1')
    setIsModalOpen(true)
  }

  function setEmployeeStatus(id: string, s: EmployeeStatus) {
    setEmployees(employees.map(e => (e.id === id ? { ...e, status: s } : e)))
  }

  function removeEmployee(id: string) {
    setEmployees(employees.filter(e => e.id !== id))
    setIsActionModalOpen(false)
  }

  function openActionModal(e: Employee) {
    setSelectedEmployeeForAction(e)
    setIsActionModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-coffee">Employee Management</h1>
          <p className="text-sm text-coffee/70">Add managers and cashiers, assign stores, and track performance</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[color:var(--color-mocha)] text-cream hover:brightness-95 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add Employee
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? "Edit Employee" : "Add New Employee"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-coffee/80">Employee Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-caramel/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-coffee/80">Role</label>
            <select
              value={newRole}
              onChange={e => setNewRole(e.target.value as 'Manager' | 'Cashier')}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-caramel/40"
            >
              <option>Manager</option>
              <option>Cashier</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-coffee/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="employee@example.com"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-caramel/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-coffee/80">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-caramel/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee/50 hover:text-coffee"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-coffee/80">Assigned Store</label>
            <select
              value={newStore}
              onChange={e => setNewStore(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-caramel/40"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={addEmployee}
              className="w-full rounded-xl bg-[color:var(--color-mocha)] py-3 font-medium text-cream hover:brightness-95"
            >
              {editingEmployee ? "Save Changes" : "Confirm & Add Employee"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} title="Employee Actions">
        <div className="space-y-4">
          <p className="text-sm text-coffee/70">
            Choose an action for <strong>{selectedEmployeeForAction?.name}</strong>
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => selectedEmployeeForAction && openEditModal(selectedEmployeeForAction)}
              className="w-full rounded-xl border border-[color:var(--color-mocha)] bg-white py-3 font-medium text-[color:var(--color-mocha)] hover:bg-[color:var(--color-mocha)]/5"
            >
              Edit Details
            </button>
            <button
              onClick={() => selectedEmployeeForAction && removeEmployee(selectedEmployeeForAction.id)}
              className="w-full rounded-xl bg-red-50 py-3 font-medium text-red-600 hover:bg-red-100 border border-red-200"
            >
              Delete Employee
            </button>
          </div>
        </div>
      </Modal>

      <div className="card p-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={storeId}
            onChange={e => setStoreId(e.target.value)}
            className="h-10 rounded-xl bg-white/80 border border-black/10 px-2 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <option value="All">All Stores</option>
            {stores.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as 'All' | EmployeeStatus)}
            className="h-10 rounded-xl bg-white/80 border border-black/10 px-2 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <option value="All">All Status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search employee name or role..."
          className="w-full md:w-80 px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        />
      </div>

      {!canViewFinancials && (
        <div className="card p-4 border border-amber-200 bg-amber-50 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-700 mt-0.5" />
          <div className="text-sm text-amber-800">
            Sales performance metrics are hidden for your role.
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <Table variant="plain">
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>Employee Name</Th>
              <Th>Role</Th>
              <Th>Assigned Store</Th>
              <Th>Status</Th>
              {canViewFinancials && (
                <>
                  <Th className="text-right">Sales Today</Th>
                  <Th className="text-right">Orders Today</Th>
                </>
              )}
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="hover:bg-cream/60">
                <Td className="font-mono text-xs">{e.code || '-'}</Td>
                <Td className="font-medium">{e.name}</Td>
                <Td>{e.role}</Td>
                <Td>{stores.find(s => s.id === e.storeId)?.name ?? e.storeId}</Td>
                <Td>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={e.status === 'Active'}
                      onChange={() => setEmployeeStatus(e.id, e.status === 'Active' ? 'Suspended' : 'Active')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[color:var(--color-mocha)]"></div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{e.status}</span>
                  </label>
                </Td>
                {canViewFinancials && (
                  <>
                    <Td className="text-right">{e.salesToday.toLocaleString()}</Td>
                    <Td className="text-right">{e.ordersToday}</Td>
                  </>
                )}
                <Td className="text-right relative">
                  <button
                    onClick={() => openActionModal(e)}
                    className="p-2 hover:bg-black/5 rounded-full"
                  >
                    <MoreVertical className="h-4 w-4 text-coffee/70" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

