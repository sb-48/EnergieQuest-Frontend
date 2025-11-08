import { createClient } from '@supabase/supabase-js'

// Load environment variables (Vite requires VITE_ prefix)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vhnvuvblyrcunlvpljyv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobnZ1dmJseXJjdW5sdnBsanl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzg5ODksImV4cCI6MjA3NzY1NDk4OX0.KEQG3etH-F82C99i-mbo_OXsgH_cQD9d165atFaNbRg'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
  console.error('Using fallback values for development.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
