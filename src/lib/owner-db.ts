import { supabase } from './supabase'
import type { Product } from '../types/supabase'

/**
 * Owner-specific data fetching functions
 * All functions are scoped to a business ID for data isolation
 */

// ============ Business Data ============

/**
 * Get owner's business information
 */
export async function getOwnerBusiness(businessId: number) {
  const { data, error } = await supabase
    .from('business_name')
    .select('*')
    .eq('id', businessId)
    .single()

  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return {
    id: data.id,
    name: data.store_name,
    location: data.location,
    createdAt: data.created_at,
  }
}

// ============ Menu Management ============

/**
 * Get all menu items/products for owner's business
 */
export async function getOwnerMenuItems(businessId: number) {
  const { data, error } = await supabase
    .from('product')
    .select(`
      id,
      item_name,
      item_price,
      item_size,
      category:category_id (
        name
      ),
      created_at
    `)
    .order('item_name')

  if (error) {
    console.error('Error fetching menu items:', error)
    return []
  }

  return data.map((p: any) => ({
    id: p.id,
    name: p.item_name,
    price: p.item_price,
    size: p.item_size,
    category: p.category && Array.isArray(p.category) ? p.category[0]?.name : p.category?.name || 'Uncategorized',
    createdAt: p.created_at,
  }))
}

/**
 * Create a new menu item for owner's business
 */
export async function createOwnerMenuItem(
  businessId: number,
  name: string,
  price: number,
  categoryId: number,
  size?: string
) {
  const { data, error } = await supabase
    .from('product')
    .insert({
      item_name: name,
      item_price: price,
      category_id: categoryId,
      item_size: size || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating menu item:', error)
    return null
  }

  return data
}

/**
 * Update a menu item
 */
export async function updateOwnerMenuItem(
  businessId: number,
  menuItemId: number,
  updates: {
    name?: string
    price?: number
    categoryId?: number
    size?: string
  }
) {
  const { data, error } = await supabase
    .from('product')
    .update({
      item_name: updates.name,
      item_price: updates.price,
      category_id: updates.categoryId,
      item_size: updates.size,
    })
    .eq('id', menuItemId)
    .select()
    .single()

  if (error) {
    console.error('Error updating menu item:', error)
    return null
  }

  return data
}

/**
 * Delete a menu item
 */
export async function deleteOwnerMenuItem(businessId: number, menuItemId: number) {
  const { error } = await supabase
    .from('product')
    .delete()
    .eq('id', menuItemId)

  if (error) {
    console.error('Error deleting menu item:', error)
    return false
  }

  return true
}

// ============ Employee Management ============

/**
 * Get all employees for owner's business
 */
export async function getOwnerEmployees(businessId: number) {
  console.log('getOwnerEmployees called with businessId:', businessId)

  const { data: managers, error: managerError } = await supabase
    .from('user_manager')
    .select('*')
    .eq('store_id', businessId)

  const { data: cashiers, error: cashierError } = await supabase
    .from('user_cashier')
    .select('*')
    .eq('store_id', businessId)

  if (managerError || cashierError) {
    console.error('Error fetching employees:', managerError || cashierError)
    return []
  }

  console.log('Employees query returned:', (managers?.length || 0) + (cashiers?.length || 0), 'employees')

  const allEmployees = [
    ...(managers || []).map(m => ({
      id: m.id,
      username: m.username,
      role: 'Manager' as const,
      storeId: m.store_id,
    })),
    ...(cashiers || []).map(c => ({
      id: c.id,
      username: c.username,
      role: 'Cashier' as const,
      storeId: c.store_id,
    })),
  ]

  return allEmployees
}

/**
 * Add an employee to owner's business
 */
export async function addOwnerEmployee(
  businessId: number,
  role: 'manager' | 'cashier',
  username: string,
  password: string
) {
  const tableName = role === 'manager' ? 'user_manager' : 'user_cashier'

  const { data, error } = await supabase
    .from(tableName)
    .insert({
      username,
      password,
      store_id: businessId,
    })
    .select()
    .single()

  if (error) {
    console.error(`Error creating employee:`, error)
    return null
  }

  return {
    id: data.id,
    username: data.username,
    role,
    storeId: data.store_id,
  }
}

/**
 * Delete an employee
 */
export async function deleteOwnerEmployee(
  businessId: number,
  employeeId: number,
  role: 'manager' | 'cashier'
) {
  const tableName = role === 'manager' ? 'user_manager' : 'user_cashier'

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', employeeId)
    .eq('store_id', businessId)

  if (error) {
    console.error('Error deleting employee:', error)
    return false
  }

  return true
}

// ============ Sales & Reports ============

/**
 * Get sales records for owner's business
 */
export async function getOwnerSalesHistory(businessId: number, limit?: number) {
  const { data, error } = await supabase
    .from('Receipt')
    .select(`
      *,
      total_sales:total_sales (
        code_title,
        total,
        created_at
      )
    `)
    .eq('business_name_id', businessId)
    .order('created_at', { ascending: false })
    .limit(limit || 50)

  if (error) {
    console.error('Error fetching sales history:', error)
    return []
  }

  return data
}

/**
 * Get sales analytics for owner's business
 */
export async function getOwnerSalesAnalytics(businessId: number, days: number = 30) {
  console.log('getOwnerSalesAnalytics called with businessId:', businessId, 'days:', days)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('Receipt')
    .select(`
      created_at,
      total_sales:total_sales (
        total
      )
    `)
    .eq('business_name_id', businessId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching analytics:', error)
    return []
  }

  console.log('Analytics query returned', data?.length || 0, 'records')

  // Group by date
  const byDate = new Map<string, number>()
  data.forEach((record: any) => {
    const date = new Date(record.created_at).toISOString().split('T')[0]
    const total = (Array.isArray(record.total_sales) ? record.total_sales[0]?.total : record.total_sales?.total) || 0
    byDate.set(date, (byDate.get(date) || 0) + total)
  })

  const result = Array.from(byDate.entries()).map(([date, total]) => ({
    date,
    total,
  }))

  console.log('Analytics processed:', result.length, 'days with data')
  return result
}
