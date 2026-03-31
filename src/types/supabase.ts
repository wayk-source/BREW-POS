// Supabase Database Types based on database.md

export interface BusinessName {
  id: number
  store_name: string
  location?: string
  created_at: string
}

export interface UserOwner {
  id: number
  username: string
  password: string
  store_id: number
  created_at: string
}

export interface UserManager {
  id: number
  username: string
  password: string
  store_id: number
  created_at: string
}

export interface UserCashier {
  id: number
  username: string
  password: string
  store_id: number
  created_at: string
}

export interface UserAdmin {
  id: number
  username: string
  password: string
  created_at: string
}

export interface Category {
  id: number
  created_at: string
  name: string
}

export interface Product {
  id: number
  created_at: string
  item_name: string
  item_size?: string
  item_price: number
  category_id?: number
}

export interface TotalSales {
  id: number
  created_at: string
  code_title: string
  total?: number
}

export interface RecordSales {
  id: number
  created_at: string
  product_id?: number
  code_title: string
  quantity: number
  total_sales_id: number
}

export interface Receipt {
  id: number
  created_at: string
  total_id?: number
  business_name_id: number
}

export interface Employee {
  id: number
  username: string
  password: string
  store_id: number
  created_at: string
  role?: 'Manager' | 'Cashier'
}

// Extended types for application use
export interface AppUser {
  id: string
  email: string
  name: string
  role: 'owner' | 'manager' | 'cashier' | 'admin'
  businessId?: number
  storeId?: number
  username?: string
}

export interface AppBusiness {
  id: number
  name: string
  location?: string
  ownerName?: string
  plan?: 'Basic' | 'Standard' | 'Premium'
  expirationDate?: string
  daysRemaining?: number
  status?: 'Active' | 'Expiring' | 'Expired'
  registrationDate?: string
  contactEmail?: string
  contactPhone?: string
  createdAt: string
}

export interface SaleRecord {
  id: number
  product_id?: number
  code_title: string
  quantity: number
  total_sales_id: number
  created_at: string
  product_name?: string
  product_price?: number
  total?: number
}

export interface CartItem {
  productId: number
  name: string
  size?: string
  price: number
  quantity: number
  categoryId?: number
}
