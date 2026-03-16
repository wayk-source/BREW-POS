'use client'

import { useState } from 'react'
import { transactions as initialTransactions } from '@/src/lib/manager-data'
import { Search, Filter, RotateCcw, Ban } from 'lucide-react'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cashier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.items.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleVoid = (id: string) => {
    if (confirm('Are you sure you want to VOID this transaction?')) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'Voided' } : t))
    }
  }

  const handleRefund = (id: string) => {
    if (confirm('Are you sure you want to REFUND this transaction?')) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'Refunded' } : t))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-coffee">Transactions</h1>
          <p className="text-coffee/70">Manage orders, process voids and refunds.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee/40" />
            <input
              type="text"
              placeholder="Search ID, Cashier..."
              className="pl-9 pr-4 py-2 rounded-xl border border-black/10 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-coffee/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="pl-3 pr-8 py-2 rounded-xl border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee/20 appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Voided">Voided</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-coffee/60 uppercase bg-cream/50 border-b border-black/5">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Cashier</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-cream/20 transition-colors group">
                  <td className="px-6 py-4 font-medium text-coffee">{t.id}</td>
                  <td className="px-6 py-4 text-coffee/80">
                    <div className="flex flex-col">
                      <span>{t.date}</span>
                      <span className="text-xs text-coffee/50">{t.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-coffee/80">{t.cashier}</td>
                  <td className="px-6 py-4 text-coffee/80 max-w-xs truncate" title={t.items}>{t.items}</td>
                  <td className="px-6 py-4 text-coffee/80">{t.paymentMethod}</td>
                  <td className="px-6 py-4 font-semibold text-coffee">₱{t.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      t.status === 'Voided' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {t.status === 'Completed' && (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleVoid(t.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Void Transaction"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRefund(t.id)}
                          className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors"
                          title="Process Refund"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-coffee/40">
            No transactions found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
