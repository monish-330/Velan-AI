import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

// Server URL for API calls
export const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-57d47cd5`

// API helper functions
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${serverUrl}${endpoint}`
  
  // Get auth token from current session
  const { data: { session } } = await supabase.auth.getSession()
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (session?.access_token) {
    defaultHeaders['Authorization'] = `Bearer ${session.access_token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }
  
  return response.json()
}

// Authentication helpers
export const authAPI = {
  signUp: async (email: string, password: string, userData: any) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, userData })
    })
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw new Error(error.message)
    
    return data
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },
  
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },
  
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}

// User profile API
export const profileAPI = {
  get: async () => {
    return apiCall('/user/profile')
  },
  
  update: async (profileData: any) => {
    return apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }
}

// Posts API
export const postsAPI = {
  getAll: async () => {
    return apiCall('/posts')
  },
  
  create: async (postData: any) => {
    return apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    })
  }
}

// Tools API
export const toolsAPI = {
  getAll: async () => {
    return apiCall('/tools')
  },
  
  create: async (toolData: any) => {
    return apiCall('/tools', {
      method: 'POST',
      body: JSON.stringify(toolData)
    })
  }
}

// Seeds API
export const seedsAPI = {
  getAll: async () => {
    return apiCall('/seeds')
  },
  
  create: async (seedData: any) => {
    return apiCall('/seeds', {
      method: 'POST',
      body: JSON.stringify(seedData)
    })
  }
}

// Notifications API
export const notificationsAPI = {
  subscribe: async (subscription: any, preferences: any) => {
    return apiCall('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription, preferences })
    })
  },
  
  getAll: async () => {
    return apiCall('/notifications')
  },
  
  markAsRead: async (notificationId: string) => {
    return apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    })
  },
  
  sendAlert: async (type: string, message: any, targetUsers?: string[]) => {
    return apiCall('/notifications/send', {
      method: 'POST',
      body: JSON.stringify({ type, message, targetUsers })
    })
  }
}

// Weather alerts API
export const weatherAPI = {
  createAlert: async (alertType: string, location: string, severity: string, message: string) => {
    return apiCall('/weather/alerts', {
      method: 'POST',
      body: JSON.stringify({ alertType, location, severity, message })
    })
  }
}

// Price alerts API
export const priceAPI = {
  createAlert: async (cropType: string, priceChange: number, newPrice: number, location: string) => {
    return apiCall('/price/alerts', {
      method: 'POST',
      body: JSON.stringify({ cropType, priceChange, newPrice, location })
    })
  }
}