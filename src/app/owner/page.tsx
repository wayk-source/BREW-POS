'use client'

import { useEffect, useMemo, useState } from 'react'
import { CreditCard, TrendingUp, ShoppingBag, Users2 } from 'lucide-react'
import { SummaryCard } from '../../components/ui/SummaryCard'
import { Table, Th, Td } from '../../components/ui/Table'
import { TimeSeriesChart } from '../../components/ui/charts/TimeSeriesChart'
import { MultiLineChart } from '../../components/ui/charts/MultiLineChart'
import { useOwnerContext } from '../../lib/useOwnerContext'
import { getOwnerSalesAnalytics, getOwnerEmployees } from '../../lib/owner-db'
import { saleRecordsSeed, employeesSeed } from '../../lib/owner-data'

export default function OwnerHome() {
  const { businessId, businessName, loading: contextLoading } = useOwnerContext()
  const [range, setRange] = useState<'Daily'>('Daily')
  const [salesData, setSalesData] = useState<Array<{ date: string; total: number }>>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const hasSalesData = salesData.length > 0

  useEffect(() => {
    async function loadData() {
      if (!businessId) {
        console.log('No businessId, skipping data load')
        return
      }

      console.log('Starting data load for businessId:', businessId)

      // Load seed data immediately for instant loading
      const seedAnalytics = saleRecordsSeed
        .filter(r => r.storeId === 's1' || r.storeId === 's2')
        .map(r => ({ date: r.date, total: r.netSales }))

      const seedEmployees = employeesSeed
        .filter(e => e.storeId === 's1' || e.storeId === 's2')
        .map(e => ({ id: e.id, username: e.name, role: e.role, storeId: e.storeId }))

      setSalesData(seedAnalytics)
      setEmployees(seedEmployees)
      setLoading(false)

      // Try to load real data in background
      try {
        console.log('Fetching real analytics in background...')
        const analyticsPromise = getOwnerSalesAnalytics(Number(businessId), 30)
        const employeesPromise = getOwnerEmployees(Number(businessId))

        const [analytics, employeeList] = await Promise.all([
          analyticsPromise,
          employeesPromise,
        ])

        console.log('Real data loaded:', { analyticsCount: analytics.length, employeesCount: employeeList.length })

        // Use real data if available
        if (analytics.length > 0) {
          setSalesData(analytics)
        }
        if (employeeList.length > 0) {
          setEmployees(employeeList)
        }
      } catch (error: any) {
        console.log('Real data load failed, keeping seed data:', error.message)
        // Keep seed data
      }
    }

    loadData()
  }, [businessId])

  const rangeStart = '2026-03-01'
  const rangeEnd = '2026-03-12'

  const {
    totalSalesNetRange,
    totalOrdersRange,
    todayGrossSales,
    activeEmployees,
    totalDeltaPct,
    todayDeltaPct,
    seriesAll,
    byDateNet,
    days,
  } = useMemo(() => {
    if (!hasSalesData) {
      return {
        totalSalesNetRange: 0,
        totalOrdersRange: 0,
        todayGrossSales: 0,
        activeEmployees: employees.length,
        totalDeltaPct: 0,
        todayDeltaPct: 0,
        seriesAll: [],
        byDateNet: new Map<string, number>(),
        days: [],
      }
    }

    const start = new Date(rangeStart)
    const end = new Date(rangeEnd)

    // Use real sales data if available
    const inRange = salesData.filter(r => {
      const d = new Date(r.date)
      return d >= start && d <= end
    })

    // Build day maps
    const byDateNet = new Map<string, number>()
    inRange.forEach(r => {
      byDateNet.set(r.date, r.total)
    })

    // Build continuous series from start->end
    const days: string[] = []
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      days.push(new Date(d).toISOString().slice(0, 10))
    }

    const seriesAll = days.map(day => {
      const dt = new Date(day)
      const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return { label, value: byDateNet.get(day) ?? 0 }
    })

    const today = days[days.length - 1]
    const prev = days[days.length - 2]
    const todayGross = byDateNet.get(today) ?? 0
    const totalNetRange = Array.from(byDateNet.values()).reduce((s, v) => s + v, 0)

    // Delta % compare Today vs Previous day
    const netToday = byDateNet.get(today) ?? 0
    const netPrev = byDateNet.get(prev) ?? 0
    const totalDeltaPct = netPrev > 0 ? ((netToday - netPrev) / netPrev) * 100 : (netToday > 0 ? 100 : 0)
    const todayDeltaPct = netPrev > 0 ? ((netToday - netPrev) / netPrev) * 100 : (netToday > 0 ? 100 : 0)
    const active = employees.length

    return {
      totalSalesNetRange: totalNetRange,
      totalOrdersRange: 0,
      todayGrossSales: todayGross,
      activeEmployees: active,
      totalDeltaPct,
      todayDeltaPct,
      seriesAll,
      byDateNet,
      days,
    }
  }, [salesData, employees, rangeStart, rangeEnd, hasSalesData])

  const [view, setView] = useState<'7' | '30' | 'all'>('all')
  const visibleSeries = useMemo(() => {
    if (view === '7') return seriesAll.slice(-7)
    if (view === '30') return seriesAll.slice(-30)
    return seriesAll
  }, [seriesAll, view])

  // Placeholder category data - will be populated from real data when available
  const categorySeries = useMemo(() => {
    const toLabel = (d: string) => {
      const dt = new Date(d)
      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const coffee: { label: string; value: number }[] = []
    const tea: { label: string; value: number }[] = []
    const snack: { label: string; value: number }[] = []

    days.forEach((day) => {
      coffee.push({ label: toLabel(day), value: 0 })
      tea.push({ label: toLabel(day), value: 0 })
      snack.push({ label: toLabel(day), value: 0 })
    })

    return { coffee, tea, snack }
  }, [days])

  const visibleCategories = useMemo(() => {
    const len = visibleSeries.length
    const startLabel = visibleSeries[0]?.label
    const startIdx = days.findIndex(d => {
      const lbl = new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return lbl === startLabel
    })
    const slice = (arr: { label: string; value: number }[]) =>
      arr.slice(Math.max(0, startIdx), Math.max(0, startIdx) + len)
    return {
      coffee: slice(categorySeries.coffee),
      tea: slice(categorySeries.tea),
      snack: slice(categorySeries.snack),
    }
  }, [categorySeries, visibleSeries, days])

  const bestDay = useMemo(() => {
    if (!seriesAll.length) return { label: '—', value: 0 }
    return seriesAll.reduce((a, b) => (b.value > a.value ? b : a))
  }, [seriesAll])

  const dateRangeLabel = useMemo(() => {
    const s = new Date(rangeStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const e = new Date(rangeEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${s} – ${e}`
  }, [rangeStart, rangeEnd])

  if (contextLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee mx-auto mb-4"></div>
          <p className="text-coffee/70">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-coffee">Owner Dashboard</h1>
          <p className="text-sm text-coffee/70">
            Sales reporting and analytics for {businessName || 'Your Business'}
          </p>
        </div>
        <div className="flex items-center gap-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Sales"
          value={hasSalesData ? `PHP ${totalSalesNetRange.toLocaleString()}` : '—'}
          icon={<CreditCard className="h-6 w-6" />}
          tone="success"
          deltaPercent={hasSalesData ? totalDeltaPct : undefined}
          hint={hasSalesData ? dateRangeLabel : 'No data available'}
        />
        <SummaryCard
          title="Total Orders"
          value={hasSalesData ? totalOrdersRange : '—'}
          icon={<ShoppingBag className="h-6 w-6" />}
          tone="default"
          hint={hasSalesData ? 'Across all stores' : 'No data available'}
        />
        <SummaryCard
          title="Today Sales"
          value={hasSalesData ? `PHP ${todayGrossSales.toLocaleString()}` : '—'}
          icon={<TrendingUp className="h-6 w-6" />}
          tone="warn"
          deltaPercent={hasSalesData ? todayDeltaPct : undefined}
          hint={hasSalesData ? 'Today' : 'No data available'}
        />
        <SummaryCard
          title="Active Employees"
          value={activeEmployees > 0 ? activeEmployees : '—'}
          icon={<Users2 className="h-6 w-6" />}
          tone="default"
          hint="On shift / active"
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-coffee">Sales Statistic</h2>
              <p className="text-sm text-coffee/70">From start to present</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('7')}
                className={`px-3 py-1.5 rounded-lg text-xs border ${view === '7' ? 'bg-[color:var(--color-mocha)] text-cream border-transparent' : 'bg-white/80 border-black/10 text-coffee hover:bg-black/5'}`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setView('30')}
                className={`px-3 py-1.5 rounded-lg text-xs border ${view === '30' ? 'bg-[color:var(--color-mocha)] text-cream border-transparent' : 'bg-white/80 border-black/10 text-coffee hover:bg-black/5'}`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setView('all')}
                className={`px-3 py-1.5 rounded-lg text-xs border ${view === 'all' ? 'bg-[color:var(--color-mocha)] text-cream border-transparent' : 'bg-white/80 border-black/10 text-coffee hover:bg-black/5'}`}
              >
                Custom
              </button>
            </div>
          </div>
          <div className="mt-4">
            {hasSalesData ? (
              <MultiLineChart
                series={[
                  { name: 'Coffee', color: '#FFC107', data: visibleCategories.coffee },
                  { name: 'Tea', color: '#4CAF50', data: visibleCategories.tea },
                  { name: 'Snack', color: '#E53935', data: visibleCategories.snack },
                ]}
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-coffee/40 bg-cream/50 text-center p-4">
                <div>
                  <p className="text-lg font-semibold text-coffee/80">No data available</p>
                  <p className="text-sm text-coffee/60">Make your first sale to populate this chart.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card p-5">
          <div>
            <h2 className="text-base font-semibold text-coffee">Most Purchased Items</h2>
            <p className="text-sm text-coffee/70">By category</p>
          </div>
          <div className="mt-4 space-y-3">
            {hasSalesData ? (
              <p className="text-sm text-coffee/70">No top-selling items to display yet.</p>
            ) : (
              <p className="text-sm text-coffee/70">No sales data available yet. Make your first sale to see analytics.</p>
            )}
          </div>
        </div>
      </section>

      <section className="card p-5">
        <div>
          <h2 className="text-base font-semibold text-coffee">Business Insights</h2>
          <p className="text-sm text-coffee/70">Quick highlights from {dateRangeLabel}</p>
        </div>
        {hasSalesData ? (
          <ul className="mt-3 text-sm space-y-1.5">
            <li>• Best Day: {bestDay.label}</li>
            <li>• Total Sales: PHP {totalSalesNetRange.toLocaleString()}</li>
            <li>• Active Employees: {activeEmployees}</li>
          </ul>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-coffee/30 bg-cream/40 p-6 text-center text-sm text-coffee/70">
            No data available yet. Start selling to get business insights.
          </div>
        )}
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-black/5">
          <h2 className="text-base font-semibold text-coffee">Top Products & Profit</h2>
          <p className="text-sm text-coffee/70">Revenue and estimated margin</p>
        </div>
        <Table variant="plain">
          <thead>
            <tr>
              <Th>Product</Th>
              <Th className="text-right">Qty</Th>
              <Th className="text-right">Revenue</Th>
              <Th className="text-right">Profit Margin</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td colSpan={4} className="text-center text-coffee/70 py-8">No sales data available yet</Td>
            </tr>
          </tbody>
        </Table>
      </section>
    </div>
  )
}
