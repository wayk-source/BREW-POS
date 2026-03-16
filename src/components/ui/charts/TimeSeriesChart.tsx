import { useMemo } from 'react'

type Point = { label: string; value: number }

export function TimeSeriesChart({
  data,
  height = 200,
  stroke = '#6F4E37',
  fill = 'rgba(193, 154, 107, 0.18)',
}: {
  data: Point[]
  height?: number
  stroke?: string
  fill?: string
}) {
  const { path, area, circles, min, max, labels } = useMemo(() => {
    const w = 1000
    const h = 1000
    const padX = 60
    const padY = 80
    const values = data.map(d => d.value)
    const minV = Math.min(...values, 0)
    const maxV = Math.max(...values, 1)
    const range = maxV - minV || 1
    const xStep = data.length > 1 ? (w - padX * 2) / (data.length - 1) : 0
    const pts = data.map((d, i) => {
      const x = padX + i * xStep
      const y = padY + (h - padY * 2) - ((d.value - minV) / range) * (h - padY * 2)
      return { x, y }
    })
    const p = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')
    const a = `${p} L ${(w - padX).toFixed(1)} ${(h - padY).toFixed(1)} L ${padX.toFixed(1)} ${(h - padY).toFixed(1)} Z`
    const c = pts.map((pt, i) => ({ cx: pt.x, cy: pt.y, key: i }))
    const labels = {
      start: data[0]?.label ?? '',
      mid: data[Math.floor(data.length / 2)]?.label ?? '',
      end: data[data.length - 1]?.label ?? '',
    }
    return { path: p, area: a, circles: c, min: minV, max: maxV, labels }
  }, [data])

  const gridLines = 4

  return (
    <div className="w-full">
      <svg viewBox="0 0 1000 1000" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} />
            <stop offset="100%" stopColor="rgba(193,154,107,0.06)" />
          </linearGradient>
        </defs>
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = 80 + i * ((1000 - 160) / gridLines)
          return <line key={i} x1="60" y1={y} x2="940" y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
        })}
        <rect x="60" y="80" width="880" height="840" fill="transparent" />
        <path d={area} fill="url(#grad)" />
        <path d={path} fill="none" stroke={stroke} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
        {circles.map(c => (
          <circle key={c.key} cx={c.cx} cy={c.cy} r="10" fill="#FFFFFF" stroke={stroke} strokeWidth="8" />
        ))}
        <text x="60" y="60" fontSize="34" fill="rgba(75,46,43,0.6)">{Math.round(max).toLocaleString()}</text>
        <text x="60" y="980" fontSize="34" fill="rgba(75,46,43,0.4)">{Math.round(min).toLocaleString()}</text>
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-coffee/60">
        <span>{labels.start}</span>
        <span>{labels.mid}</span>
        <span>{labels.end}</span>
      </div>
    </div>
  )
}

