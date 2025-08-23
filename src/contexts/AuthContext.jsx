import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Profile fetch error:', error)
        return
      }
      
      setProfile(data)
    } catch (error) {
      console.error('Profile fetch error:', error)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp: async (email, password, displayName) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName }
        }
      })
      
      if (data.user && !error) {
        // Create profile
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
    },
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    updateProfile: async (updates) => {
      if (!user) return { error: 'No user logged in' }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (data && !error) {
        setProfile(data)
      }
      
      return { data, error }
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}