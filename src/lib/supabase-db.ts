import { supabase } from './supabase'
import type { AppUser, AppBusiness, BusinessName, UserOwner, Category, Product, TotalSales, RecordSales, Receipt } from '../types/supabase'

// ============ Business Operations ============

/**
 * Create a new business and owner user
 */
export async function createBusinessWithOwner(
  businessName: string,
  ownerName: string,
  ownerEmail: string,
  ownerPassword: string
): Promise<{ user: AppUser; business: AppBusiness } | null> {
  try {
    // Step 1: Create the business in business_name table
    const { data: businessData, error: businessError } = await supabase
      .from('business_name')
      .insert({
        store_name: businessName,
        location: null,
      })
      .select()
      .single()

    if (businessError) {
      console.error('Error creating business:', businessError)
      return null
    }

    // Step 2: Create the owner in user_owner table
    const { data: ownerData, error: ownerError } = await supabase
      .from('user_owner')
      .insert({
        username: ownerEmail.toLowerCase(),
        password: ownerPassword,
        store_id: businessData.id,
      })
      .select()
      .single()

    if (ownerError) {
      console.error('Error creating owner:', ownerError)
      // Rollback: delete the business if owner creation fails
      await supabase.from('business_name').delete().eq('id', businessData.id)
      return null
    }

    // Step 3: Create user in Supabase Auth (for authentication)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true,
      user_metadata: {
        name: ownerName,
        role: 'owner',
        businessId: businessData.id,
        storeId: businessData.id,
        username: ownerEmail,
      },
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      // Rollback: delete owner and business
      await supabase.from('user_owner').delete().eq('id', ownerData.id)
      await supabase.from('business_name').delete().eq('id', businessData.id)
      return null
    }

    // Step 4: Update auth user metadata with user_owner id
    await supabase.auth.admin.updateUserById(
      authData.user.id,
      {
        user_metadata: {
          name: ownerName,
          role: 'owner',
          businessId: businessData.id,
          storeId: businessData.id,
          username: ownerEmail.toLowerCase(),
        },
      }
    )

    return {
      user: {
        id: authData.user.id,
        email: ownerEmail,
        name: ownerName,
        role: 'owner',
        businessId: businessData.id,
        storeId: businessData.id,
        username: ownerEmail,
      },
      business: {
        id: businessData.id,
        name: businessData.store_name,
        location: businessData.location,
        createdAt: businessData.created_at,
      },
    }
  } catch (error) {
    console.error('Unexpected error in createBusinessWithOwner:', error)
    return null
  }
}

// ============ Authentication ============

/**
 * Authenticate user with email and password
 * Checks both Supabase Auth and the role-specific user tables
 */
export async function authenticateUser(email: string, password: string): Promise<AppUser | null> {
  try {
    // First, authenticate with Supabase Auth
    const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authUser) {
      return null
    }

    // Get user metadata
    const metadata = authUser.user_metadata as {
      role?: string
      businessId?: number
      storeId?: number
      username?: string
      name?: string
    } || {}

    // Determine role from metadata
    let role: 'owner' | 'manager' | 'cashier' | 'admin' = 'admin'

    if (metadata.role === 'owner') {
      role = 'owner'
    } else if (metadata.role === 'manager') {
      role = 'manager'
    } else if (metadata.role === 'cashier') {
      role = 'cashier'
    }

    return {
      id: authUser.id,
      email: authUser.email!,
      name: metadata.name || email.split('@')[0],
      role,
      businessId: metadata.businessId ? Number(metadata.businessId) : undefined,
      storeId: metadata.storeId,
      username: metadata.username,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

/**
 * Sign up a new user (business owner only)
 * This creates: business in business_name, owner in user_owner, and auth user
 */
export async function signupOwner(
  email: string,
  password: string,
  name: string,
  businessName: string
): Promise<AppUser | null> {
  return createBusinessWithOwner(businessName, name, email, password)
    .then(result => result?.user || null)
}

// ============ Data Fetching ============

/**
 * Get all businesses
 */
export async function getBusinesses(): Promise<AppBusiness[]> {
  const { data, error } = await supabase
    .from('business_name')
    .select(`
      *,
      user_owner:user_owner (
        username
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  return data.map(b => ({
    id: b.id,
    name: b.store_name,
    location: b.location,
    ownerName: b.user_owner?.[0]?.username || 'N/A',
    createdAt: b.created_at,
  }))
}

/**
 * Get business by ID
 */
export async function getBusinessById(id: number): Promise<AppBusiness | null> {
  const { data, error } = await supabase
    .from('business_name')
    .select(`
      *,
      user_owner:user_owner (
        username
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return {
    id: data.id,
    name: data.store_name,
    location: data.location,
    ownerName: data.user_owner?.[0]?.username || 'N/A',
    createdAt: data.created_at,
  }
}

/**
 * Get categories
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('Category')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

/**
 * Get products for a business
 */
export async function getProducts(businessId: number): Promise<Product[]> {
  const { data, error } = await supabase
    .from('product')
    .select(`
      *,
      Category:category_id (
        name
      )
    `)
    .order('item_name')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map(p => ({
    id: p.id,
    created_at: p.created_at,
    item_name: p.item_name,
    item_size: p.item_size,
    item_price: p.item_price,
    category_id: p.category_id,
  }))
}

/**
 * Create a new product
 */
export async function createProduct(
  businessId: number,
  name: string,
  price: number,
  size?: string,
  categoryId?: number
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('product')
    .insert({
      item_name: name,
      item_size: size,
      item_price: price,
      category_id: categoryId,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return null
  }

  return data
}

/**
 * Update a product
 */
export async function updateProduct(
  productId: number,
  updates: Partial<Pick<Product, 'item_name' | 'item_size' | 'item_price' | 'category_id'>>
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('product')
    .update(updates)
    .eq('id', productId)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return null
  }

  return data
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: number): Promise<boolean> {
  const { error } = await supabase
    .from('product')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Error deleting product:', error)
    return false
  }

  return true
}

// ============ Sales Operations ============

/**
 * Create a new sale record
 */
export async function createSale(
  businessId: number,
  items: Array<{ productId: number; codeTitle: string; quantity: number }>,
  total: number
): Promise<{ receiptId: number; totalSalesId: number } | null> {
  try {
    // Create total_sales record
    const codeTitle = `SALE-${Date.now()}`
    const { data: totalSales, error: totalError } = await supabase
      .from('total_sales')
      .insert({
        code_title: codeTitle,
        total: total,
      })
      .select()
      .single()

    if (totalError) {
      console.error('Error creating total_sales:', totalError)
      return null
    }

    // Create record_sales for each item
    const recordSalesInserts = items.map(item => ({
      product_id: item.productId,
      code_title: item.codeTitle,
      quantity: item.quantity,
      total_sales_id: totalSales.id,
    }))

    const { error: recordsError } = await supabase
      .from('Record_sales')
      .insert(recordSalesInserts)

    if (recordsError) {
      console.error('Error creating record_sales:', recordsError)
      return null
    }

    // Create receipt
    const { data: receipt, error: receiptError } = await supabase
      .from('Receipt')
      .insert({
        total_id: totalSales.id,
        business_name_id: businessId,
      })
      .select()
      .single()

    if (receiptError) {
      console.error('Error creating receipt:', receiptError)
      return null
    }

    return {
      receiptId: receipt.id,
      totalSalesId: totalSales.id,
    }
  } catch (error) {
    console.error('Error in createSale:', error)
    return null
  }
}

/**
 * Get sales history for a business
 */
export async function getSalesHistory(businessId: number, limit?: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('Receipt')
    .select(`
      *,
      total_sales:total_sales (
        code_title,
        total
      ),
      business_name:business_name_id (
        store_name
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

// ============ Employee Management ============

/**
 * Get employees for a business (from user_manager and user_cashier)
 */
export async function getEmployees(businessId: number): Promise<any[]> {
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

  const allEmployees = [
    ...(managers || []).map(m => ({ ...m, role: 'Manager' as const })),
    ...(cashiers || []).map(c => ({ ...c, role: 'Cashier' as const })),
  ]

  return allEmployees
}

/**
 * Add an employee (manager or cashier)
 */
export async function addEmployee(
  businessId: number,
  role: 'manager' | 'cashier',
  username: string,
  password: string
): Promise<{ id: number; username: string; role: string } | null> {
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
    console.error(`Error creating ${role}:`, error)
    return null
  }

  return {
    id: data.id,
    username: data.username,
    role: role === 'manager' ? 'Manager' : 'Cashier',
  }
}

/**
 * Delete an employee
 */
export async function deleteEmployee(role: 'manager' | 'cashier', employeeId: number): Promise<boolean> {
  const tableName = role === 'manager' ? 'user_manager' : 'user_cashier'

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', employeeId)

  if (error) {
    console.error(`Error deleting ${role}:`, error)
    return false
  }

  return true
}

// ============ Session Management ============

/**
 * Get current user from Supabase session
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    return null
  }

  const metadata = authUser.user_metadata as {
    name?: string
    role?: string
    businessId?: number
    storeId?: number
    username?: string
  } || {}

  return {
    id: authUser.id,
    email: authUser.email!,
    name: metadata.name || authUser.email!.split('@')[0],
    role: (metadata.role as 'owner' | 'manager' | 'cashier' | 'admin') || 'admin',
    businessId: metadata.businessId,
    storeId: metadata.storeId,
    username: metadata.username,
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}
