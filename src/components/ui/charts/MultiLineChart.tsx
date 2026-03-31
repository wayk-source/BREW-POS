import { useMemo } from 'react'

type Point = { label: string; value: number }
type Series = {
  name: string
  color: string
  data: Point[]
}

export function MultiLineChart({
  series,
  height = 300,
}: {
  series: Series[]
  height?: number
}) {
  const isEmpty = series.length === 0 || series.every(s => !s.data?.length)

  if (isEmpty) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-coffee/40 bg-cream/50 text-center px-4">
        <div>
          <p className="text-lg font-semibold text-coffee/80">No data available</p>
          <p className="text-sm text-coffee/60">Chart is unavailable until sales data is recorded.</p>
        </div>
      </div>
    )
  }

  const { paths, areas, min, max, gridLines, xLabels } = useMemo(() => {
    const w = 1000
    const h = 500
    const padX = 40
    const padY = 40
    const chartH = h - padY * 2
    
    const allValues = series.flatMap(s => s.data.map(p => p.value))
    const minV = Math.min(...allValues, 0)
    const maxV = Math.max(...allValues, 1) * 1.1 // Add some headroom
    const range = maxV - minV || 1
    
    const labels = series[0]?.data.map(p => p.label) ?? []
    const xStep = labels.length > 1 ? (w - padX * 2) / (labels.length - 1) : 0

    const mapPoint = (val: number, idx: number) => {
      const x = padX + idx * xStep
      const y = padY + chartH - ((val - minV) / range) * chartH
      return { x, y }
    }

    const mkPath = (points: Point[]) => {
      return points.map((d, i) => {
        const { x, y } = mapPoint(d.value, i)
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      }).join(' ')
    }

    const mkArea = (points: Point[]) => {
      const linePath = mkPath(points)
      const first = mapPoint(points[0].value, 0)
      const last = mapPoint(points[points.length - 1].value, points.length - 1)
      const bottomY = padY + chartH
      return `${linePath} L ${last.x.toFixed(1)} ${bottomY} L ${first.x.toFixed(1)} ${bottomY} Z`
    }

    // Grid lines
    const gridLines = {
      vertical: labels.map((_, i) => {
        const x = padX + i * xStep
        return { x1: x, y1: padY, x2: x, y2: padY + chartH }
      }),
      horizontal: [0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = padY + chartH - t * chartH
        return { x1: padX, y1: y, x2: w - padX, y2: y }
      })
    }

    // X Labels
    const xLabels = labels.map((l, i) => ({
      x: padX + i * xStep,
      y: h - 10,
      text: l
    }))

    return {
      paths: series.map(s => ({ name: s.name, color: s.color, d: mkPath(s.data) })),
      areas: series.map(s => ({ name: s.name, color: s.color, d: mkArea(s.data) })),
      min: minV,
      max: maxV,
      gridLines,
      xLabels
    }
  }, [series])

  return (
    <div className="w-full">
      <svg viewBox="0 0 1000 500" className="w-full" style={{ height }} preserveAspectRatio="none">
        {/* Background Grid */}
        <g stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round">
          {gridLines.vertical.map((l, i) => (
            <line key={`v-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
          {gridLines.horizontal.map((l, i) => (
            <line key={`h-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>

        {/* Areas (only for Coffee/Yellow usually, but let's render all with low opacity if needed, or just the first one) */}
        {areas.filter(a => a.name === 'Coffee').map(a => (
          <path key={a.name} d={a.d} fill={a.color} fillOpacity="0.15" />
        ))}

        {/* Lines */}
        {paths.map(p => (
          <path 
            key={p.name} 
            d={p.d} 
            fill="none" 
            stroke={p.color} 
            strokeWidth="5" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
          />
        ))}

        {/* X Axis Labels */}
        <g className="text-[20px] fill-coffee/60 font-medium" textAnchor="middle">
          {xLabels.map((l, i) => (
            <text key={i} x={l.x} y={l.y}>{l.text}</text>
          ))}
        </g>
      </svg>

      <div className="mt-4 flex items-center justify-center gap-6">
        {series.map(s => (
          <div key={s.name} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span className="text-sm font-medium text-coffee/80">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
