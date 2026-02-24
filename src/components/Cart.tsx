import React, { useState } from 'react';
import { CartItem, MenuItem } from '@/types';

type Props = {
  items: CartItem[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
};

export default function Cart({ items, onInc, onDec, onRemove, onCheckout }: Props) {
  const [mode, setMode] = useState<'dine' | 'take' | 'online'>('dine');
  const [customer, setCustomer] = useState('');
  const [table, setTable] = useState('B12 - Indoor');
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="card">
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>Purchase Receipt</div>
        <div className="segmented">
          <button
            className={`segment ${mode === 'dine' ? 'segmentActive' : ''}`}
            onClick={() => setMode('dine')}
          >
            Dine In
          </button>
          <button
            className={`segment ${mode === 'take' ? 'segmentActive' : ''}`}
            onClick={() => setMode('take')}
          >
            Take Away
          </button>
          <button
            className={`segment ${mode === 'online' ? 'segmentActive' : ''}`}
            onClick={() => setMode('online')}
          >
            Order Online
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <div className="inputLabel">Customer name</div>
            <input
              className="input"
              placeholder="Name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div>
            <div className="inputLabel">Table</div>
            <select className="input" value={table} onChange={(e) => setTable(e.target.value)}>
              <option>B12 - Indoor</option>
              <option>A3 - Patio</option>
              <option>Pickup</option>
            </select>
          </div>
        </div>
      </div>
      {items.length === 0 ? (
        <div style={{ color: 'var(--muted)' }}>No items</div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                paddingBottom: 8,
              }}
            >
              <div>
                <div>{it.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                  ${it.price.toFixed(2)}
                </div>
              </div>
              <div className="qtyControls">
                <button className="button" onClick={() => onDec(it.id)}>-</button>
                <div>{it.qty}</div>
                <button className="button" onClick={() => onInc(it.id)}>+</button>
              </div>
              <div style={{ width: 80, textAlign: 'right' }}>
                ${(it.price * it.qty).toFixed(2)}
              </div>
              <button className="button" onClick={() => onRemove(it.id)}>Remove</button>
            </div>
          ))}
          <div className="totals">
            <div>Subtotal</div>
            <div>${subtotal.toFixed(2)}</div>
            <div>Tax</div>
            <div>${tax.toFixed(2)}</div>
            <div style={{ fontWeight: 600 }}>Total</div>
            <div style={{ fontWeight: 600 }}>${total.toFixed(2)}</div>
          </div>
          <button
            className="button buttonPrimary buttonFull"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
