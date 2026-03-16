'use client'

import { useMemo, useState } from 'react'
import { CreditCard, TrendingUp, ShoppingBag, Users2 } from 'lucide-react'
import { SummaryCard } from '../../components/ui/SummaryCard'
import { Table, Th, Td } from '../../components/ui/Table'
import { TimeSeriesChart } from '../../components/ui/charts/TimeSeriesChart'
import { MultiLineChart } from '../../components/ui/charts/MultiLineChart'
import { employeesSeed, ownerBusiness, saleRecordsSeed, topByCategoryToday, peakHoursSeed } from '../../lib/owner-data'

export default function OwnerHome() {
  const [range, setRange] = useState<'Daily'>('Daily')

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
    const start = new Date(rangeStart)
    const end = new Date(rangeEnd)
    const inRange = saleRecordsSeed.filter(r => {
      const d = new Date(r.date)
      return d >= start && d <= end
    })
    // Build day maps
    const byDateNet = new Map<string, number>()
    const byDateGross = new Map<string, number>()
    const byDateOrders = new Map<string, number>()
    inRange.forEach(r => {
      byDateNet.set(r.date, (byDateNet.get(r.date) ?? 0) + r.netSales)
      byDateGross.set(r.date, (byDateGross.get(r.date) ?? 0) + r.grossSales)
      byDateOrders.set(r.date, (byDateOrders.get(r.date) ?? 0) + r.orders)
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
    const totalOrdersRange = Array.from(byDateOrders.values()).reduce((s, v) => s + v, 0)
    const todayGross = byDateGross.get(today) ?? 0
    const totalNetRange = Array.from(byDateNet.values()).reduce((s, v) => s + v, 0)
    // Delta % compare Today vs Previous day using the SAME dataset
    const netToday = byDateNet.get(today) ?? 0
    const netPrev = byDateNet.get(prev) ?? 0
    const todayGrossPrev = byDateGross.get(prev) ?? 0
    const totalDeltaPct = netPrev > 0 ? ((netToday - netPrev) / netPrev) * 100 : (netToday > 0 ? 100 : 0)
    const todayDeltaPct = todayGrossPrev > 0 ? ((todayGross - todayGrossPrev) / todayGrossPrev) * 100 : (todayGross > 0 ? 100 : 0)
    const active = employeesSeed.filter(e => e.status === 'Active').length
    return {
      totalSalesNetRange: totalNetRange,
      totalOrdersRange,
      todayGrossSales: todayGross,
      activeEmployees: active,
      totalDeltaPct,
      todayDeltaPct,
      seriesAll,
      byDateNet,
      days,
    }
  }, [rangeStart, rangeEnd])

  const [view, setView] = useState<'7' | '30' | 'all'>('all')
  const visibleSeries = useMemo(() => {
    if (view === '7') return seriesAll.slice(-7)
    if (view === '30') return seriesAll.slice(-30)
    return seriesAll
  }, [seriesAll, view])

  // Category movement derived from specific daily data
  const categorySeries = useMemo(() => {
    const toLabel = (d: string) => {
      const dt = new Date(d)
      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Hardcoded data based on user request
    const dailyData: Record<string, { coffee: number; tea: number; snack: number }> = {
      '2026-03-01': { coffee: 4200, tea: 1600, snack: 2400 },
      '2026-03-02': { coffee: 5200, tea: 2100, snack: 3200 },
      '2026-03-03': { coffee: 4800, tea: 1900, snack: 3000 },
      '2026-03-04': { coffee: 5600, tea: 2200, snack: 3500 },
      '2026-03-05': { coffee: 6100, tea: 2400, snack: 3600 },
      '2026-03-06': { coffee: 5400, tea: 2100, snack: 3300 },
      '2026-03-07': { coffee: 6700, tea: 2600, snack: 4200 },
      '2026-03-08': { coffee: 7600, tea: 3000, snack: 4600 },
      '2026-03-09': { coffee: 7000, tea: 2700, snack: 4400 },
      '2026-03-10': { coffee: 8400, tea: 3200, snack: 5200 },
      '2026-03-11': { coffee: 6400, tea: 2500, snack: 4000 },
      '2026-03-12': { coffee: 6600, tea: 2600, snack: 4000 },
    }

    const coffee: { label: string; value: number }[] = []
    const tea: { label: string; value: number }[] = []
    const snack: { label: string; value: number }[] = []

    days.forEach((day) => {
      const data = dailyData[day] || { coffee: 0, tea: 0, snack: 0 }
      coffee.push({ label: toLabel(day), value: data.coffee })
      tea.push({ label: toLabel(day), value: data.tea })
      snack.push({ label: toLabel(day), value: data.snack })
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

  const avgOrderValue = useMemo(() => {
    const sum = seriesAll.reduce((s, p) => s + p.value, 0)
    const orders = saleRecordsSeed
      .filter(r => new Date(r.date) >= new Date(rangeStart) && new Date(r.date) <= new Date(rangeEnd))
      .reduce((acc, r) => acc + r.orders, 0)
    return orders > 0 ? sum / orders : 0
  }, [seriesAll, rangeStart, rangeEnd])

  const peakHour = useMemo(() => {
    const row = peakHoursSeed.reduce((a, b) => (b.orders > a.orders ? b : a))
    return row.hour
  }, [])

  const dateRangeLabel = useMemo(() => {
    const s = new Date(rangeStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const e = new Date(rangeEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${s} – ${e}`
  }, [rangeStart, rangeEnd])

  const topItems = useMemo(() => {
    return [
      { name: 'Cappuccino', qty: 86, revenue: 13680, margin: 0.42 },
      { name: 'Caramel Latte', qty: 74, revenue: 12950, margin: 0.39 },
      { name: 'Americano', qty: 91, revenue: 10920, margin: 0.44 },
      { name: 'Butter Croissant', qty: 63, revenue: 5985, margin: 0.36 },
      { name: 'Matcha Latte', qty: 52, revenue: 8840, margin: 0.33 },
    ]
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-coffee">Owner Dashboard</h1>
          <p className="text-sm text-coffee/70">
            Sales reporting and analytics for {ownerBusiness.name}
          </p>
        </div>
        <div className="flex items-center gap-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Sales"
          value={`${ownerBusiness.currency} ${totalSalesNetRange.toLocaleString()}`}
          icon={<CreditCard className="h-6 w-6" />}
          tone="success"
          deltaPercent={totalDeltaPct}
          hint={dateRangeLabel}
        />
        <SummaryCard
          title="Total Orders"
          value={totalOrdersRange}
          icon={<ShoppingBag className="h-6 w-6" />}
          tone="default"
          hint="Across all stores"
        />
        <SummaryCard
          title="Today Sales"
          value={`${ownerBusiness.currency} ${todayGrossSales.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
          tone="warn"
          deltaPercent={todayDeltaPct}
          hint="Today"
        />
        <SummaryCard
          title="Active Employees"
          value={activeEmployees}
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
            <MultiLineChart
              series={[
                { name: 'Coffee', color: '#FFC107', data: visibleCategories.coffee },
                { name: 'Tea', color: '#4CAF50', data: visibleCategories.tea },
                { name: 'Snack', color: '#E53935', data: visibleCategories.snack },
              ]}
            />
          </div>
        </div>

        <div className="card p-5">
          <div>
            <h2 className="text-base font-semibold text-coffee">Most Purchased Items</h2>
            <p className="text-sm text-coffee/70">By category</p>
          </div>
          <div className="mt-4 space-y-3">
            {(() => {
              const maxQty = Math.max(...topByCategoryToday.map(r => r.qty))
              return topByCategoryToday.map(row => {
                const color = row.category === 'Tea' ? '#4CAF50' : row.category === 'Coffee' ? '#FFC107' : '#E53935'
                const pct = Math.max(5, Math.round((row.qty / maxQty) * 100))
                return (
                  <div key={row.category} className="p-3 rounded-xl bg-cream">
                    <div className="text-xs text-coffee/60">{row.category}</div>
                    <div className="text-sm font-medium text-coffee">{row.item} – {row.qty} orders</div>
                    <div className="mt-2 h-2.5 w-full rounded-full bg-white/60 border border-black/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </section>

      <section className="card p-5">
        <div>
          <h2 className="text-base font-semibold text-coffee">Business Insights</h2>
          <p className="text-sm text-coffee/70">Quick highlights from {dateRangeLabel}</p>
        </div>
        <ul className="mt-3 text-sm space-y-1.5">
          <li>• Best Selling Item: Cappuccino</li>
          <li>• Peak Sales Hour: {peakHour}</li>
          <li>• Best Day: {bestDay.label}</li>
          <li>• Average Order Value: {ownerBusiness.currency} {avgOrderValue.toFixed(0)}</li>
        </ul>
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
            {topItems.map(i => (
              <tr key={i.name} className="hover:bg-cream/60">
                <Td className="font-medium">{i.name}</Td>
                <Td className="text-right">{i.qty}</Td>
                <Td className="text-right">{ownerBusiness.currency} {i.revenue.toLocaleString()}</Td>
                <Td className="text-right">
                  <span className="chip chip-success">{Math.round(i.margin * 100)}%</span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  )
}
