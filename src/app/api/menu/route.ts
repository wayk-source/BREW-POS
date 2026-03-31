import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    // Note: The product table doesn't have a businessId field in the current schema
    // All products are global. If you need per-business products, the schema needs updating.
    const supabase = createAdminClient()

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
      console.error('Error fetching menu items:', error)
      return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 })
    }

    return NextResponse.json({ items: data }, { status: 200 })
  } catch (error) {
    console.error('Menu GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, price, size, categoryId } = await request.json()

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('product')
      .insert({
        item_name: name,
        item_price: price,
        item_size: size || null,
        category_id: categoryId || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating menu item:', error)
      return NextResponse.json({ error: 'Failed to create menu item', details: error.message }, { status: 400 })
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (error) {
    console.error('Menu POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, price, size, categoryId } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const updates: any = {}
    if (name !== undefined) updates.item_name = name
    if (price !== undefined) updates.item_price = price
    if (size !== undefined) updates.item_size = size
    if (categoryId !== undefined) updates.category_id = categoryId

    const { data, error } = await supabase
      .from('product')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating menu item:', error)
      return NextResponse.json({ error: 'Failed to update menu item', details: error.message }, { status: 400 })
    }

    return NextResponse.json({ item: data }, { status: 200 })
  } catch (error) {
    console.error('Menu PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('product')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting menu item:', error)
      return NextResponse.json({ error: 'Failed to delete menu item', details: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Menu DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
