import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
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
      return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 })
    }

    return NextResponse.json({ businesses: data }, { status: 200 })
  } catch (error) {
    console.error('Business GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { store_name, location } = await request.json()

    if (!store_name) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('business_name')
      .insert({
        store_name,
        location: location || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating business:', error)
      return NextResponse.json({ error: 'Failed to create business', details: error.message }, { status: 400 })
    }

    return NextResponse.json({ business: data }, { status: 201 })
  } catch (error) {
    console.error('Business POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
