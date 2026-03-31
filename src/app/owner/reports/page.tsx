'use client'

import { useMemo, useState, useEffect } from 'react'
import { Download, Filter } from 'lucide-react'
import { Table, Th, Td } from '../../../components/ui/Table'
import { MultiLineChart } from '../../../components/ui/charts/MultiLineChart'
import { getSessionRole } from '../../../lib/session'
import { ownerBusiness, saleRecordsSeed, storesSeed } from '../../../lib/owner-data'

type RangePreset = 'Last 7 days' | 'Last 30 days' | 'This month'

function toCsv(rows: Record<string, string | number>[]) {
  const headers = Object.keys(rows[0] ?? {})
  const esc = (v: string | number) => {
    const s = String(v ?? '')
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  return [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h] ?? '')).join(','))].join('\n')
}

export default function OwnerReportsPage() {
  const [role, setRole] = useState('owner')
  const canViewFinancials = role === 'owner'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    async function fetchRole() {
      const currentRole = await getSessionRole()
      if (currentRole) {
        setRole(currentRole)
      }
    }
    fetchRole()
  }, [])

  const [preset, setPreset] = useState<RangePreset>('Last 7 days')
  const [storeId, setStoreId] = useState<'All' | string>('All')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<'date' | 'orders' | 'netSales'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    setMounted(true)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = saleRecordsSeed.filter(r => {
      const matchStore = storeId === 'All' || r.storeId === storeId
      const matchQ = !q || [r.topItem, r.date].some(v => v.toLowerCase().includes(q))
      return matchStore && matchQ
    })
    rows = rows.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      const av =
        sortKey === 'orders' ? a.orders :
        sortKey === 'netSales' ? a.netSales :
        new Date(a.date).getTime()
      const bv =
        sortKey === 'orders' ? b.orders :
        sortKey === 'netSales' ? b.netSales :
        new Date(b.date).getTime()
      return (av - bv) * dir
    })
    return rows
  }, [query, storeId, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const series = useMemo(() => {
    const byDate = new Map<string, number>()
    filtered.forEach(r => byDate.set(r.date, (byDate.get(r.date) ?? 0) + r.netSales))
    return Array.from(byDate.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, value]) => {
        const dt = new Date(date)
        const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        return { label, value }
      })
  }, [filtered])

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function onExport() {
    const rows = filtered.map(r => ({
      Date: r.date,
      Code: r.cashierCode ?? '',
      Store: storesSeed.find(s => s.id === r.storeId)?.name ?? r.storeId,
      Collection: r.netSales,
      ...(canViewFinancials
        ? {
            'Amount Collected': r.netSales,
          }
        : {}),
      'Best-Selling Item': r.topItem,
    }))
    const csv = toCsv(rows as unknown as Record<string, string | number>[])
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brewpos-sales-report.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-coffee">Sales Reports</h1>
          <p className="text-sm text-coffee/70">Daily, weekly, and monthly reporting tools</p>
        </div>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[color:var(--color-mocha)] text-cream hover:brightness-95"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <Filter className="h-4 w-4 text-coffee/50" />
            <select
              value={preset}
              onChange={e => { setPreset(e.target.value as RangePreset); setPage(1) }}
              className="bg-transparent outline-none text-sm text-coffee"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This month</option>
            </select>
          </div>

          <select
            value={storeId}
            onChange={e => { setStoreId(e.target.value); setPage(1) }}
            className="h-10 rounded-xl bg-white/80 border border-black/10 px-2 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <option value="All">All Stores</option>
            {storesSeed.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1) }}
          placeholder="Search by date or top item..."
          className="w-full lg:w-80 px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        />
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-coffee">Net Sales Trend</h2>
            <p className="text-sm text-coffee/70">{preset}</p>
          </div>
          <div className="text-xs text-coffee/60">
            {mounted ? (canViewFinancials ? ownerBusiness.currency : 'Restricted') : '...'}
          </div>
        </div>
        <div className="mt-4">
          <MultiLineChart series={[{ name: 'Net Sales', color: '#2196F3', data: series }]} />
        </div>
        {mounted && canViewFinancials && (
          <div className="mt-4 pt-4 border-t border-black/5">
            <div className="text-right">
              <div className="text-sm text-coffee/60">Total Sales</div>
              <div className="text-2xl font-semibold text-coffee">
                {ownerBusiness.currency} {series.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-black/5">
          <h2 className="text-base font-semibold text-coffee">Sales Table</h2>
          <p className="text-sm text-coffee/70">Searchable records with peak-hour and item insights</p>
        </div>
        <Table variant="plain">
          <thead>
            <tr>
              <Th><button onClick={() => toggleSort('date')}>Date</button></Th>
              <Th>Code</Th>
              <Th>Store</Th>
              <Th className="text-right"><button onClick={() => toggleSort('netSales')}>Collection</button></Th>
              {canViewFinancials && (
                <Th className="text-right"><button onClick={() => toggleSort('netSales')}>Amount Collected</button></Th>
              )}
              <Th>Best-Selling Item</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(r => (
              <tr key={r.id} className="hover:bg-cream/60">
                <Td className="font-medium">{r.date}</Td>
                <Td className="font-mono text-xs">{r.cashierCode ?? '—'}</Td>
                <Td>{storesSeed.find(s => s.id === r.storeId)?.name ?? r.storeId}</Td>
                <Td className="text-right">{ownerBusiness.currency} {r.netSales.toLocaleString()}</Td>
                {canViewFinancials && (
                  <Td className="text-right">{ownerBusiness.currency} {r.netSales.toLocaleString()}</Td>
                )}
                <Td>{r.topItem}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="flex items-center justify-between px-5 py-4 border-t border-black/5">
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
      </section>

      {!canViewFinancials && (
        <div className="card p-4 border border-amber-200 bg-amber-50">
          <div className="text-sm text-amber-800">
            Financial metrics are hidden for your role.
          </div>
        </div>
      )}
    </div>
  )
}

