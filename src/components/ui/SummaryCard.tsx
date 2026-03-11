import Link from 'next/link'
import { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  title: string
  value: number | string
  icon: ReactNode
  hint?: string
  href?: string
  tone?: 'default' | 'success' | 'warn'
}

const toneClasses: Record<NonNullable<Props['tone']>, string> = {
  default: 'bg-cream text-coffee',
  success: 'bg-green-50 text-green-700',
  warn: 'bg-amber-50 text-amber-700',
}

export function SummaryCard({ title, value, icon, hint, href, tone = 'default' }: Props) {
  const inner = (
    <div className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow min-h-24">
      <div>
        <div className="text-sm text-coffee/70">{title}</div>
        <div className="mt-1 text-3xl font-semibold text-coffee">{value}</div>
        <div className={`mt-1 text-xs text-coffee/60 ${hint ? '' : 'invisible'}`}>
          {hint ?? 'placeholder'}
        </div>
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
