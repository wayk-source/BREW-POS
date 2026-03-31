import { getBusinessById, getEmployees, getProducts, createProduct, updateProduct, deleteProduct, getSalesHistory, addEmployee, deleteEmployee } from './supabase-db'
import type { Product } from '../types/supabase'

export type StoreStatus = 'Active' | 'Inactive'
export type EmployeeRole = 'Owner' | 'Manager' | 'Cashier'
export type EmployeeStatus = 'Active' | 'Suspended'
export type MenuCategory = string

export interface StoreLocation {
  id: string
  name: string
  address: string
  phone: string
  status: StoreStatus
}

export interface Employee {
  id: string
  name: string
  code: string
  role: Exclude<EmployeeRole, 'Owner'>
  storeId: string
  status: EmployeeStatus
  salesToday: number
  ordersToday: number
  email?: string
  password?: string
}

export interface MenuItem {
  id: string
  name: string
  category: MenuCategory
  price: number
  active: boolean
  discountPercent?: number
  cost?: number
  image?: string
}

export interface SalePoint {
  label: string
  value: number
}

export interface PeakHourPoint {
  hour: string
  orders: number
}

export interface SaleRecord {
  id: string
  date: string
  storeId: string
  orders: number
  grossSales: number
  discounts: number
  netSales: number
  topItem: string
  profitMargin: number
  cashierCode?: string
}

export const ownerBusiness = {
  name: 'Brew Haven Café',
  currency: 'PHP',
}

export const storesSeed: StoreLocation[] = [
  {
    id: 's1',
    name: 'Brew Haven Café • Downtown',
    address: '123 Coffee St, Downtown',
    phone: '+63 912 345 6789',
    status: 'Active',
  },
  {
    id: 's2',
    name: 'Brew Haven Café • Uptown',
    address: '45 Mocha Ave, Uptown',
    phone: '+63 917 222 1199',
    status: 'Active',
  },
]

export const employeesSeed: Employee[] = [
  {
    id: 'e1',
    name: 'Aisha Khan',
    code: 'BRAI01',
    role: 'Manager',
    storeId: 's1',
    status: 'Active',
    salesToday: 18450,
    ordersToday: 76,
  },
  {
    id: 'e2',
    name: 'Michael Chen',
    code: 'BRMI02',
    role: 'Cashier',
    storeId: 's1',
    status: 'Active',
    salesToday: 12320,
    ordersToday: 54,
  },
  {
    id: 'e3',
    name: 'Priya Singh',
    code: 'BRPR01',
    role: 'Manager',
    storeId: 's2',
    status: 'Active',
    salesToday: 15680,
    ordersToday: 63,
  },
  {
    id: 'e4',
    name: 'Jorge Alvarez',
    code: 'BRJO02',
    role: 'Cashier',
    storeId: 's2',
    status: 'Suspended',
    salesToday: 0,
    ordersToday: 0,
  },
]

export const menuSeed: MenuItem[] = [
  { id: 'm1', name: 'Americano', category: 'Coffee', price: 120, active: true, discountPercent: 0, cost: 45 },
  { id: 'm2', name: 'Cappuccino', category: 'Coffee', price: 160, active: true, discountPercent: 10, cost: 60 },
  { id: 'm3', name: 'Caramel Latte', category: 'Coffee', price: 175, active: true, cost: 68 },
  { id: 'm4', name: 'Matcha Latte', category: 'Non-Coffee', price: 170, active: true, cost: 70 },
  { id: 'm5', name: 'Chocolate Frappe', category: 'Non-Coffee', price: 190, active: true, discountPercent: 5, cost: 78 },
  { id: 'm6', name: 'Butter Croissant', category: 'Pastries', price: 95, active: true, cost: 35 },
  { id: 'm7', name: 'Blueberry Muffin', category: 'Pastries', price: 105, active: true, cost: 40 },
  { id: 'm8', name: 'Extra Shot', category: 'Add-ons', price: 35, active: true, cost: 10 },
  { id: 'm9', name: 'Oat Milk', category: 'Add-ons', price: 25, active: true, cost: 12 },
]

export const salesDailySeed: SalePoint[] = [
  { label: 'Mon', value: 42200 },
  { label: 'Tue', value: 38950 },
  { label: 'Wed', value: 45120 },
  { label: 'Thu', value: 47600 },
  { label: 'Fri', value: 52840 },
  { label: 'Sat', value: 61200 },
  { label: 'Sun', value: 49750 },
]

export const salesWeeklySeed: SalePoint[] = [
  { label: 'Wk 1', value: 286000 },
  { label: 'Wk 2', value: 301500 },
  { label: 'Wk 3', value: 294200 },
  { label: 'Wk 4', value: 318900 },
  { label: 'Wk 5', value: 327400 },
  { label: 'Wk 6', value: 335800 },
  { label: 'Wk 7', value: 329100 },
  { label: 'Wk 8', value: 348500 },
]

export const salesMonthlySeed: SalePoint[] = [
  { label: 'Oct', value: 1135000 },
  { label: 'Nov', value: 1198000 },
  { label: 'Dec', value: 1282000 },
  { label: 'Jan', value: 1214000 },
  { label: 'Feb', value: 1326000 },
  { label: 'Mar', value: 980000 },
]

export const peakHoursSeed: PeakHourPoint[] = [
  { hour: '7AM', orders: 18 },
  { hour: '8AM', orders: 34 },
  { hour: '9AM', orders: 46 },
  { hour: '10AM', orders: 39 },
  { hour: '11AM', orders: 28 },
  { hour: '12PM', orders: 41 },
  { hour: '1PM', orders: 33 },
  { hour: '2PM', orders: 26 },
  { hour: '3PM', orders: 22 },
  { hour: '4PM', orders: 31 },
  { hour: '5PM', orders: 37 },
  { hour: '6PM', orders: 24 },
]

export const saleRecordsSeed: SaleRecord[] = [
  // 2026-03-01 (net 8,200, ~23 orders)
  { id: 'r0301a', date: '2026-03-01', storeId: 's1', cashierCode: 'BRAI01', orders: 13, grossSales: 4740, discounts: 140, netSales: 4600, topItem: 'Americano', profitMargin: 0.40 },
  { id: 'r0301b', date: '2026-03-01', storeId: 's2', cashierCode: 'BRPR01', orders: 10, grossSales: 3710, discounts: 110, netSales: 3600, topItem: 'Cappuccino', profitMargin: 0.39 },
  // 2026-03-02 (net 10,500, ~30 orders)
  { id: 'r0302a', date: '2026-03-02', storeId: 's1', cashierCode: 'BRAI01', orders: 17, grossSales: 6060, discounts: 180, netSales: 5880, topItem: 'Cappuccino', profitMargin: 0.41 },
  { id: 'r0302b', date: '2026-03-02', storeId: 's2', cashierCode: 'BRPR01', orders: 13, grossSales: 4760, discounts: 140, netSales: 4620, topItem: 'Butter Croissant', profitMargin: 0.37 },
  // 2026-03-03 (net 9,700, ~28 orders)
  { id: 'r0303a', date: '2026-03-03', storeId: 's1', cashierCode: 'BRAI01', orders: 16, grossSales: 5590, discounts: 160, netSales: 5430, topItem: 'Butter Croissant', profitMargin: 0.36 },
  { id: 'r0303b', date: '2026-03-03', storeId: 's2', cashierCode: 'BRPR01', orders: 12, grossSales: 4400, discounts: 130, netSales: 4270, topItem: 'Matcha Latte', profitMargin: 0.38 },
  // 2026-03-04 (net 11,300, ~32 orders)
  { id: 'r0304a', date: '2026-03-04', storeId: 's1', cashierCode: 'BRAI01', orders: 18, grossSales: 6520, discounts: 190, netSales: 6330, topItem: 'Caramel Latte', profitMargin: 0.40 },
  { id: 'r0304b', date: '2026-03-04', storeId: 's2', cashierCode: 'BRPR01', orders: 14, grossSales: 5120, discounts: 150, netSales: 4970, topItem: 'Americano', profitMargin: 0.39 },
  // 2026-03-05 (net 12,100, ~35 orders)
  { id: 'r0305a', date: '2026-03-05', storeId: 's1', cashierCode: 'BRAI01', orders: 20, grossSales: 6980, discounts: 200, netSales: 6780, topItem: 'Matcha Latte', profitMargin: 0.39 },
  { id: 'r0305b', date: '2026-03-05', storeId: 's2', cashierCode: 'BRPR01', orders: 15, grossSales: 5480, discounts: 160, netSales: 5320, topItem: 'Cappuccino', profitMargin: 0.41 },
  // 2026-03-06 (net 10,800, ~31 orders)
  { id: 'r0306a', date: '2026-03-06', storeId: 's1', cashierCode: 'BRAI01', orders: 17, grossSales: 6230, discounts: 180, netSales: 6050, topItem: 'Americano', profitMargin: 0.42 },
  { id: 'r0306b', date: '2026-03-06', storeId: 's2', cashierCode: 'BRPR01', orders: 14, grossSales: 4900, discounts: 150, netSales: 4750, topItem: 'Caramel Latte', profitMargin: 0.38 },
  // 2026-03-07 (net 13,500, ~39 orders)
  { id: 'r0307a', date: '2026-03-07', storeId: 's1', cashierCode: 'BRAI01', orders: 22, grossSales: 7790, discounts: 230, netSales: 7560, topItem: 'Cappuccino', profitMargin: 0.41 },
  { id: 'r0307b', date: '2026-03-07', storeId: 's2', cashierCode: 'BRPR01', orders: 17, grossSales: 6120, discounts: 180, netSales: 5940, topItem: 'Butter Croissant', profitMargin: 0.36 },
  // 2026-03-08 (net 15,200, ~43 orders)
  { id: 'r0308a', date: '2026-03-08', storeId: 's1', cashierCode: 'BRAI01', orders: 24, grossSales: 8770, discounts: 260, netSales: 8510, topItem: 'Caramel Latte', profitMargin: 0.40 },
  { id: 'r0308b', date: '2026-03-08', storeId: 's2', cashierCode: 'BRPR01', orders: 19, grossSales: 6890, discounts: 200, netSales: 6690, topItem: 'Matcha Latte', profitMargin: 0.38 },
  // 2026-03-09 (net 14,100, ~40 orders)
  { id: 'r0309a', date: '2026-03-09', storeId: 's1', cashierCode: 'BRAI01', orders: 22, grossSales: 8140, discounts: 240, netSales: 7900, topItem: 'Americano', profitMargin: 0.42 },
  { id: 'r0309b', date: '2026-03-09', storeId: 's2', cashierCode: 'BRPR01', orders: 18, grossSales: 6390, discounts: 190, netSales: 6200, topItem: 'Matcha Latte', profitMargin: 0.38 },
  // 2026-03-10 (net 16,800, ~48 orders)
  { id: 'r0310a', date: '2026-03-10', storeId: 's1', cashierCode: 'BRAI01', orders: 27, grossSales: 9690, discounts: 280, netSales: 9410, topItem: 'Cappuccino', profitMargin: 0.43 },
  { id: 'r0310b', date: '2026-03-10', storeId: 's2', cashierCode: 'BRPR01', orders: 21, grossSales: 7610, discounts: 220, netSales: 7390, topItem: 'Caramel Latte', profitMargin: 0.39 },
  // 2026-03-11 (net 12,900, ~37 orders)
  { id: 'r0311a', date: '2026-03-11', storeId: 's1', cashierCode: 'BRAI01', orders: 21, grossSales: 7440, discounts: 220, netSales: 7220, topItem: 'Butter Croissant', profitMargin: 0.36 },
  { id: 'r0311b', date: '2026-03-11', storeId: 's2', cashierCode: 'BRPR01', orders: 16, grossSales: 5850, discounts: 170, netSales: 5680, topItem: 'Cappuccino', profitMargin: 0.40 },
  // 2026-03-12 (net 13,200, ~38 orders)
  { id: 'r0312a', date: '2026-03-12', storeId: 's1', cashierCode: 'BRAI01', orders: 21, grossSales: 7610, discounts: 220, netSales: 7390, topItem: 'Matcha Latte', profitMargin: 0.38 },
  { id: 'r0312b', date: '2026-03-12', storeId: 's2', cashierCode: 'BRPR01', orders: 17, grossSales: 5980, discounts: 170, netSales: 5810, topItem: 'Caramel Latte', profitMargin: 0.39 },
]

export const categoryDailySeries = {
  Coffee: [
    { label: 'Mon', value: 220 },
    { label: 'Tue', value: 250 },
    { label: 'Wed', value: 240 },
    { label: 'Thu', value: 260 },
    { label: 'Fri', value: 300 },
    { label: 'Sat', value: 340 },
    { label: 'Sun', value: 310 },
  ],
  Tea: [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 135 },
    { label: 'Wed', value: 110 },
    { label: 'Thu', value: 140 },
    { label: 'Fri', value: 160 },
    { label: 'Sat', value: 180 },
    { label: 'Sun', value: 150 },
  ],
  Snack: [
    { label: 'Mon', value: 90 },
    { label: 'Tue', value: 100 },
    { label: 'Wed', value: 95 },
    { label: 'Thu', value: 110 },
    { label: 'Fri', value: 130 },
    { label: 'Sat', value: 150 },
    { label: 'Sun', value: 140 },
  ],
}

export const topByCategoryToday = [
  { category: 'Coffee', item: 'Cappuccino', qty: 74 },
  { category: 'Tea', item: 'Matcha Latte', qty: 52 },
  { category: 'Snack', item: 'Butter Croissant', qty: 63 },
]

// ============ Supabase Integration ============

/**
 * Fetch business details by ID from Supabase
 */
export async function fetchBusinessDetails(businessId: number) {
  return getBusinessById(businessId)
}

/**
 * Fetch employees for a business from Supabase
 */
export async function fetchEmployeesForBusiness(businessId: number) {
  return getEmployees(businessId)
}

/**
 * Fetch products for a business from Supabase
 */
export async function fetchProductsForBusiness(businessId: number) {
  return getProducts(businessId)
}

/**
 * Add a new employee (manager or cashier)
 */
export async function addNewEmployee(
  businessId: number,
  role: 'manager' | 'cashier',
  username: string,
  password: string
) {
  return addEmployee(businessId, role, username, password)
}

/**
 * Remove an employee
 */
export async function removeEmployee(role: 'manager' | 'cashier', employeeId: number) {
  return deleteEmployee(role, employeeId)
}

/**
 * Create a new product
 */
export async function createNewProduct(
  businessId: number,
  name: string,
  price: number,
  size?: string,
  categoryId?: number
) {
  return createProduct(businessId, name, price, size, categoryId)
}

/**
 * Update an existing product
 */
export async function updateExistingProduct(
  productId: number,
  updates: Partial<Pick<Product, 'item_name' | 'item_size' | 'item_price' | 'category_id'>>
) {
  return updateProduct(productId, updates)
}

/**
 * Delete a product
 */
export async function deleteExistingProduct(productId: number) {
  return deleteProduct(productId)
}

/**
 * Fetch sales history for a business
 */
export async function fetchSalesHistoryForBusiness(businessId: number, limit?: number) {
  return getSalesHistory(businessId, limit)
}
