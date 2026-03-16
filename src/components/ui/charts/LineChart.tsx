import { useMemo } from 'react'

type Point = { label: string; value: number }

export function LineChart({
  data,
  height = 160,
  stroke = '#6F4E37',
  fill = 'rgba(193, 154, 107, 0.18)',
}: {
  data: Point[]
  height?: number
  stroke?: string
  fill?: string
}) {
  const { path, area, min, max } = useMemo(() => {
    const w = 1000
    const h = 1000
    const padX = 30
    const padY = 60
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
    return { path: p, area: a, min: minV, max: maxV }
  }, [data])

  return (
    <div className="w-full">
      <svg viewBox="0 0 1000 1000" className="w-full" style={{ height }}>
        <path d={area} fill={fill} />
        <path d={path} fill="none" stroke={stroke} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
        <text x="30" y="50" fontSize="34" fill="rgba(75,46,43,0.6)">{Math.round(max).toLocaleString()}</text>
        <text x="30" y="980" fontSize="34" fill="rgba(75,46,43,0.4)">{Math.round(min).toLocaleString()}</text>
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-coffee/60">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  )
}

