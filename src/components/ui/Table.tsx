import { ReactNode } from 'react'

export function Table({
  children,
  variant = 'card',
  className = '',
}: {
  children: ReactNode
  variant?: 'card' | 'plain'
  className?: string
}) {
  const wrapperClassName =
    variant === 'card' ? `overflow-hidden card ${className}` : `overflow-hidden ${className}`
  return (
    <div className={wrapperClassName}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          {children}
        </table>
      </div>
    </div>
  )
}

export function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-coffee/70 bg-cream/80 border-b border-black/5 ${className}`}>
      {children}
    </th>
  )
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 border-t border-black/5 text-coffee/90 ${className}`}>
      {children}
    </td>
  )
}
