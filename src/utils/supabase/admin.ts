import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const createAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required')
  }
  
  // Log the key type (first 20 chars) to verify it's a service key, not anon key
  const keyPrefix = supabaseServiceKey.substring(0, 20)
  console.log('Creating admin client with key prefix:', keyPrefix, '...')
  
  if (supabaseServiceKey.startsWith('sb_publishable_') || supabaseServiceKey.startsWith('sb_anon_')) {
    console.warn('WARNING: Using anon/publishable key instead of service role key!')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
