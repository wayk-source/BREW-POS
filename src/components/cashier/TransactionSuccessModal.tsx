'use client'

import { Modal } from '../ui/Modal'
import { CheckCircle, Printer, Mail, Share2 } from 'lucide-react'

interface TransactionSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  transactionDetails: {
    id: string
    total: number
    change: number
    email?: string
  } | null
}

export function TransactionSuccessModal({
  isOpen,
  onClose,
  transactionDetails,
}: TransactionSuccessModalProps) {
  if (!transactionDetails) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Successful">
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 rounded-full bg-green-100 p-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#4B2E2B]">Transaction Completed!</h2>
        <p className="mt-2 text-sm text-[#4B2E2B]/60">
          Invoice #{transactionDetails.id}
        </p>

        <div className="mt-8 w-full space-y-4 rounded-xl bg-[#F5EFE6]/50 border border-[#4B2E2B]/10 p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-[#4B2E2B]/60">Total Amount</span>
            <span className="font-bold text-[#4B2E2B]">₱{transactionDetails.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#4B2E2B]/60">Change</span>
            <span className="font-bold text-[#4B2E2B]">₱{transactionDetails.change.toFixed(2)}</span>
          </div>
          {transactionDetails.email && (
            <div className="flex justify-between text-sm">
              <span className="text-[#4B2E2B]/60">Receipt Sent to</span>
              <span className="font-medium text-[#4B2E2B] truncate max-w-[200px]">{transactionDetails.email}</span>
            </div>
          )}
        </div>

        <div className="mt-8 grid w-full grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-[#4B2E2B]/20 bg-white py-3 text-sm font-medium text-[#4B2E2B]/80 shadow-sm hover:bg-[#F5EFE6] active:scale-[0.98] transition-colors">
            <Printer className="h-4 w-4" />
            Print Receipt
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-[#4B2E2B]/20 bg-white py-3 text-sm font-medium text-[#4B2E2B]/80 shadow-sm hover:bg-[#F5EFE6] active:scale-[0.98] transition-colors">
            <Mail className="h-4 w-4" />
            Resend Email
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#6F4E37] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#4B2E2B] hover:shadow-xl active:scale-[0.98]"
        >
          New Transaction
        </button>
      </div>
    </Modal>
  )
}
