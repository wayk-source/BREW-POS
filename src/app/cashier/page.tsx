'use client'

import { useState } from 'react'
import { ProductGrid } from '../../components/cashier/ProductGrid'
import { CartPanel, CartItem } from '../../components/cashier/CartPanel'
import { CheckoutModal } from '../../components/cashier/CheckoutModal'
import { TransactionSuccessModal } from '../../components/cashier/TransactionSuccessModal'
import { menuItems, MenuItem } from '../../lib/manager-data'

import { BrewPosLogo } from '../../components/ui/BrewPosLogo'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

export default function CashierPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<{
    id: string
    total: number
    change: number
    email?: string
  } | null>(null)

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.12 // 12% VAT
  const total = subtotal + tax

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleCheckout = () => {
    setIsCheckoutOpen(true)
  }

  const handleConfirmPayment = (paymentDetails: {
    cashReceived: number
    change: number
    email?: string
  }) => {
    const transactionId = `TRX-${Date.now().toString().slice(-6)}`

    // In a real app, you would save the transaction here via API

    setLastTransaction({
      id: transactionId,
      total,
      change: paymentDetails.change,
      email: paymentDetails.email,
    })

    setIsCheckoutOpen(false)
    setIsSuccessOpen(true)
    setCart([])
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F5EFE6] md:flex-row">
      {/* Main Content - Product Grid */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-[#4B2E2B]/10 bg-white/70 px-6 backdrop-blur-md shadow-sm">
          <BrewPosLogo />
          <div className="flex items-center gap-4 relative">
            <span className="text-sm font-medium text-[#4B2E2B]/70 hidden sm:block">
              Cashier: <span className="text-[#4B2E2B] font-semibold">Michael Chen</span>
            </span>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6F4E37] font-bold text-white shadow-sm hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:ring-offset-2"
            >
              MC
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white shadow-xl border border-[#4B2E2B]/10 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-[#4B2E2B]/5 mb-1 sm:hidden">
                  <p className="text-sm font-semibold text-[#4B2E2B]">Michael Chen</p>
                  <p className="text-xs text-[#4B2E2B]/60">Cashier</p>
                </div>
                <Link
                  href="/login"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Link>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-hidden p-4">
          <div className="h-full rounded-2xl bg-white shadow-sm border border-[#4B2E2B]/5 overflow-hidden">
            <ProductGrid items={menuItems} onAddToCart={handleAddToCart} />
          </div>
        </main>
      </div>

      {/* Sidebar - Cart */}
      <CartPanel
        cart={cart}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        onCheckout={handleCheckout}
      />

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={total}
        onConfirm={handleConfirmPayment}
      />

      <TransactionSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        transactionDetails={lastTransaction}
      />
    </div>
  )
}
