'use client'

import { SummaryCard } from '@/src/components/ui/SummaryCard'
import { Banknote, Receipt, AlertTriangle, Users } from 'lucide-react'
import { transactions, staffMembers, auditLogs } from '@/src/lib/manager-data'

export default function ManagerDashboard() {
  const totalSales = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.total, 0)

  const transactionCount = transactions.filter(t => t.status === 'Completed').length
  const voidRefundCount = transactions.filter(t => t.status !== 'Completed').length
  const activeStaff = staffMembers.filter(s => s.status === 'Active').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coffee">Dashboard Overview</h1>
          <p className="text-coffee/70">Welcome back, Manager. Here's what's happening today.</p>
        </div>
        <div className="text-sm font-medium text-coffee/60 bg-white px-4 py-2 rounded-xl shadow-sm border border-black/5">
          Store Status: <span className="text-green-600">Open</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Sales"
          value={`₱${totalSales.toLocaleString()}`}
          icon={<Banknote className="h-6 w-6 text-green-700" />}
          tone="success"
          deltaPercent={12.5}
        />
        <SummaryCard
          title="Transactions"
          value={transactionCount}
          icon={<Receipt className="h-6 w-6 text-blue-700" />}
          tone="default"
          hint="Today's processed orders"
        />
        <SummaryCard
          title="Voids / Refunds"
          value={voidRefundCount}
          icon={<AlertTriangle className="h-6 w-6 text-amber-700" />}
          tone="warn"
          hint="Requires attention"
        />
        <SummaryCard
          title="Active Staff"
          value={activeStaff}
          icon={<Users className="h-6 w-6 text-indigo-700" />}
          tone="default"
          href="/manager/staff"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-black/5 p-6">
          <h2 className="text-lg font-semibold text-coffee mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-coffee/60 uppercase bg-cream/50 border-b border-black/5">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Cashier</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-coffee">{t.id}</td>
                    <td className="px-4 py-3 text-coffee/80">{t.time}</td>
                    <td className="px-4 py-3 text-coffee/80">{t.cashier}</td>
                    <td className="px-4 py-3 font-semibold text-coffee">₱{t.total}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        t.status === 'Voided' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-6">
          <h2 className="text-lg font-semibold text-coffee mb-4">Live Audit Log</h2>
          <div className="space-y-4">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-black/5 last:border-0">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  log.severity === 'high' ? 'bg-red-500' :
                  log.severity === 'medium' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-coffee">{log.action}</p>
                  <p className="text-xs text-coffee/60">{log.details}</p>
                  <p className="text-[10px] text-coffee/40 mt-1">{log.timestamp.split(' ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
