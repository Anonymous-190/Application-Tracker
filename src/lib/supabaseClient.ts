import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pfqaaflkmxqtqzafrsvh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcWFhZmxrbXhxdHF6YWZyc3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzUxNzIsImV4cCI6MjA2Mzk1MTE3Mn0.wajgCY9vyEO8eqsuC1jt0b5WHcyZ68iwWaZQ3GIldK4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
