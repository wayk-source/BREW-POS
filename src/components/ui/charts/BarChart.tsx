import { useMemo } from 'react'

type Point = { label: string; value: number }

export function BarChart({
  data,
  height = 180,
  color = '#C19A6B',
}: {
  data: Point[]
  height?: number
  color?: string
}) {
  const { bars } = useMemo(() => {
    const max = Math.max(...data.map(d => d.value), 1)
    return {
      bars: data.map(d => ({ ...d, pct: d.value / max })),
    }
  }, [data])

  return (
    <div className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {bars.map(b => (
          <div key={b.label} className="flex-1 flex flex-col items-center justify-end gap-2">
            <div
              className="w-full rounded-lg"
              style={{
                height: `${Math.max(6, b.pct * 100)}%`,
                background: color,
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              }}
              title={`${b.label}: ${b.value}`}
            />
            <div className="text-[10px] text-coffee/60">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

