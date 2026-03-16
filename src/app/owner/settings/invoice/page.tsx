'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useLocalStorageState } from '../../../../lib/useLocalStorageState'

type InvoiceSettings = {
  logoDataUrl?: string
  businessName: string
  address: string
  phone: string
  email: string
  footerNote: string
}

export default function OwnerInvoiceSettingsPage() {
  const [settings, setSettings] = useLocalStorageState<InvoiceSettings>('owner.invoice', {
    businessName: 'Brew Haven Café',
    address: '123 Coffee St, Downtown',
    phone: '+63 912 345 6789',
    email: 'hello@brewpos.com',
    footerNote: 'Thank you for your purchase!',
  })

  const [uploading, setUploading] = useState(false)

  const preview = useMemo(() => {
    return settings.logoDataUrl ?? null
  }, [settings.logoDataUrl])

  async function onLogoChange(file: File | null) {
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
      setSettings({ ...settings, logoDataUrl: dataUrl })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-coffee">Invoice Settings</h1>
        <p className="text-sm text-coffee/70">Customize receipt/invoice details for your stores</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form className="card p-5 space-y-4">
          <div className="text-base font-semibold text-coffee">Business Details</div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-sm text-coffee/70">Business Name</label>
              <input
                value={settings.businessName}
                onChange={e => setSettings({ ...settings, businessName: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40"
              />
            </div>
            <div>
              <label className="text-sm text-coffee/70">Address</label>
              <input
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-coffee/70">Phone</label>
                <input
                  value={settings.phone}
                  onChange={e => setSettings({ ...settings, phone: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40"
                />
              </div>
              <div>
                <label className="text-sm text-coffee/70">Email</label>
                <input
                  value={settings.email}
                  onChange={e => setSettings({ ...settings, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-coffee/70">Footer Note</label>
              <input
                value={settings.footerNote}
                onChange={e => setSettings({ ...settings, footerNote: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="text-sm text-coffee/70">Logo</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={e => onLogoChange(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-coffee/70"
                disabled={uploading}
              />
            </div>
            <div className="mt-2 text-xs text-coffee/60">
              {uploading ? 'Uploading…' : 'Logo is saved locally in this browser.'}
            </div>
          </div>
        </form>

        <div className="card p-5">
          <div className="text-base font-semibold text-coffee">Preview</div>
          <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-xl bg-cream border border-black/5 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <div className="relative h-full w-full">
                    <Image src={preview} alt="Logo" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="text-xs text-coffee/60">Logo</div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-coffee">{settings.businessName}</div>
                <div className="text-xs text-coffee/70">{settings.address}</div>
                <div className="text-xs text-coffee/70">{settings.phone} • {settings.email}</div>
              </div>
            </div>
            <div className="mt-4 border-t border-black/5 pt-3">
              <div className="flex justify-between text-xs text-coffee/70">
                <span>Americano</span>
                <span>PHP 120</span>
              </div>
              <div className="flex justify-between text-xs text-coffee/70">
                <span>Butter Croissant</span>
                <span>PHP 95</span>
              </div>
              <div className="mt-3 flex justify-between text-sm font-semibold text-coffee">
                <span>Total</span>
                <span>PHP 215</span>
              </div>
              <div className="mt-3 text-center text-xs text-coffee/60">{settings.footerNote}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

