'use client'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-coffee">Settings</h1>
      <p className="text-coffee/70">Manage your account and preferences.</p>
      
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
        <h2 className="text-lg font-semibold text-coffee mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-coffee/70">Name</label>
            <input type="text" value="David Kim" disabled className="mt-1 block w-full rounded-xl border-black/10 bg-cream/20 text-coffee" />
          </div>
          <div>
            <label className="block text-sm font-medium text-coffee/70">Role</label>
            <input type="text" value="Store Manager" disabled className="mt-1 block w-full rounded-xl border-black/10 bg-cream/20 text-coffee" />
          </div>
          <div>
            <label className="block text-sm font-medium text-coffee/70">Email</label>
            <input type="email" value="manager@brewpos.com" disabled className="mt-1 block w-full rounded-xl border-black/10 bg-cream/20 text-coffee" />
          </div>
        </div>
      </div>
    </div>
  )
}
