'use client'

import { useState } from 'react'
import { menuItems as initialItems } from '@/src/lib/manager-data'
import { Search, ToggleLeft, ToggleRight, Coffee, Utensils, CupSoda } from 'lucide-react'

export default function MenuManagementPage() {
  const [items, setItems] = useState(initialItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))]

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const toggleStock = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock } : item
    ))
  }

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'coffee': return <Coffee className="h-5 w-5" />
      case 'beverage': return <CupSoda className="h-5 w-5" />
      default: return <Utensils className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-coffee">Menu & Stock</h1>
          <p className="text-coffee/70">Manage item availability in real-time.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee/40" />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-9 pr-4 py-2 rounded-xl border border-black/10 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-coffee/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="pl-3 pr-8 py-2 rounded-xl border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee/20 appearance-none cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-3xl p-5 border transition-all duration-200 ${
              item.inStock 
                ? 'border-black/5 shadow-sm hover:shadow-md' 
                : 'border-red-200 bg-red-50/50 opacity-90'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${item.inStock ? 'bg-cream text-coffee' : 'bg-red-100 text-red-600'}`}>
                {getCategoryIcon(item.category)}
              </div>
              <button
                onClick={() => toggleStock(item.id)}
                className={`transition-colors focus:outline-none ${item.inStock ? 'text-green-600 hover:text-green-700' : 'text-red-500 hover:text-red-600'}`}
                title={item.inStock ? "Mark as Out of Stock" : "Mark as In Stock"}
              >
                {item.inStock ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>
            
            <div>
              <h3 className={`font-semibold text-lg ${item.inStock ? 'text-coffee' : 'text-red-900/70 line-through decoration-red-900/30'}`}>
                {item.name}
              </h3>
              <p className="text-sm text-coffee/60">{item.category}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center">
              <span className="font-medium text-coffee">₱{item.price}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.inStock 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-black/5 text-coffee/40">
          No menu items found.
        </div>
      )}
    </div>
  )
}
