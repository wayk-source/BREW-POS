'use client'

import { useState } from 'react'
import { menuItems } from '@/lib/manager-data'
import { Coffee, Utensils, GlassWater, Cake, Search } from 'lucide-react'
import { BrewPosLogo } from '@/components/ui/BrewPosLogo'
import Image from 'next/image'

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: Search },
  { id: 'Coffee', name: 'Coffee', icon: Coffee },
  { id: 'Tea', name: 'Tea', icon: GlassWater },
  { id: 'Snack', name: 'Snacks', icon: Cake },
]

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#4B2E2B]/10 bg-white/80 px-4 py-4 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <BrewPosLogo />
          <div className="hidden text-sm font-medium text-[#4B2E2B]/60 sm:block">
            Digital Menu
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Hero / Introduction */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#4B2E2B] sm:text-4xl">
            Our Menu
          </h1>
          <p className="text-[#4B2E2B]/60">
            Freshly brewed coffee, premium teas, and delicious snacks.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="sticky top-[73px] z-40 mb-8 -mx-4 bg-[#F5EFE6]/95 px-4 py-4 backdrop-blur-sm sm:mx-0 sm:rounded-2xl sm:bg-white sm:shadow-sm sm:border sm:border-[#4B2E2B]/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {CATEGORIES.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeCategory === category.id
                        ? 'bg-[#6F4E37] text-white shadow-md'
                        : 'bg-white text-[#4B2E2B]/70 hover:bg-[#4B2E2B]/5 sm:bg-[#F5EFE6]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B2E2B]/40" />
              <input
                type="text"
                placeholder="Search items..."
                className="w-full rounded-full border-none bg-white py-2 pl-9 pr-4 text-sm text-[#4B2E2B] shadow-sm ring-1 ring-[#4B2E2B]/10 focus:ring-2 focus:ring-[#6F4E37] outline-none placeholder:text-[#4B2E2B]/40 sm:bg-[#F5EFE6]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-[#4B2E2B]/40">
            <Search className="mb-4 h-12 w-12 opacity-20" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm">Try adjusting your search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#4B2E2B]/5 transition-all hover:-translate-y-1 hover:shadow-md ${
                  !item.inStock ? 'opacity-75' : ''
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EFE6]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#4B2E2B]/20">
                      {item.category === 'Coffee' ? (
                        <Coffee className="h-16 w-16" />
                      ) : item.category === 'Tea' ? (
                        <GlassWater className="h-16 w-16" />
                      ) : (
                        <Cake className="h-16 w-16" />
                      )}
                    </div>
                  )}
                  
                  {/* Out of Stock Overlay */}
                  {!item.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600 shadow-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#4B2E2B] group-hover:text-[#6F4E37] transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#4B2E2B]/40">
                        {item.category}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-[#F5EFE6] px-3 py-1 text-sm font-bold text-[#6F4E37]">
                      ₱{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#4B2E2B]/10 bg-white py-8 text-center">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm text-[#4B2E2B]/40">
            Powered by <span className="font-bold text-[#4B2E2B]">BREW POS</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
