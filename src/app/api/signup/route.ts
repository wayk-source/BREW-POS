import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(request: NextRequest) {
  console.log('=== /api/signup endpoint called ===')
  try {
    const { email, password, name, businessName } = await request.json()
    const normalizedEmail = email.toLowerCase()
    console.log('Received signup request for email:', email)

    if (!email || !password || !name || !businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let supabase
    try {
      supabase = createAdminClient()
    } catch (clientError) {
      console.error('Failed to create admin client:', clientError)
      return NextResponse.json(
        { error: 'Server configuration error: Supabase admin client not available' },
        { status: 500 }
      )
    }

    console.log('Received signup request for email:', email, '| normalized:', normalizedEmail)

    // Step 0: Check for existing Auth user (case-insensitive) and handle orphaned accounts
    console.log('Checking for existing Auth user...')
    try {
      const { data: authUsers, error: authListError } = await supabase.auth.admin.listUsers()
      if (authListError) {
        console.error('Error listing Auth users:', authListError)
      } else {
        const existingAuthUser = authUsers.users.find(u => u.email?.toLowerCase() === normalizedEmail)
        if (existingAuthUser) {
          console.log('FOUND EXISTING AUTH USER:', {
            id: existingAuthUser.id,
            email: existingAuthUser.email,
            created_at: existingAuthUser.created_at,
          })
          
          // Check if corresponding user_owner record exists
          const { data: existingOwners } = await supabase
            .from('user_owner')
            .select('id')
            .eq('username', normalizedEmail)
            .limit(1)
          
          if (existingOwners && existingOwners.length > 0) {
            console.log('Corresponding user_owner record exists - this email is already registered')
            return NextResponse.json(
              {
                error: 'An account with this email already exists. Please use a different email or try logging in.',
                code: 'EMAIL_EXISTS'
              },
              { status: 409 }
            )
          } else {
            console.log('Auth user exists but NO user_owner record - cleaning up orphaned Auth user')
            // Orphaned Auth user - delete it and proceed with signup
            try {
              await supabase.auth.admin.deleteUser(existingAuthUser.id)
              console.log('Deleted orphaned Auth user:', existingAuthUser.id)
            } catch (deleteError) {
              console.error('Failed to delete orphaned Auth user:', deleteError)
            }
          }
        } else {
          console.log('No existing Auth user found with email:', normalizedEmail)
        }
      }
    } catch (diagError) {
      console.error('Error during pre-check:', diagError)
      // Continue with signup attempt anyway
    }

    // Step 1: Create the user in Supabase Auth
    console.log('Attempting to create auth user for:', normalizedEmail)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'owner',
      },
    })

    if (authError || !authData.user) {
      console.error('Auth user creation error:', authError)
      console.error('Auth error full details:', {
        code: authError?.code,
        message: authError?.message,
        status: authError?.status,
      })
      console.error('AuthData:', authData)
      
      // Determine if this is an email exists error
      let isEmailExists = false
      let errorMessage = 'Failed to create auth user'
      
      if (authError) {
        // Check by error code (most reliable) or by message containing common phrases
        const message = authError?.message?.toLowerCase() || ''
        console.log('Auth error debugging:', {
          code: authError?.code,
          message: authError?.message,
          lowerMessage: message,
          checks: {
            code_user_already_exists: authError?.code === 'user_already_exists',
            code_email_exists: authError?.code === 'email_exists',
            msg_contains_already_exists: message.includes('already exists'),
            msg_contains_already_registered: message.includes('already registered'),
            msg_contains_email_already: message.includes('email already'),
            msg_contains_user_already: message.includes('user already')
          }
        })
        
        isEmailExists = authError?.code === 'user_already_exists' ||
                        authError?.code === 'email_exists' ||
                        message.includes('already exists') ||
                        message.includes('already registered') ||
                        message.includes('email already') ||
                        message.includes('user already')
        
        errorMessage = authError?.message || errorMessage
      } else if (!authData.user) {
        // No error but no user returned - could be email exists or other issue
        // Try to check if the email already exists by querying the database
        console.log('No authError but no user returned, checking if email already exists in database...')
        try {
          const checkSupabase = createAdminClient()
          const { data: existingUsers } = await checkSupabase
            .from('user_owner')
            .select('username')
            .eq('username', email.toLowerCase())
            .limit(1)
          
          if (existingUsers && existingUsers.length > 0) {
            isEmailExists = true
            errorMessage = 'An account with this email already exists.'
            console.log('Found existing user in database with email:', email.toLowerCase())
          } else {
            // User doesn't exist in owner table, might be a different issue
            errorMessage = 'Failed to create user - no user returned from auth'
          }
        } catch (checkError) {
          console.error('Error checking for existing user:', checkError)
          errorMessage = 'Failed to create user'
        }
      }
      
      if (isEmailExists) {
        console.log('Detected email exists error, returning EMAIL_EXISTS response')
        return NextResponse.json(
          {
            error: 'An account with this email already exists. Please use a different email or try logging in.',
            code: 'EMAIL_EXISTS'
          },
          { status: 409 } // Conflict
        )
      }
      
      // Not an email exists error, return generic failure with details
      return NextResponse.json(
        {
          error: errorMessage,
          code: authError?.code || 'UNKNOWN_ERROR',
          details: authError?.message || 'No user data returned'
        },
        { status: 400 }
      )
      
      return NextResponse.json(
        {
          error: 'Failed to create auth user',
          details: authError?.message,
          code: authError?.code,
          status: authError?.status
        },
        { status: 400 }
      )
    }
    
    console.log('Auth user created successfully:', authData.user.id)

    // Step 2: Create business in business_name table
    const { data: businessData, error: businessError } = await supabase
      .from('business_name')
      .insert({
        store_name: businessName,
        location: null,
      })
      .select()
      .single()

    if (businessError || !businessData) {
      console.error('Business creation error:', businessError)
      // Try to clean up auth user
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (deleteError) {
        console.error('Failed to cleanup auth user:', deleteError)
      }
      return NextResponse.json(
        { error: 'Failed to create business', details: businessError?.message },
        { status: 400 }
      )
    }

    // Step 3: Create owner in user_owner table
    const { data: ownerData, error: ownerError } = await supabase
      .from('user_owner')
      .insert({
        username: email.toLowerCase(),
        password: password,
        store_id: businessData.id,
      })
      .select()
      .single()

    if (ownerError || !ownerData) {
      console.error('Owner creation error:', ownerError)
      // Rollback: delete business and auth user
      await supabase.from('business_name').delete().eq('id', businessData.id)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Failed to create owner record', details: ownerError?.message },
        { status: 400 }
      )
    }

    // Step 4: Update auth user metadata with full info
    await supabase.auth.admin.updateUserById(
      authData.user.id,
      {
        user_metadata: {
          name,
          role: 'owner',
          businessId: businessData.id,
          storeId: businessData.id,
          userId: ownerData.id,
          username: email.toLowerCase(),
        },
      }
    )

    return NextResponse.json(
      {
        success: true,
        user: {
          id: authData.user.id,
          email: email.toLowerCase(),
          name,
          role: 'owner',
          businessId: String(businessData.id),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Signup exception:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
