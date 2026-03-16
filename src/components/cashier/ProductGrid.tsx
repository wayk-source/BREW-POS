'use client'

import { MenuItem } from '../../lib/manager-data'
import { Coffee, Utensils, GlassWater, Cake, Search } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface ProductGridProps {
  items: MenuItem[]
  onAddToCart: (item: MenuItem) => void
}

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: Search },
  { id: 'Coffee', name: 'Coffee', icon: Coffee },
  { id: 'Tea', name: 'Tea', icon: GlassWater },
  { id: 'Snack', name: 'Snacks', icon: Cake },
]

export function ProductGrid({ items, onAddToCart }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex h-full flex-col gap-4 bg-[#fdfbf7] p-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4B2E2B]/40" />
        <input
          type="text"
          placeholder="Search menu..."
          className="w-full rounded-xl border-none bg-white py-3 pl-10 pr-4 text-[#4B2E2B] shadow-sm ring-1 ring-[#4B2E2B]/10 focus:ring-2 focus:ring-[#6F4E37] outline-none placeholder:text-[#4B2E2B]/40"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex min-w-[100px] flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all ${
                activeCategory === category.id
                  ? 'bg-[#6F4E37] text-white shadow-md'
                  : 'bg-white text-[#4B2E2B]/70 hover:bg-[#F5EFE6] hover:text-[#4B2E2B]'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          )
        })}
      </div>

      {/* Product Grid */}
      <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto pb-20 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-[#4B2E2B]/5 transition-all hover:shadow-md hover:ring-[#6F4E37]/20 active:scale-95 ${
              !item.inStock ? 'opacity-50 grayscale' : ''
            }`}
          >
            <div className="mb-2 relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-[#F5EFE6] text-[#4B2E2B]/20">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                   {item.category === 'Coffee' ? (
                    <Coffee className="h-12 w-12" />
                  ) : item.category === 'Tea' ? (
                    <GlassWater className="h-12 w-12" />
                  ) : (
                    <Cake className="h-12 w-12" />
                  )}
                </div>
              )}
            </div>
            <div>
              <h3 className="line-clamp-2 font-medium text-[#4B2E2B] group-hover:text-[#6F4E37]">
                {item.name}
              </h3>
              <p className="mt-1 font-bold text-[#6F4E37]">₱{item.price.toFixed(2)}</p>
            </div>
            {!item.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-sm font-bold text-red-500 backdrop-blur-[1px]">
                Out of Stock
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
