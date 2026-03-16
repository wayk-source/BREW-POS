'use client'

import Link from 'next/link'
import { Coffee, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function LandingNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="bg-white border-b border-[#C19A6B]/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6F4E37] rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#4B2E2B]">BREW POS</div>
              <div className="text-xs text-[#6F4E37]">Café Point of Sale</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#6F4E37] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[#6F4E37] hover:text-[#4B2E2B] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="#contact"
              className="bg-[#6F4E37] hover:bg-[#4B2E2B] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Contact Sales
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#6F4E37]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#C19A6B]/20">
            <div className="space-y-3">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-[#6F4E37] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <Link
                  href="/login"
                  className="block w-full text-center text-sm font-medium text-[#6F4E37] py-2 border border-[#C19A6B] rounded-lg hover:bg-[#F5EFE6] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="#contact"
                  className="block w-full text-center bg-[#6F4E37] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#4B2E2B] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
