import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email, password, displayName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      }
    }
  })
  
  if (data.user && !error) {
    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        display_name: displayName,
        bio: '',
        location: '',
        artforms: '',
        avatar_url: ''
      })
    
    if (profileError) {
      console.error('Profile creation error:', profileError)
    }
  }
  
  return { data, error }
}

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getCurrentUser = () => {
  return supabase.auth.getUser()
}

// Upload image to storage
export const uploadImage = async (file, bucket = 'posts') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)
  
  if (error) return { data: null, error }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
  
  return { data: { path: fileName, url: publicUrl }, error: null }
}