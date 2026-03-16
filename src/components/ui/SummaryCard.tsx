import Link from 'next/link'
import { ReactNode } from 'react'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'

interface Props {
  title: string
  value: number | string
  icon: ReactNode
  hint?: string
  href?: string
  tone?: 'default' | 'success' | 'warn'
  deltaPercent?: number
}

const toneClasses: Record<NonNullable<Props['tone']>, string> = {
  default: 'bg-cream text-coffee',
  success: 'bg-green-50 text-green-700',
  warn: 'bg-amber-50 text-amber-700',
}

export function SummaryCard({ title, value, icon, hint, href, tone = 'default', deltaPercent }: Props) {
  const hasDelta = typeof deltaPercent === 'number' && !Number.isNaN(deltaPercent)
  const up = hasDelta ? deltaPercent! >= 0 : false
  const pctText = hasDelta ? `${Math.abs(deltaPercent!).toFixed(1)}%` : ''
  const inner = (
    <div className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow min-h-24">
      <div>
        <div className="text-sm text-coffee/70">{title}</div>
        <div className="mt-1 text-3xl font-semibold text-coffee">{value}</div>
        {hasDelta ? (
          <div className="mt-1 inline-flex items-center gap-1 text-xs">
            {up ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-600" />
            )}
            <span className={`${up ? 'text-green-700' : 'text-red-700'} font-medium`}>{pctText}</span>
            <span className="text-coffee/60">vs prev day</span>
          </div>
        ) : (
          <div className={`mt-1 text-xs text-coffee/60 ${hint ? '' : 'invisible'}`}>
            {hint ?? 'placeholder'}
          </div>
        )}
      </div>
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${toneClasses[tone]}`}>
        {icon}
      </div>
      {href && <ArrowUpRight className="ml-2 h-5 w-5 text-coffee/40 shrink-0" />}
    </div>
  )
  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    )
  }
  return inner
}
