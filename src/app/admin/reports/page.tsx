'use client'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-coffee">Reports</h1>
        <p className="text-sm text-coffee/70">
          Platform analytics, revenue trends, plan distribution, and user activity
        </p>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="text-base font-semibold text-coffee">Subscription Revenue (PHP)</h3>
          <div className="mt-3 space-y-2">
            {[1499, 999, 499].map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-24 text-xs text-coffee/70">Month {i + 1}</div>
                <div className="flex-1 h-4 bg-cream rounded">
                  <div
                    className="h-4 bg-caramel rounded"
                    style={{ width: `${(val / 2000) * 100}%` }}
                  />
                </div>
                <div className="w-20 text-xs text-coffee/70">₱{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <h3 className="text-base font-semibold text-coffee">Plan Distribution</h3>
          <ul className="mt-3 text-sm space-y-1">
            <li>Premium • 40%</li>
            <li>Standard • 35%</li>
            <li>Basic • 25%</li>
          </ul>
        </div>
        <div className="card p-4">
          <h3 className="text-base font-semibold text-coffee">User Activity</h3>
          <ul className="mt-3 text-sm space-y-1">
            <li>Active Users Today • 328</li>
            <li>Peak Login Hour • 9:00–10:00 AM</li>
            <li>Idle Users • 12%</li>
          </ul>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-base font-semibold text-coffee">Summary Table</h3>
          <table className="mt-3 min-w-full text-sm">
            <thead>
              <tr className="bg-cream">
                <th className="px-3 py-2 text-left">Metric</th>
                <th className="px-3 py-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2">Subscribed Businesses</td>
                <td className="px-3 py-2">1247</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Active Subscriptions</td>
                <td className="px-3 py-2">1089</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Expiring Subscriptions</td>
                <td className="px-3 py-2">47</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card p-4">
          <h3 className="text-base font-semibold text-coffee">Insights</h3>
          <p className="text-sm text-coffee/70 mt-2">
            Premium plan adoption continues to grow. Expiring subscriptions track predictably with
            renewal cycles. User activity peaks in the morning hours.
          </p>
        </div>
      </section>
    </div>
  )
}
