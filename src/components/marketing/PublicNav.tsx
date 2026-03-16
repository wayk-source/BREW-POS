import Link from 'next/link'
import { Coffee } from 'lucide-react'

export function PublicNav() {
  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-mocha)] text-cream">
            <Coffee size={18} />
          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold text-[color:var(--color-coffee)]">BREW POS</div>
            <div className="text-[10px] text-[color:var(--color-caramel)] -mt-1">Café Platform</div>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-xl text-[color:var(--color-coffee)] hover:bg-black/5">
            Login
          </Link>
          <Link href="/admin" className="button buttonPrimary">
            View Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}
