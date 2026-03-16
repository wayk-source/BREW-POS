'use client'

import Link from 'next/link'
import { CreditCard, FileText } from 'lucide-react'

export default function OwnerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-coffee">Settings</h1>
        <p className="text-sm text-coffee/70">Configure subscription, billing, and invoice preferences</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link href="/owner/settings/subscription" className="card p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-cream text-coffee flex items-center justify-center border border-black/5">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <div className="text-base font-semibold text-coffee">Subscription</div>
              <div className="text-sm text-coffee/70">Plan type, billing, payment history, expiration</div>
            </div>
          </div>
        </Link>

        <Link href="/owner/settings/invoice" className="card p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-cream text-coffee flex items-center justify-center border border-black/5">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="text-base font-semibold text-coffee">Invoice Settings</div>
              <div className="text-sm text-coffee/70">Logo, store details, receipt layout information</div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  )
}

