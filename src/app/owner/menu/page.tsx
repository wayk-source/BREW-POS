'use client'

import { useMemo, useState } from 'react'
import { Percent, Plus, Tag, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { Table, Th, Td } from '../../../components/ui/Table'
import { Modal } from '../../../components/ui/Modal'
import { menuSeed, type MenuCategory, type MenuItem } from '../../../lib/owner-data'
import { useLocalStorageState } from '../../../lib/useLocalStorageState'

export default function OwnerMenuPage() {
  const [items, setItems] = useLocalStorageState<MenuItem[]>('owner.menu', menuSeed)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'All' | MenuCategory>('All')
  const [activeOnly, setActiveOnly] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Coffee')
  const [customCategory, setCustomCategory] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<string | null>(null)

  const uniqueCategories = useMemo(() => {
    const cats = new Set(items.map(i => i.category))
    // Ensure default categories exist if not present
    const defaults = ['Coffee', 'Non-Coffee', 'Pastries', 'Add-ons']
    defaults.forEach(d => cats.add(d))
    return Array.from(cats).sort()
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(i => {
      const matchQ = !q || [i.name, i.category].some(v => v.toLowerCase().includes(q))
      const matchCat = category === 'All' || i.category === category
      const matchActive = !activeOnly || i.active
      return matchQ && matchCat && matchActive
    })
  }, [items, query, category, activeOnly])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function addItem() {
    const n = name.trim()
    const p = Number(price)
    const cat = isAddingCategory ? customCategory.trim() : selectedCategory
    
    if (!n || !Number.isFinite(p) || p <= 0 || !cat) return

    const id = `m${Date.now()}`
    setItems([
      {
        id,
        name: n,
        category: cat,
        price: p,
        active: true,
        image: image || undefined,
      },
      ...items,
    ])
    closeModal()
  }

  function openModal() {
    setName('')
    setPrice('')
    setImage(null)
    setSelectedCategory(uniqueCategories[0] || 'Coffee')
    setCustomCategory('')
    setIsAddingCategory(false)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  function toggleItemActive(id: string) {
    setItems(items.map(i => (i.id === id ? { ...i, active: !i.active } : i)))
  }

  function removeItem(id: string) {
    setItems(items.filter(i => i.id !== id))
  }

  function setItemDiscount(id: string, value: number) {
    const v = Number.isFinite(value) ? Math.min(90, Math.max(0, value)) : 0
    setItems(items.map(i => (i.id === id ? { ...i, discountPercent: v || undefined } : i)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-coffee">Menu Management</h1>
          <p className="text-sm text-coffee/70">Manage menu items, categories, pricing, and promotions</p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[color:var(--color-mocha)] text-cream hover:brightness-95 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add Item
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={category}
            onChange={e => setCategory(e.target.value as 'All' | MenuCategory)}
            className="h-10 rounded-xl bg-white/80 border border-black/10 px-2 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <option value="All">All Categories</option>
            {uniqueCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-sm text-coffee">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={e => setActiveOnly(e.target.checked)}
            />
            Active only
          </label>
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full md:w-80 px-3 py-2.5 rounded-xl bg-white/80 border border-black/10 outline-none focus:ring-2 focus:ring-caramel/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <Table variant="plain">
          <thead>
            <tr>
              <Th>Item</Th>
              <Th>Category</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-right">Discount</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => (
              <tr key={i.id} className="hover:bg-cream/60">
                <Td className="font-medium">
                  <div className="flex items-center gap-3">
                    {i.image ? (
                      <img src={i.image} alt={i.name} className="h-10 w-10 rounded-lg object-cover bg-stone-100" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-400">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                    {i.name}
                  </div>
                </Td>
                <Td>
                  <span className="chip bg-cream border border-black/10">{i.category}</span>
                </Td>
                <Td className="text-right">{i.price.toLocaleString()}</Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Percent className="h-4 w-4 text-coffee/40" />
                    <input
                      type="number"
                      min={0}
                      max={90}
                      step={1}
                      value={i.discountPercent ?? 0}
                      onChange={e => setItemDiscount(i.id, Number(e.target.value))}
                      className="w-20 px-2 py-1.5 rounded-lg bg-white/80 border border-black/10 text-right"
                    />
                  </div>
                </Td>
                <Td>
                  <button
                    onClick={() => toggleItemActive(i.id)}
                    className={`chip ${i.active ? 'chip-success' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {i.active ? 'Active' : 'Inactive'}
                  </button>
                </Td>
                <Td className="text-right">
                  <button
                    onClick={() => removeItem(i.id)}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-black/10 bg-white/80 hover:bg-black/5"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4 text-coffee/70" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add New Item">
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-coffee mb-1">Item Photo</label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-dashed border-stone-300 bg-stone-50">
                {image ? (
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-stone-400">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                {image && (
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[color:var(--color-mocha)] file:text-cream hover:file:bg-[color:var(--color-mocha)]/90"
                />
                <p className="mt-1 text-xs text-stone-500">Recommended: Square JPG or PNG</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-coffee mb-1">Item Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Caramel Macchiato"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 outline-none focus:ring-2 focus:ring-caramel/40"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-coffee mb-1">Category</label>
            {isAddingCategory ? (
              <div className="flex gap-2">
                <input
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  placeholder="New Category Name"
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-stone-200 outline-none focus:ring-2 focus:ring-caramel/40"
                  autoFocus
                />
                <button
                  onClick={() => setIsAddingCategory(false)}
                  className="px-3 py-2 text-sm text-stone-500 hover:text-stone-700 underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-stone-200 outline-none focus:ring-2 focus:ring-caramel/40"
                >
                  {uniqueCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setIsAddingCategory(true)
                    setCustomCategory('')
                  }}
                  className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  New
                </button>
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-coffee mb-1">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">₱</span>
              <input
                value={price}
                onChange={e => setPrice(e.target.value)}
                type="number"
                min={0}
                step={1}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-stone-200 outline-none focus:ring-2 focus:ring-caramel/40"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={addItem}
              disabled={!name || !price}
              className="w-full py-3 rounded-xl bg-[color:var(--color-mocha)] text-cream font-medium hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
