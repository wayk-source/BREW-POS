import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get both managers and cashiers for the business
    const [managersResult, cashiersResult] = await Promise.all([
      supabase
        .from('user_manager')
        .select('*')
        .eq('store_id', businessId),
      supabase
        .from('user_cashier')
        .select('*')
        .eq('store_id', businessId),
    ])

    const managers = managersResult.data || []
    const cashiers = cashiersResult.data || []

    const allEmployees = [
      ...managers.map(m => ({ ...m, role: 'Manager' as const, type: 'manager' })),
      ...cashiers.map(c => ({ ...c, role: 'Cashier' as const, type: 'cashier' })),
    ]

    return NextResponse.json({ employees: allEmployees }, { status: 200 })
  } catch (error) {
    console.error('Employees GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { businessId, role, username, password } = await request.json()

    if (!businessId || !role || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: businessId, role, username, password' },
        { status: 400 }
      )
    }

    if (role !== 'manager' && role !== 'cashier') {
      return NextResponse.json({ error: 'Role must be either manager or cashier' }, { status: 400 })
    }

    const supabase = createAdminClient()
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
      return NextResponse.json(
        { error: `Failed to create ${role}`, details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        employee: { 
          id: data.id, 
          username: data.username, 
          role: role === 'manager' ? 'Manager' : 'Cashier',
          type: role,
          storeId: businessId 
        } 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Employees POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const role = searchParams.get('role')

    if (!id || !role) {
      return NextResponse.json({ error: 'Missing required parameters: id, role' }, { status: 400 })
    }

    if (role !== 'manager' && role !== 'cashier') {
      return NextResponse.json({ error: 'Role must be either manager or cashier' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const tableName = role === 'manager' ? 'user_manager' : 'user_cashier'

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting ${role}:`, error)
      return NextResponse.json(
        { error: `Failed to delete ${role}`, details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Employees DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
