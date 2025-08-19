import { createClient } from '@supabase/supabase-js'

// Frontend client using environment variables (build-time)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL environment variable is required')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface UserProfile {
  id: string
  email: string
  full_name?: string 
  phone_number?: string 
  address?: string 
  avatar_url?: string 
  user_type: 'champion' | 'corporate_contact' | 'gpclinic' | 'specialist' | 'admin' | 'super_admin'
  quiz_score?: number
  friends_invited?: number
  actions_completed?: number
  corporate_id?: string
  status?: string
  is_super_admin?: boolean
  created_at?: string
  updated_at?: string
}

export interface Champion {
  id: string
  date_of_birth?: string
  gender?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_conditions?: string[]
  screening_status?: string
  last_screening_date?: string
  next_screening_date?: string
  created_at?: string
}

export interface GPClinic {
  id: string
  clinic_name: string
  doctor_full_name: string
  license_number: string
  address: string
  postal_code: string
  region: string
  services_offered: string[]
  operating_hours?: any
  languages_spoken?: string
  website?: string
  description?: string
  created_at?: string
}

export interface Corporate {
  id: string
  user_id: string
  company_name: string
  uen: string
  industry: string
  company_size: string
  contact_person_name: string
  designation?: string
  created_at?: string
}

export interface Specialist {
  id: string
  medical_registration_no: string
  qualifications: string
  field_of_specialization: string
  clinic_affiliation: string
  address: string
  postal_code: string
  region: string
  website?: string
  years_of_experience: number
  specialties: string[]
  languages: string
  operating_hours?: any
  insurance_partners?: string
  notes?: string
  created_at?: string
}

export const authApi = {
  async signIn(email: string, password: string) {
    console.log('[Supabase] Attempting sign in for:', email)
    const result = await supabase.auth.signInWithPassword({  
      email, 
      password 
    })
    console.log('[Supabase] Sign in result:', result.error ? 'ERROR' : 'SUCCESS')
    if (result.error) {
      console.error('[Supabase] Sign in error details:', result.error)
    }
    return result
  },
  
  async signUp(email: string, password: string, userData = {}) {
    console.log('[Supabase] Attempting sign up for:', email)
    try {
      const result = await supabase.auth.signUp({  
        email, 
        password,  
        options: { 
          data: userData,
          emailRedirectTo: 'https://www.colonaive.ai/login?verified=true'
        } 
      })
      
      console.log('[Supabase] Sign up result:', result.error ? 'ERROR' : 'SUCCESS')
      
      if (result.error) {
        console.error('[Supabase] Sign up error details:', result.error.message) 
        console.error('[Supabase] Sign up error code:', result.error.code)
        console.error('[Supabase] Sign up error status:', result.error.status)
        
        if (result.error.message.includes('Email rate limit')) {
          throw new Error('Too many signup attempts. Please wait a few minutes and try again.')
        }
         
        if (result.error.message.includes('already registered')) {
          throw new Error('This email is already registered. Try logging in instead.')
        }
        
        if (result.error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.')
        }
        
        if (result.error.message.includes('Database error saving new user')) {
          throw new Error('There was a database error during registration. Our team has been notified. Please try again in a few minutes.')
        }
         
        throw new Error(`Signup failed: ${result.error.message}`)
      }
      
      console.log('[Supabase] Signup successful')
      return result
    } catch (err) {
      console.error('[Supabase] Unexpected signup error:', err)
      throw err
    }
  },
  
  async signOut() {
    console.log('[Supabase] Attempting sign out')
    try {
      // Perform the sign out which also clears the session
      const result = await supabase.auth.signOut()
      console.log('[Supabase] Sign out result:', result.error ? 'ERROR' : 'SUCCESS')
      
      if (result.error) {
        console.error('[Supabase] Sign out error details:', result.error)
      } else {
        // Clear any persisted storage
        const storageKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') || 
          key.startsWith('supabase-') ||
          key.includes('auth')
        )
        storageKeys.forEach(key => localStorage.removeItem(key))
      }
      
      return result
    } catch (error) {
      console.error('[Supabase] Sign out error:', error)
      // Even if there's an error, try to clear storage
      localStorage.clear()
      sessionStorage.clear()
      throw error
    }
  },
  
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('[Supabase] Error getting current user:', error)
      return null
    }
    return user
  },
  
  async resetPassword(email: string) {
    console.log('[Supabase] Requesting password reset for:', email)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.protocol}//${window.location.host}/reset-password`
    })
    if (error) {
      console.error('[Supabase] Password reset error:', error.message)
      throw error
    }
    return data
  },
  
  async updatePassword(newPassword: string) {
    console.log('[Supabase] Updating password')
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) {
      console.error('[Supabase] Update password error:', error.message)
      throw error
    }
    return data
  }
}

export const profileApi = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    console.log('[Supabase] Getting profile for user:', userId)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    if (error) {
      console.error('[Supabase] Error getting profile:', error)
      return null
    }
    
    console.log('[Supabase] Profile retrieved:', data ? 'SUCCESS' : 'NOT_FOUND')
    return data
  },
  
  async updateProfile(userId: string, profile: Partial<UserProfile>) {
    console.log('[Supabase] Updating profile for user:', userId)
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        ...profile,
        id: userId,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('[Supabase] Error updating profile:', error)
      throw error
    }
    
    console.log('[Supabase] Profile updated successfully')
    return data
  },
  
  async getChampionData(userId: string): Promise<Champion | null> {
    console.log('[Supabase] Getting champion data for user:', userId)
    const { data, error } = await supabase
      .from('champions')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    if (error) {
      console.error('[Supabase] Error getting champion data:', error)
      return null
    }
    
    return data
  },
  
  async getGPClinicData(userId: string): Promise<GPClinic | null> {
    console.log('[Supabase] Getting GP clinic data for user:', userId)
    const { data, error } = await supabase
      .from('gpclinics') 
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    if (error) {
      console.error('[Supabase] Error getting GP clinic data:', error)
      return null
    }
    
    return data
  },
  
  async getCorporateData(userId: string): Promise<Corporate | null> {
    console.log('[Supabase] Getting corporate data for user:', userId)
    const { data, error } = await supabase
      .from('corporates')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (error) {
      console.error('[Supabase] Error getting corporate data:', error)
      return null
    }
    
    return data
  },
  
  async getSpecialistData(userId: string): Promise<Specialist | null> {
    console.log('[Supabase] Getting specialist data for user:', userId)
    const { data, error } = await supabase
      .from('specialists')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    if (error) {
      console.error('[Supabase] Error getting specialist data:', error)
      return null
    }
    
    return data
  }
}

// Handle auth callback for email confirmations and redirects
export async function handleAuthCallback() {
  console.log('[Supabase] Handling auth callback')
  
  // Get all possible auth parameters from the URL
  const hashFragment = window.location.hash
  const searchParams = new URLSearchParams(window.location.search)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const email = searchParams.get('email')
  
  console.log('[Supabase] Auth callback params:', { 
    hashFragment: hashFragment ? 'present' : 'none', 
    tokenHash, 
    type, 
    email 
  })
  
  try {
    // First try hash fragment (SPA redirect)
    if (hashFragment && hashFragment.length > 0) {
      console.log('[Supabase] Processing hash fragment')
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(hashFragment)
        if (error) {
          console.error('[Supabase] Error exchanging code for session:', error.message)
          window.location.href = '/login?error=' + encodeURIComponent(error.message)
          return
        }
        
        if (data.session) {
          console.log('[Supabase] Session obtained successfully')
          
          // If this is a signup confirmation, update the profile status
          if (data.user && type === 'signup') {
            try {
              await supabase
                .from('profiles')
                .update({ status: 'active' })
                .eq('id', data.user.id)
              
              console.log('[Supabase] Profile status updated to active')
            } catch (profileError) {
              console.error('[Supabase] Error updating profile status:', profileError)
            }
          }
          
          window.location.href = '/login-redirect?verified=true'
          return
        }
      } catch (err) {
        console.error('[Supabase] Error processing hash fragment:', err)
        // Continue to try other methods
      }
    }
    
    // Then try token_hash parameter (email link)
    if (tokenHash) {
      console.log('[Supabase] Processing token_hash parameter')
      try {
        const verifyType = type || 'signup'
        console.log('[Supabase] Verifying OTP with type:', verifyType)
        
        const { data, error } = await supabase.auth.verifyOtp({
          type: verifyType as any,
          token_hash: tokenHash,
          email: email || undefined
        })
        
        if (error) {
          console.error('[Supabase] Error verifying OTP:', error.message)
          window.location.href = '/email-confirmed?error=' + encodeURIComponent(error.message)
          return
        }
        
        if (data.user) {
          console.log('[Supabase] Email verified successfully')
          
          // Update profile status
          try {
            await supabase
              .from('profiles')
              .update({ status: 'active' })
              .eq('id', data.user.id)
            
            console.log('[Supabase] Profile status updated to active')
          } catch (profileError) {
            console.error('[Supabase] Error updating profile status:', profileError)
          }
          
          window.location.href = '/email-confirmed?success=true'
          return
        }
      } catch (err) {
        console.error('[Supabase] Error verifying OTP:', err)
        window.location.href = '/email-confirmed?error=' + encodeURIComponent('Failed to verify email')
        return
      }
    }
    
    // If we get here, no valid auth parameters were found
    console.error('[Supabase] No valid auth parameters found')
    window.location.href = '/email-confirmed?error=Invalid or expired confirmation link'
  } catch (err) {
    console.error('[Supabase] Unexpected error in handleAuthCallback:', err)
    window.location.href = '/email-confirmed?error=An unexpected error occurred'
  }
}