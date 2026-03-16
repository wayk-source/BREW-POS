'use client'

import { useState } from 'react'
import { staffMembers as initialStaff } from '@/src/lib/manager-data'
import { Search, UserCheck, UserX, BarChart2, DollarSign, Receipt } from 'lucide-react'

export default function StaffManagementPage() {
  const [staff, setStaff] = useState(initialStaff)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleStatus = (id: string) => {
    setStaff(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-coffee">Staff Performance</h1>
          <p className="text-coffee/70">Monitor cashier metrics and manage accounts.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee/40" />
          <input
            type="text"
            placeholder="Search staff..."
            className="pl-9 pr-4 py-2 rounded-xl border border-black/10 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-coffee/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                  member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-coffee">{member.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-coffee/60">{member.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => toggleStatus(member.id)}
                className={`p-2 rounded-xl transition-colors ${
                  member.status === 'Active' 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
                title={member.status === 'Active' ? "Disable Account" : "Enable Account"}
              >
                {member.status === 'Active' ? <UserX size={20} /> : <UserCheck size={20} />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-black/5 pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-coffee/50 text-xs uppercase font-medium mb-1">
                  <DollarSign size={14} /> Sales
                </div>
                <div className="text-xl font-bold text-coffee">₱{member.sales.toLocaleString()}</div>
              </div>
              <div className="text-center border-l border-black/5">
                <div className="flex items-center justify-center gap-1 text-coffee/50 text-xs uppercase font-medium mb-1">
                  <Receipt size={14} /> Trx
                </div>
                <div className="text-xl font-bold text-coffee">{member.transactions}</div>
              </div>
              <div className="text-center border-l border-black/5">
                <div className="flex items-center justify-center gap-1 text-coffee/50 text-xs uppercase font-medium mb-1">
                  <BarChart2 size={14} /> Voids
                </div>
                <div className={`text-xl font-bold ${member.voids > 2 ? 'text-red-600' : 'text-coffee'}`}>
                  {member.voids}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-coffee/60 bg-cream/30 p-3 rounded-xl">
              <span>Shift Started: <span className="font-medium text-coffee">{member.shiftStart}</span></span>
              <span>ID: <span className="font-mono">{member.id}</span></span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredStaff.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-black/5 text-coffee/40">
          No staff members found.
        </div>
      )}
    </div>
  )
}
