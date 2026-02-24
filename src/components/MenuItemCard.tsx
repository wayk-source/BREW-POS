import React from 'react';
import { MenuItem } from '@/types';

type Props = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
};

export default function MenuItemCard({ item, onAdd }: Props) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600 }}>{item.name}</div>
        <button className="plusButton" onClick={() => onAdd(item)}>+</button>
      </div>
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>{item.category}</div>
      <div style={{ marginTop: 8 }}>${item.price.toFixed(2)}</div>
    </div>
  );
}
