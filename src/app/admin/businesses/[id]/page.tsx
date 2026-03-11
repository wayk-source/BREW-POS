'use server'

import { notFound } from 'next/navigation'
import { businesses, expiringSubscriptions } from '../../../../lib/data'

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const biz =
    businesses.find(b => b.id === id) ??
    expiringSubscriptions.find(b => b.id === id)
  if (!biz) return notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-coffee">{biz.name}</h1>
        <p className="text-sm text-coffee/70">Business Profile</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 space-y-2">
          <h2 className="text-lg font-semibold text-coffee">General Information</h2>
          <div className="text-sm">
            <div><span className="font-medium">Owner:</span> {biz.ownerName}</div>
            <div><span className="font-medium">Contact Email:</span> {biz.contactEmail}</div>
            <div><span className="font-medium">Contact Phone:</span> {biz.contactPhone}</div>
            <div><span className="font-medium">Registered:</span> {biz.registrationDate}</div>
          </div>
        </div>
        <div className="card p-4 space-y-2">
          <h2 className="text-lg font-semibold text-coffee">Subscription Plan Details</h2>
          <div className="text-sm">
            <div><span className="font-medium">Plan:</span> {biz.plan}</div>
            <div><span className="font-medium">Expires:</span> {new Date(biz.expirationDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</div>
            <div><span className="font-medium">Days Remaining:</span> {biz.daysRemaining}</div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className={`chip ${biz.status === 'Expiring' ? 'chip-warn' : 'chip-success'}`}>
                {biz.status ?? 'Active'}
              </span>
            </div>
          </div>
        </div>
        <div className="card p-4 space-y-2">
          <h2 className="text-lg font-semibold text-coffee">Summary</h2>
          <div className="text-sm">
            <div><span className="font-medium">Number of Users:</span> 12</div>
            <div><span className="font-medium">Recent Activity:</span> Renewed plan last month</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-base font-semibold text-coffee mb-2">Subscription Status</h3>
          <div className="h-4 w-full bg-cream rounded-lg overflow-hidden">
            <div
              className={`h-full ${biz.status === 'Expiring' ? 'bg-amber-400' : 'bg-green-500'}`}
              style={{ width: `${Math.max(0, Math.min(100, (biz.daysRemaining / 30) * 100))}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-coffee/70">Visualization based on days remaining</div>
        </div>
        <div className="card p-4">
          <h3 className="text-base font-semibold text-coffee mb-2">Payment History</h3>
          <ul className="text-sm space-y-1">
            <li>2026-02-10 • PHP 1,499 • Premium • Paid</li>
            <li>2026-01-10 • PHP 1,499 • Premium • Paid</li>
            <li>2025-12-10 • PHP 1,499 • Premium • Paid</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
