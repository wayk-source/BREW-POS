'use client'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-coffee">System Settings</h1>
        <p className="text-sm text-coffee/70">
          Configure subscription plans, pricing (PHP), platform settings, notifications, policies
        </p>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold text-coffee">Subscription Plans & Pricing (PHP)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-coffee/70">Basic</label>
              <input className="mt-1 w-full px-3 py-2 rounded-lg bg-cream border border-black/10" defaultValue="499" />
            </div>
            <div>
              <label className="text-sm text-coffee/70">Standard</label>
              <input className="mt-1 w-full px-3 py-2 rounded-lg bg-cream border border-black/10" defaultValue="999" />
            </div>
            <div>
              <label className="text-sm text-coffee/70">Premium</label>
              <input className="mt-1 w-full px-3 py-2 rounded-lg bg-cream border border-black/10" defaultValue="1499" />
            </div>
          </div>
          <button className="px-3 py-2 rounded-lg bg-mocha text-cream">Save Pricing</button>
        </form>
        <form className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold text-coffee">Platform Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Enable email verifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Allow branch-level managers
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Require strong passwords
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Enable 2FA
            </label>
          </div>
          <button className="px-3 py-2 rounded-lg bg-mocha text-cream">Save Settings</button>
        </form>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold text-coffee">System Notifications</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Subscription expiring alerts
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Payment receipt emails
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Weekly activity digest
            </label>
          </div>
          <button className="px-3 py-2 rounded-lg bg-mocha text-cream">Save Notifications</button>
        </form>
        <form className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold text-coffee">Account Policies</h2>
          <textarea
            rows={6}
            className="w-full px-3 py-2 rounded-lg bg-cream border border-black/10"
            defaultValue="Define account usage policies, roles, and permissions."
          />
          <button className="px-3 py-2 rounded-lg bg-mocha text-cream">Save Policies</button>
        </form>
      </section>
    </div>
  )
}
