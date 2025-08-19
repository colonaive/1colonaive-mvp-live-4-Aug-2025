import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, authApi, profileApi, UserProfile } from '../supabase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  userType: string | null
  isAdmin: boolean  // REQUIRED by BOLT ProtectedRoute
  isSuperAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  async function loadUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) await loadUserProfile(user.id)
    } catch (error) {
      console.error('[AuthContext] Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }
  loadUser()
 
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setUser(session?.user || null)
      setTimeout(async () => {
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }, 0)
    }
  )
 
  return () => subscription.unsubscribe()
}, [])

  async function loadUserProfile(userId: string) {
    try {
      console.log('[AuthContext] Loading profile for user:', userId)
      const userProfile = await profileApi.getProfile(userId)
      
      if (userProfile) {
        console.log('[AuthContext] Profile found:', userProfile)
        setProfile(userProfile)
      } else {
        console.log('[AuthContext] No profile found, creating basic profile')
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const basicProfile: Partial<UserProfile> = {
            id: userId,
            email: user.email || '',
            user_type: 'champion',
            status: 'active'
          }
          
          try {
            console.log('[AuthContext] Creating profile:', basicProfile)
            await profileApi.updateProfile(userId, basicProfile)
            const retryProfile = await profileApi.getProfile(userId)
            if (retryProfile) {
              setProfile(retryProfile)
              console.log('[AuthContext] Profile created successfully')
            }
          } catch (createError) {
            console.error('[AuthContext] Error creating profile:', createError)
            setProfile(basicProfile as UserProfile)
          }
        }
      }
    } catch (error) {
      console.error('[AuthContext] Error loading user profile:', error)
    }
  }

  async function refreshProfile() {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      console.log('[AuthContext] Signing in user:', email)
      
      // Check for missing environment variables
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return { success: false, error: 'System configuration error. Please contact support.' }
      }
      
      const result = await authApi.signIn(email, password)
      
      if (result.error) {
        console.error('[AuthContext] Sign in error:', result.error)
        
        // Check if the error is due to email confirmation
        if (result.error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email to continue.', requiresEmailConfirmation: true }
        }
        
        // Check for invalid credentials
        if (result.error.message.includes('Invalid login credentials') || result.error.message.includes('invalid_credentials')) {
          return { success: false, error: 'Email or password is incorrect.' }
        }
        
        // Check for API key errors
        if (result.error.message.includes('Invalid API key')) {
          return { success: false, error: 'System configuration error. Please contact support.' }
        }
        
        return { success: false, error: result.error.message }
      }
      
      console.log('[AuthContext] Sign in successful')
      return { success: true }
    } catch (error: any) {
      console.error('[AuthContext] Sign in exception:', error)
      return { success: false, error: error.message || 'An unexpected error occurred' }
    }
  }

  async function signUp(email: string, password: string, userData = {}) {
    try {
      console.log('[AuthContext] Signing up user:', email)
      
      // Check for missing environment variables
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return { success: false, error: 'System configuration error. Please contact support.' }
      }
      
      const result = await authApi.signUp(email, password, userData)
      
      if (result.error) {
        console.error('[AuthContext] Sign up error:', result.error)
        
        // Check for email already registered
        if (result.error.message.includes('already registered') || result.error.message.includes('User already registered')) {
          return { success: false, error: 'This email is already registered. Try logging in instead.' }
        }
        
        // Check for invalid email
        if (result.error.message.includes('Invalid email')) {
          return { success: false, error: 'Please enter a valid email address.' }
        }
        
        // Check for API key errors
        if (result.error.message.includes('Invalid API key')) {
          return { success: false, error: 'System configuration error. Please contact support.' }
        }
        
        const errorMessage = result.error.message || 'Unknown error';
        console.error('[AuthContext] Detailed error:', errorMessage);
        return { success: false, error: errorMessage }
      }
      
      console.log('[AuthContext] Sign up successful')
      return { success: true }
    } catch (error: any) {
      console.error('[AuthContext] Sign up exception:', error)
      const errorMessage = error.message || 'An unexpected error occurred';
      console.error('[AuthContext] Detailed exception:', errorMessage);
      return { success: false, error: errorMessage }
    }
  }

  async function signOut() {
    try {
      console.log('[AuthContext] Signing out user')
      
      // Clear all local storage data
      localStorage.clear()
      
      // Clear all session storage
      sessionStorage.clear()
      
      // Sign out from Supabase
      const { error } = await authApi.signOut()
      
      if (error) {
        console.error('[AuthContext] Error signing out:', error)
        return { success: false, error: error.message }
      }
      
      // Clear React state
      setUser(null)
      setProfile(null)
      setLoading(false)
      
      console.log('[AuthContext] Sign out successful, all data cleared')
      
      // Reload the page to ensure clean state
      window.location.href = '/login'
      
      return { success: true }
    } catch (error: any) {
      console.error('[AuthContext] Error signing out:', error)
      // Force clear state even if signOut fails
      setUser(null)
      setProfile(null)
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/login'
      return { success: false, error: error.message || 'An unexpected error occurred' }
    }
  }

  const isSuperAdmin = profile?.is_super_admin || false
  const isAdmin = isSuperAdmin || profile?.user_type === 'admin' || false

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    userType: profile?.user_type || null,
    isAdmin,
    isSuperAdmin,
    signIn,
    signUp,
    signOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}