'use client'

import { MenuItem } from '../../lib/manager-data'
import { Trash2, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react'

export interface CartItem extends MenuItem {
  quantity: number
}

interface CartPanelProps {
  cart: CartItem[]
  subtotal: number
  tax: number
  total: number
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
}

export function CartPanel({ cart, subtotal, tax, total, onUpdateQuantity, onRemoveItem, onCheckout }: CartPanelProps) {
  return (
    <div className="flex h-[40vh] w-full flex-col border-t border-[#4B2E2B]/10 bg-white shadow-xl md:h-full md:w-96 md:border-l md:border-t-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#4B2E2B]/10 p-6 bg-[#F5EFE6]/30">
        <h2 className="flex items-center gap-2 text-xl font-bold text-[#4B2E2B]">
          <ShoppingBag className="h-6 w-6 text-[#6F4E37]" />
          Current Order
        </h2>
        <span className="rounded-full bg-[#6F4E37]/10 px-3 py-1 text-xs font-medium text-[#6F4E37]">
          Order #1234
        </span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F5EFE6]/10">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-[#4B2E2B]/40">
            <ShoppingBag className="mb-4 h-16 w-16 opacity-20" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Select items from the menu to add to order</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-white p-3 transition-all hover:bg-[#F5EFE6] border border-[#4B2E2B]/5"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <h4 className="font-medium text-[#4B2E2B]">{item.name}</h4>
                  <p className="text-sm font-semibold text-[#6F4E37]">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg bg-white shadow-sm ring-1 ring-[#4B2E2B]/10">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-[#4B2E2B]/60 hover:text-[#6F4E37] active:scale-90"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-[#4B2E2B]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-[#4B2E2B]/60 hover:text-[#6F4E37] active:scale-90"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="rounded-lg p-2 text-[#4B2E2B]/40 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Totals */}
      <div className="border-t border-[#4B2E2B]/10 bg-white p-6">
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between text-[#4B2E2B]/60">
            <span>Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#4B2E2B]/60">
            <span>VAT (12%)</span>
            <span>₱{tax.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-[#4B2E2B]/10 pt-4 text-xl font-bold text-[#4B2E2B]">
            <span>Total</span>
            <span className="text-[#6F4E37]">₱{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F4E37] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#4B2E2B] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#4B2E2B]/20 disabled:shadow-none"
        >
          <CreditCard className="h-5 w-5" />
          Pay Now
        </button>
      </div>
    </div>
  )
}
