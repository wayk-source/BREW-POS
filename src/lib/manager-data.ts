
export interface Transaction {
  id: string
  date: string
  time: string
  cashier: string
  items: string
  total: number
  paymentMethod: 'Cash' | 'Card' | 'GCash'
  status: 'Completed' | 'Voided' | 'Refunded'
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  inStock: boolean
  image?: string
}

export interface StaffMember {
  id: string
  name: string
  role: 'Cashier' | 'Manager'
  status: 'Active' | 'Inactive' | 'On Break'
  shiftStart: string
  sales: number
  transactions: number
  voids: number
}

export interface AuditLog {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
  severity: 'low' | 'medium' | 'high'
}

export const transactions: Transaction[] = [
  { id: 'TRX-1001', date: '2026-03-13', time: '08:12 AM', cashier: 'Michael Chen', items: 'Latte, Croissant', total: 320, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TRX-1002', date: '2026-03-13', time: '08:15 AM', cashier: 'Michael Chen', items: 'Cappuccino', total: 180, paymentMethod: 'GCash', status: 'Completed' },
  { id: 'TRX-1003', date: '2026-03-13', time: '08:22 AM', cashier: 'Jorge Alvarez', items: 'Iced Americano, Bagel', total: 290, paymentMethod: 'Card', status: 'Voided' },
  { id: 'TRX-1004', date: '2026-03-13', time: '08:30 AM', cashier: 'Michael Chen', items: 'Espresso', total: 120, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TRX-1005', date: '2026-03-13', time: '08:45 AM', cashier: 'Jorge Alvarez', items: 'Mocha, Muffin', total: 350, paymentMethod: 'GCash', status: 'Refunded' },
  { id: 'TRX-1006', date: '2026-03-13', time: '09:05 AM', cashier: 'Michael Chen', items: 'Pour Over', total: 200, paymentMethod: 'Card', status: 'Completed' },
  { id: 'TRX-1007', date: '2026-03-13', time: '09:12 AM', cashier: 'Jorge Alvarez', items: 'Flat White', total: 190, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TRX-1008', date: '2026-03-13', time: '09:20 AM', cashier: 'Michael Chen', items: 'Tea, Sandwich', total: 450, paymentMethod: 'GCash', status: 'Completed' },
]

export const menuItems: MenuItem[] = [
  { 
    id: 'm1', 
    name: 'Espresso', 
    category: 'Coffee', 
    price: 120, 
    inStock: true,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm2', 
    name: 'Americano', 
    category: 'Coffee', 
    price: 140, 
    inStock: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm3', 
    name: 'Cappuccino', 
    category: 'Coffee', 
    price: 180, 
    inStock: true,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm4', 
    name: 'Latte', 
    category: 'Coffee', 
    price: 190, 
    inStock: false,
    image: 'https://images.unsplash.com/photo-1570968992193-d6ea04ddaca9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm5', 
    name: 'Mocha', 
    category: 'Coffee', 
    price: 210, 
    inStock: true,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm6', 
    name: 'Croissant', 
    category: 'Snack', 
    price: 150, 
    inStock: true,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm7', 
    name: 'Bagel', 
    category: 'Snack', 
    price: 120, 
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm8', 
    name: 'Blueberry Muffin', 
    category: 'Snack', 
    price: 140, 
    inStock: false,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm9', 
    name: 'Iced Tea', 
    category: 'Tea', 
    price: 130, 
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'm10', 
    name: 'Club Sandwich', 
    category: 'Snack', 
    price: 280, 
    inStock: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
]

export const staffMembers: StaffMember[] = [
  { id: 's1', name: 'Michael Chen', role: 'Cashier', status: 'Active', shiftStart: '08:00 AM', sales: 12500, transactions: 45, voids: 1 },
  { id: 's2', name: 'Jorge Alvarez', role: 'Cashier', status: 'Active', shiftStart: '08:00 AM', sales: 9800, transactions: 32, voids: 3 },
  { id: 's3', name: 'Sarah Lee', role: 'Cashier', status: 'Inactive', shiftStart: '-', sales: 0, transactions: 0, voids: 0 },
  { id: 's4', name: 'David Kim', role: 'Manager', status: 'Active', shiftStart: '07:30 AM', sales: 0, transactions: 0, voids: 0 },
]

export const auditLogs: AuditLog[] = [
  { id: 'log1', timestamp: '2026-03-13 08:22:15', action: 'Void Transaction', user: 'Jorge Alvarez', details: 'Voided TRX-1003 (Customer changed mind)', severity: 'medium' },
  { id: 'log2', timestamp: '2026-03-13 08:45:30', action: 'Process Refund', user: 'David Kim', details: 'Refunded TRX-1005 (Wrong item served)', severity: 'high' },
  { id: 'log3', timestamp: '2026-03-13 09:00:00', action: 'Stock Update', user: 'David Kim', details: 'Marked Latte as Out of Stock', severity: 'low' },
  { id: 'log4', timestamp: '2026-03-13 09:15:22', action: 'Cash Drawer Open', user: 'Michael Chen', details: 'Manual open', severity: 'medium' },
  { id: 'log5', timestamp: '2026-03-13 09:30:10', action: 'System Login', user: 'David Kim', details: 'Manager login detected', severity: 'low' },
]
