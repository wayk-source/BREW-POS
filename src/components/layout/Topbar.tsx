import { Bell, Search } from 'lucide-react'

export function Topbar() {
  const today = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-3xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-coffee/45" />
          <input
            type="text"
            placeholder="Search businesses, users, subscriptions..."
            className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] focus:ring-2 focus:ring-caramel/40 outline-none"
          />
          </div>

          <button
            aria-label="Notifications"
            className="relative h-11 w-11 inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-coffee/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 inline-block h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="hidden sm:block text-sm text-coffee/70">{today}</div>
        </div>
      </div>
    </header>
  )
}
