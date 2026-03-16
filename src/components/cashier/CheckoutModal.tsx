'use client'

import { Modal } from '../ui/Modal'
import { useState, useEffect } from 'react'
import { Check, Mail, Banknote, Printer } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  onConfirm: (paymentDetails: { cashReceived: number; change: number; email?: string }) => void
}

export function CheckoutModal({ isOpen, onClose, totalAmount, onConfirm }: CheckoutModalProps) {
  const [cashReceived, setCashReceived] = useState<string>('')
  const [email, setEmail] = useState('')
  const [change, setChange] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCashReceived('')
      setEmail('')
      setChange(0)
    }
  }, [isOpen])

  const handleCashChange = (value: string) => {
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setCashReceived(value)
      const cash = parseFloat(value) || 0
      setChange(Math.max(0, cash - totalAmount))
    }
  }

  const handleConfirm = () => {
    const cash = parseFloat(cashReceived) || 0
    if (cash >= totalAmount) {
      onConfirm({
        cashReceived: cash,
        change: cash - totalAmount,
        email: email || undefined,
      })
    }
  }

  const cashValue = parseFloat(cashReceived) || 0
  const isSufficient = cashValue >= totalAmount

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checkout">
      <div className="space-y-6">
        {/* Total Display */}
        <div className="rounded-xl bg-[#F5EFE6] p-6 text-center border border-[#4B2E2B]/10">
          <p className="text-sm font-medium text-[#6F4E37] uppercase tracking-wide">
            Total Amount Due
          </p>
          <h2 className="mt-2 text-4xl font-bold text-[#4B2E2B]">₱{totalAmount.toFixed(2)}</h2>
        </div>

        {/* Payment Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4B2E2B]/80">Cash Received</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-[#4B2E2B]/40">₱</span>
              </div>
              <input
                type="text"
                value={cashReceived}
                onChange={(e) => handleCashChange(e.target.value)}
                className="block w-full rounded-lg border-[#4B2E2B]/20 bg-white py-3 pl-8 pr-12 text-lg font-bold text-[#4B2E2B] shadow-sm focus:border-[#6F4E37] focus:ring-[#6F4E37] placeholder:text-[#4B2E2B]/20"
                placeholder="0.00"
                autoFocus
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-[#4B2E2B]/40">PHP</span>
              </div>
            </div>
            {/* Quick Cash Buttons */}
            <div className="mt-2 flex gap-2">
              {[100, 200, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleCashChange(amount.toString())}
                  className="rounded-md border border-[#4B2E2B]/10 bg-white px-3 py-1 text-sm font-medium text-[#4B2E2B]/70 hover:bg-[#F5EFE6] hover:text-[#4B2E2B] transition-colors"
                >
                  ₱{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Change Display */}
          <div className="flex items-center justify-between rounded-lg border border-[#4B2E2B]/10 bg-[#F5EFE6]/50 px-4 py-3">
            <span className="text-sm font-medium text-[#4B2E2B]/70">Change Due:</span>
            <span className={`text-xl font-bold ${isSufficient ? 'text-green-600' : 'text-[#4B2E2B]/30'}`}>
              ₱{change.toFixed(2)}
            </span>
          </div>

          {/* Email Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-[#4B2E2B]/80">
              Customer Email <span className="text-[#4B2E2B]/40 font-normal">(Optional)</span>
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-[#4B2E2B]/40" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border-[#4B2E2B]/20 bg-white py-2.5 pl-10 text-[#4B2E2B] shadow-sm focus:border-[#6F4E37] focus:ring-[#6F4E37] sm:text-sm placeholder:text-[#4B2E2B]/30"
                placeholder="customer@example.com"
              />
            </div>
            <p className="mt-1 text-xs text-[#4B2E2B]/50">
              Digital receipt will be sent automatically.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#4B2E2B]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#4B2E2B]/80 shadow-sm hover:bg-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isSufficient}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#6F4E37] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:ring-offset-2 disabled:bg-[#4B2E2B]/20 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="h-5 w-5" />
            Complete Transaction
          </button>
        </div>
      </div>
    </Modal>
  )
}
