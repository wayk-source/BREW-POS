'use client'

import { useMemo, useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { Table, Th, Td } from '../../../components/ui/Table'
import { useOwnerContext } from '../../../lib/useOwnerContext'
import { getOwnerEmployees, addOwnerEmployee, deleteOwnerEmployee } from '../../../lib/owner-db'
import type { Employee } from '../../../lib/owner-data'

export default function OwnerEmployeesPage() {
  const { businessId, loading: contextLoading } = useOwnerContext()
  
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'All' | 'Manager' | 'Cashier'>('All')

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [newRole, setNewRole] = useState<'Manager' | 'Cashier'>('Cashier')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load employees
  useEffect(() => {
    async function loadEmployees() {
      if (!businessId) return
      try {
        const data = await getOwnerEmployees(Number(businessId))
        setEmployees(data)
      } catch (error) {
        console.error('Error loading employees:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [businessId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return employees.filter(e => {
      const matchQ = !q || [e.username, e.role].some(v => v?.toString().toLowerCase().includes(q))
      const matchRole = role === 'All' || e.role === role
      return matchQ && matchRole
    })
  }, [employees, query, role])

  async function addEmployee() {
    const n = name.trim()
    const u = username.trim()
    const p = password.trim()

    if (!n || !u || !p) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    try {
      const newEmp = await addOwnerEmployee(
        Number(businessId),
        newRole.toLowerCase() as 'manager' | 'cashier',
        u,
        p
      )

      if (newEmp) {
        setEmployees([newEmp, ...employees])
        setName('')
        setUsername('')
        setPassword('')
        setNewRole('Cashier')
        setIsModalOpen(false)
      } else {
        alert('Failed to create employee')
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Error creating employee')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function removeEmployee(empId: number, empRole: 'Manager' | 'Cashier') {
    if (!confirm('Are you sure you want to remove this employee?')) return

    try {
      const success = await deleteOwnerEmployee(
        Number(businessId),
        empId,
        empRole.toLowerCase() as 'manager' | 'cashier'
      )

      if (success) {
        setEmployees(employees.filter(e => e.id !== empId))
      } else {
        alert('Failed to delete employee')
      }
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Error deleting employee')
    }
  }

  if (contextLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee mx-auto mb-4"></div>
          <p className="text-coffee/70">Loading employees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-coffee">Employee Management</h1>
          <p className="text-sm text-coffee/70">Add managers and cashiers to your business</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[color:var(--color-mocha)] text-cream hover:brightness-95 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add Employee
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-coffee/80">Employee Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. john_doe"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-caramel/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-coffee/80">Full Name</label>
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
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
            </select>
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

          <div className="pt-2">
            <button
              onClick={addEmployee}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[color:var(--color-mocha)] py-3 font-medium text-cream hover:brightness-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </div>
      </Modal>

      <div className="card p-3 flex flex-col gap-3 md:flex-row md:items-center">
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'All' | 'Manager' | 'Cashier')}
          className="h-10 rounded-xl bg-white/80 border border-black/10 px-2 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
          <option value="All">All Roles</option>
          <option value="Manager">Manager</option>
          <option value="Cashier">Cashier</option>
        </select>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by username or role..."
          className="flex-1 px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <Table variant="plain">
          <thead>
            <tr>
              <Th>Username</Th>
              <Th>Role</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-coffee/70">No employees yet. Add your first employee to get started.</td>
              </tr>
            ) : (
              filtered.map(e => (
                <tr key={e.id} className="hover:bg-cream/60">
                  <Td className="font-medium">{e.username}</Td>
                  <Td>{e.role}</Td>
                  <Td className="text-right">
                    <button
                      onClick={() => removeEmployee(e.id, e.role)}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-black/10 bg-white/80 hover:bg-red-50 hover:text-red-600"
                      title="Delete employee"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

