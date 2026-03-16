'use client'

import { useMemo } from 'react'
import { Table, Th, Td } from '../../../../components/ui/Table'
import { ownerBusiness } from '../../../../lib/owner-data'

export default function OwnerSubscriptionPage() {
  const subscription = useMemo(() => {
    return {
      plan: 'Premium',
      status: 'Active',
      renewsOn: '2026-05-16',
      billingEmail: 'owner@brewpos.com',
      paymentMethod: 'Card •••• 4242',
    }
  }, [])

  const history = useMemo(() => {
    return [
      { id: 'p1', date: '2026-02-10', amount: 1499, status: 'Paid', invoice: 'INV-2026-0210' },
      { id: 'p2', date: '2026-01-10', amount: 1499, status: 'Paid', invoice: 'INV-2026-0110' },
      { id: 'p3', date: '2025-12-10', amount: 1499, status: 'Paid', invoice: 'INV-2025-1210' },
    ]
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-coffee">Subscription</h1>
        <p className="text-sm text-coffee/70">View plan details, billing, and payment history</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 space-y-2">
          <div className="text-sm text-coffee/70">Plan</div>
          <div className="text-2xl font-semibold text-coffee">{subscription.plan}</div>
          <div className="flex items-center gap-2">
            <span className="chip chip-success">{subscription.status}</span>
            <span className="text-sm text-coffee/70">Renews on {subscription.renewsOn}</span>
          </div>
        </div>

        <div className="card p-5 space-y-2">
          <div className="text-sm text-coffee/70">Billing</div>
          <div className="text-sm text-coffee">
            <div><span className="text-coffee/70">Email:</span> {subscription.billingEmail}</div>
            <div><span className="text-coffee/70">Payment:</span> {subscription.paymentMethod}</div>
          </div>
          <button className="mt-2 px-4 py-2.5 rounded-xl bg-[color:var(--color-mocha)] text-cream hover:brightness-95 w-fit">
            Update Billing
          </button>
        </div>

        <div className="card p-5 space-y-2">
          <div className="text-sm text-coffee/70">Usage</div>
          <div className="text-sm text-coffee">
            <div><span className="text-coffee/70">Stores:</span> 2 / Unlimited</div>
            <div><span className="text-coffee/70">Employees:</span> 12 / Unlimited</div>
            <div><span className="text-coffee/70">Support:</span> Priority</div>
          </div>
          <button className="mt-2 px-4 py-2.5 rounded-xl bg-white/80 border border-black/10 text-coffee hover:bg-black/5 w-fit">
            Manage Plan
          </button>
        </div>
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-black/5">
          <h2 className="text-base font-semibold text-coffee">Payment History</h2>
          <p className="text-sm text-coffee/70">Past invoices and payment status</p>
        </div>
        <Table variant="plain">
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Invoice</Th>
              <Th className="text-right">Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id} className="hover:bg-cream/60">
                <Td className="font-medium">{h.date}</Td>
                <Td>{h.invoice}</Td>
                <Td className="text-right">{ownerBusiness.currency} {h.amount.toLocaleString()}</Td>
                <Td><span className="chip chip-success">{h.status}</span></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  )
}

