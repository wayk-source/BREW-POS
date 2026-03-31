# Owner Portal Implementation Guide

## Overview
Each owner user who signs up to the system now has a separate, isolated portal that displays only their business data. The portal is role-based and protected with authentication checks.

## Key Changes Made

### 1. Authentication & Authorization
**File: `src/app/owner/layout.tsx`**
- Added authentication checks to protect the owner portal
- Verifies user role is 'owner' before granting access
- Automatically redirects non-owners to appropriate dashboards
- Redirects unauthenticated users to /owner/login

### 2. Owner Context Hook
**File: `src/lib/useOwnerContext.ts`**
- New hook that retrieves current owner's business context
- Fetches businessId, businessName, ownerEmail, and ownerName from:
  - Supabase Auth metadata (businessId)
  - business_name table (business details)
- Provides loading and error states
- Ensures data isolation - each owner only sees their own business

### 3. Owner-Specific Database Queries
**File: `src/lib/owner-db.ts`**
New functions for owner-scoped data access:
- `getOwnerBusiness()` - Get owner's business info
- `getOwnerMenuItems()` - Get menu items/products
- `createOwnerMenuItem()` - Add new menu item
- `updateOwnerMenuItem()` - Update menu item
- `deleteOwnerMenuItem()` - Delete menu item
- `getOwnerEmployees()` - Get employees (managers & cashiers)
- `addOwnerEmployee()` - Add new employee
- `deleteOwnerEmployee()` - Remove employee
- `getOwnerSalesHistory()` - Get sales records
- `getOwnerSalesAnalytics()` - Get sales trends

### 4. Dynamic Owner Dashboard
**File: `src/app/owner/page.tsx`**
- Updated to fetch real data from Supabase based on businessId
- Shows dynamic business name (not hardcoded "Brew Haven Café")
- Displays actual employee count
- Loads sales analytics for the logged-in owner
- Shows loading state while data fetches
- Placeholder sections for when no sales data exists yet

## Data Isolation Architecture

```
Sign Up Flow:
├── User signs up (email, password, name, businessName)
├── Creates business in business_name table
├── Creates owner in user_owner table (linked to business via store_id)
├── Creates auth user with businessId in metadata
└── Each subsequent login retrieves businessId from auth metadata

Portal Access:
├── User navigates to /owner
├── Layout checks auth status
├── Verifies role = 'owner'
├── Hook retrieves businessId from auth metadata
├── All data queries filter by businessId
└── Owner only sees their own data (complete isolation)
```

## Next Steps to Complete

### Phase 2: Update All Owner Pages
These pages need to use owner-db functions instead of seed data:

1. **Owner Stores Page** (`src/app/owner/stores/page.tsx`)
   - Should query stores from Supabase
   - Only show stores for this business
   - Link employees to stores via businessId/storeId

2. **Owner Employees Page** (`src/app/owner/employees/page.tsx`)
   - Use `getOwnerEmployees()` instead of seed data
   - Use `addOwnerEmployee()` to create new employees
   - Use `deleteOwnerEmployee()` to remove employees

3. **Manager Menu Page** (`src/app/owner/menu/page.tsx`)
   - Use `getOwnerMenuItems()` to fetch products
   - Use `createOwnerMenuItem()` to add items
   - Use `updateOwnerMenuItem()` to edit items
   - Use `deleteOwnerMenuItem()` to remove items

4. **Owner Reports Page** (`src/app/owner/reports/page.tsx`)
   - Use `getOwnerSalesHistory()` for transaction list
   - Use `getOwnerSalesAnalytics()` for trends

### Phase 3: Database Schema Updates Needed
If not already in schema:
- Ensure `business_name` has `store_name` and `location`
- Ensure `user_owner` has `store_id` linking to `business_name.id`
- Ensure `product` table has proper foreign keys
- Consider adding `business_id` to product, user_manager, user_cashier tables for better querying

## Testing Checklist

- [ ] Owner 1 signs up with business "Coffee Shop A"
- [ ] Owner 1 logs in - sees "Coffee Shop A" in dashboard
- [ ] Owner 1 creates menu items/employees - appear in their portal
- [ ] Owner 2 signs up with business "Coffee Shop B"
- [ ] Owner 2 logs in - sees "Coffee Shop B" (NOT Owner 1's data)
- [ ] Verify Owner 1 cannot see Owner 2's data
- [ ] Verify business name displays correctly for each owner
- [ ] Verify logout works and redirects to login
- [ ] Verify non-owners redirected to appropriate dashboard

## Authentication Flow

```
Sign Up → Create Business → Create Auth User → Redirect to /owner/setup
                                                         ↓
                                                    /owner/login
                                                         ↓
Schedule Settings → /owner (Dashboard)
                    ├── /owner/stores
                    ├── /owner/employees
                    ├── /owner/menu
                    ├── /owner/reports
                    └── /owner/settings
```

## Security Considerations

✓ Port authenticated - users must be logged in
✓ Role-based access - only owners can access
✓ Data isolation - businessId filters all queries
✓ Session-based - auth state from Supabase Auth
✓ Each owner's data is isolated via businessId

## Usage Examples

### Get Current Owner's Data
```typescript
import { useOwnerContext } from '@/lib/useOwnerContext'
import { getOwnerMenuItems, getOwnerEmployees } from '@/lib/owner-db'

export default function MyComponent() {
  const { businessId, businessName, loading } = useOwnerContext()
  
  useEffect(() => {
    if (!businessId) return
    
    const [items, staff] = await Promise.all([
      getOwnerMenuItems(Number(businessId)),
      getOwnerEmployees(Number(businessId)),
    ])
    
    // Use items and staff - all filtered to this business
  }, [businessId])
}
```

### Create Owner-Specific Data
```typescript
// Create a new menu item for owner's business
const newItem = await createOwnerMenuItem(
  Number(businessId),
  'Cappuccino',
  150,
  categoryId,
  'Large'
)

// Add an employee
const newEmployee = await addOwnerEmployee(
  Number(businessId),
  'cashier',
  'john@example.com',
  'password123'
)
```

## Important Notes

- All queries use `businessId` as the filter parameter
- LocalStorage is being phased out in favor of Supabase
- Each owner has one business (1:1 relationship)
- Multiple stores per business handled via separate store_id foreign key
- Employees belong to specific stores within a business
