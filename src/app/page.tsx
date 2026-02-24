'use client';
import React, { useMemo, useState } from 'react';
import MenuItemCard from '@/components/MenuItemCard';
import Cart from '@/components/Cart';
import { CartItem, MenuItem } from '@/types';

const items: MenuItem[] = [
  { id: 'coffee', name: 'Coffee', price: 2.5, category: 'Beverages' },
  { id: 'latte', name: 'Latte', price: 3.5, category: 'Beverages' },
  { id: 'cappuccino', name: 'Cappuccino', price: 3.8, category: 'Beverages' },
  { id: 'tea', name: 'Tea', price: 2.2, category: 'Beverages' },
  { id: 'croissant', name: 'Croissant', price: 3.0, category: 'Bakery' },
  { id: 'muffin', name: 'Muffin', price: 2.8, category: 'Bakery' },
  { id: 'sandwich', name: 'Sandwich', price: 5.5, category: 'Food' },
  { id: 'salad', name: 'Salad', price: 4.5, category: 'Food' }
];

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.category)))], []);

  const list = useMemo(() => {
    const byCategory = filter === 'All' ? items : items.filter(i => i.category === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter(i => i.name.toLowerCase().includes(q));
  }, [filter, query]);

  function addToCart(item: MenuItem) {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) {
        return prev.map(p => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function inc(id: string) {
    setCart(prev => prev.map(p => (p.id === id ? { ...p, qty: p.qty + 1 } : p)));
  }

  function dec(id: string) {
    setCart(prev =>
      prev
        .map(p => (p.id === id ? { ...p, qty: Math.max(0, p.qty - 1) } : p))
        .filter(p => p.qty > 0)
    );
  }

  function removeItem(id: string) {
    setCart(prev => prev.filter(p => p.id !== id));
  }

  function checkout() {
    alert('Order placed');
    setCart([]);
  }

  return (
    <main className="container">
      <section>
        <div className="searchBar">
          <input
            className="searchInput"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="pillGroup">
          {categories.map(c => (
            <button
              key={c}
              className={`pill ${filter === c ? 'pillActive' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid">
          {list.map(i => (
            <MenuItemCard key={i.id} item={i} onAdd={addToCart} />
          ))}
        </div>
      </section>
      <aside>
        <Cart items={cart} onInc={inc} onDec={dec} onRemove={removeItem} onCheckout={checkout} />
      </aside>
    </main>
  );
}
