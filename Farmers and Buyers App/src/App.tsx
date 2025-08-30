import React, { useState, useEffect } from 'react'
import { EntrancePage } from './components/EntrancePage'
import { LoginPage } from './components/LoginPage'
import { LanguageSelection } from './components/LanguageSelection'
import { RoleSelection } from './components/RoleSelection'
import { ProfileCreation } from './components/ProfileCreation'
import { FarmerHomePage } from './components/FarmerHomePage'
import { BuyerHomePage } from './components/BuyerHomePage'
import { RenterHomePage } from './components/RenterHomePage'
import { ToolsAndSeeds } from './components/ToolsAndSeeds'
import { WeatherPredictor } from './components/WeatherPredictor'
import { DiseaseIdentifier } from './components/DiseaseIdentifier'
import { PricePredictor } from './components/PricePredictor'
import { PostSection } from './components/PostSection'
import { supabase, authAPI, profileAPI } from './utils/supabase/client'
import { toast, Toaster } from 'sonner@2.0.3'

export type Language = 'en' | 'ta' | 'te' | 'hi'
export type UserRole = 'farmer' | 'buyer' | 'renter'
export type Page = 
  | 'entrance' 
  | 'login' 
  | 'language' 
  | 'role' 
  | 'profile' 
  | 'farmer-home' 
  | 'buyer-home' 
  | 'renter-home'
  | 'tools-seeds'
  | 'weather'
  | 'disease'
  | 'price'
  | 'post'

export interface User {
  id: string
  email: string
  role: UserRole
  profile: {
    name: string
    photo?: string
    location: string
    currentCultivation?: string
    phoneNumber: string
    emailAddress: string
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('entrance')
  const [language, setLanguage] = useState<Language>('en')
  const [user, setUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  // Load saved data and check authentication on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for saved language preference
        const savedLanguage = localStorage.getItem('velan-language')
        if (savedLanguage) {
          setLanguage(savedLanguage as Language)
        }

        // Check for existing session
        const session = await authAPI.getSession()
        if (session) {
          // Get user profile from backend
          const userProfile = await profileAPI.get()
          setUser(userProfile)
          setSelectedRole(userProfile.role)
          
          // Navigate to appropriate home page based on role
          switch (userProfile.role) {
            case 'farmer':
              setCurrentPage('farmer-home')
              break
            case 'buyer':
              setCurrentPage('buyer-home')
              break
            case 'renter':
              setCurrentPage('renter-home')
              break
          }
        }
      } catch (error) {
        console.log('App initialization error:', error)
        // If there's an error with the session/profile, start fresh
        await authAPI.signOut()
        setUser(null)
        setSelectedRole(null)
        setCurrentPage('entrance')
      }
    }

    initializeApp()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      // Attempt login with Supabase
      const { session } = await authAPI.signIn(email, password)
      
      if (session) {
        // Get user profile from backend
        const userProfile = await profileAPI.get()
        setUser(userProfile)
        setSelectedRole(userProfile.role)
        
        // Navigate directly to appropriate home page if profile exists
        switch (userProfile.role) {
          case 'farmer':
            setCurrentPage('farmer-home')
            break
          case 'buyer':
            setCurrentPage('buyer-home')
            break
          case 'renter':
            setCurrentPage('renter-home')
            break
        }
        
        toast.success('Successfully logged in!')
      }
    } catch (error: any) {
      console.log('Login error:', error)
      
      // If user not found or password incorrect, handle gracefully
      if (error.message.includes('Invalid login credentials')) {
        // Navigate to language selection for new user flow
        setCurrentPage('language')
        // Store temporary login data for signup
        sessionStorage.setItem('tempLoginData', JSON.stringify({ email }))
        toast.info('New user detected. Please complete your profile.')
      } else {
        toast.error('Login failed: ' + error.message)
      }
    }
  }

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage)
    localStorage.setItem('velan-language', selectedLanguage)
    setCurrentPage('role')
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setCurrentPage('profile')
  }

  const handleProfileComplete = async (profileData: any) => {
    try {
      const tempLoginData = JSON.parse(sessionStorage.getItem('tempLoginData') || '{}')
      
      // Create user account with backend
      const userData = {
        role: selectedRole!,
        ...profileData
      }
      
      // Generate a temporary password for the user
      const tempPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      
      const { user: newUser } = await authAPI.signUp(
        tempLoginData.email || profileData.emailAddress, 
        tempPassword, 
        userData
      )
      
      if (newUser) {
        // Automatically sign in the new user
        await authAPI.signIn(tempLoginData.email || profileData.emailAddress, tempPassword)
        
        // Get the complete user profile
        const userProfile = await profileAPI.get()
        setUser(userProfile)
        
        sessionStorage.removeItem('tempLoginData')
        
        // Navigate to appropriate home page
        switch (selectedRole) {
          case 'farmer':
            setCurrentPage('farmer-home')
            break
          case 'buyer':
            setCurrentPage('buyer-home')
            break
          case 'renter':
            setCurrentPage('renter-home')
            break
        }
        
        toast.success('Profile created successfully!')
      }
    } catch (error: any) {
      console.log('Profile creation error:', error)
      toast.error('Failed to create profile: ' + error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.signOut()
      setUser(null)
      setSelectedRole(null)
      setCurrentPage('entrance')
      toast.success('Successfully logged out!')
    } catch (error: any) {
      console.log('Logout error:', error)
      toast.error('Logout failed: ' + error.message)
    }
  }

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'entrance':
        return (
          <EntrancePage 
            onSignIn={() => setCurrentPage('login')}
            language={language}
          />
        )
      
      case 'login':
        return (
          <LoginPage 
            onLogin={handleLogin}
            onBack={() => setCurrentPage('entrance')}
            language={language}
          />
        )
      
      case 'language':
        return (
          <LanguageSelection 
            onLanguageSelect={handleLanguageSelect}
            currentLanguage={language}
          />
        )
      
      case 'role':
        return (
          <RoleSelection 
            onRoleSelect={handleRoleSelect}
            language={language}
          />
        )
      
      case 'profile':
        return (
          <ProfileCreation 
            onComplete={handleProfileComplete}
            role={selectedRole!}
            language={language}
          />
        )
      
      case 'farmer-home':
        return (
          <FarmerHomePage 
            user={user!}
            language={language}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        )
      
      case 'buyer-home':
        return (
          <BuyerHomePage 
            user={user!}
            language={language}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        )
      
      case 'renter-home':
        return (
          <RenterHomePage 
            user={user!}
            language={language}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        )
      
      case 'tools-seeds':
        return (
          <ToolsAndSeeds 
            language={language}
            onBack={() => setCurrentPage('farmer-home')}
          />
        )
      
      case 'weather':
        return (
          <WeatherPredictor 
            language={language}
            onBack={() => setCurrentPage('farmer-home')}
            userCultivation={user?.profile.currentCultivation}
          />
        )
      
      case 'disease':
        return (
          <DiseaseIdentifier 
            language={language}
            onBack={() => setCurrentPage('farmer-home')}
          />
        )
      
      case 'price':
        return (
          <PricePredictor 
            language={language}
            onBack={() => setCurrentPage('farmer-home')}
          />
        )
      
      case 'post':
        return (
          <PostSection 
            language={language}
            user={user!}
            onBack={() => setCurrentPage('farmer-home')}
          />
        )
      
      default:
        return (
          <EntrancePage 
            onSignIn={() => setCurrentPage('login')}
            language={language}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentPage()}
      <Toaster position="bottom-right" richColors />
    </div>
  )
}