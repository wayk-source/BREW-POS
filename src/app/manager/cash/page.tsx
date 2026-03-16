'use client'

import { useState } from 'react'
import { auditLogs as initialLogs } from '@/src/lib/manager-data'
import { Filter, Calendar, User, Search } from 'lucide-react'

export default function CashOversightPage() {
  const [logs, setLogs] = useState(initialLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('All')

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter

    return matchesSearch && matchesSeverity
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-coffee">Cash Oversight & Audit Logs</h1>
          <p className="text-coffee/70">Monitor transactions, voids, and staff activities.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee/40" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-9 pr-4 py-2 rounded-xl border border-black/10 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-coffee/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="pl-3 pr-8 py-2 rounded-xl border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee/20 appearance-none cursor-pointer"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severities</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-coffee/60 uppercase bg-cream/50 border-b border-black/5">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-6 py-4 text-coffee/80 font-mono text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium text-coffee flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-cream flex items-center justify-center text-coffee/60">
                      <User size={12} />
                    </div>
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-coffee/90 font-semibold">{log.action}</td>
                  <td className="px-6 py-4 text-coffee/70">{log.details}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.severity === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
                      log.severity === 'medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-coffee/40">
            No logs found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
