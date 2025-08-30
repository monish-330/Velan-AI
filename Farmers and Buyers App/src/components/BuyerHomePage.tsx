import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  MapPin, 
  Phone, 
  Star,
  Sprout,
  Package
} from 'lucide-react'
import { Language, User as UserType, Page } from '../App'
import { t } from '../utils/translations'
import { ChatBot } from './ChatBot'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { postsAPI } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

interface BuyerHomePageProps {
  user: UserType
  language: Language
  onNavigate: (page: Page) => void
  onLogout: () => void
}

interface CropPost {
  id: string
  farmerId: string
  farmerName: string
  farmerLocation: string
  farmerPhone: string
  cropName: string
  quantity: string
  price: string
  description: string
  image: string
  postedDate: string
  rating: number
}

export function BuyerHomePage({ user, language, onNavigate, onLogout }: BuyerHomePageProps) {
  const [cropPosts, setCropPosts] = useState<CropPost[]>([])

  // Load crop posts from backend
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await postsAPI.getAll()
        setCropPosts(posts)
      } catch (error: any) {
        console.log('Error loading posts:', error)
        toast.error('Failed to load crop listings')
        
        // Fallback to sample data for demonstration
        const samplePosts: CropPost[] = [
          {
            id: '1',
            farmerId: 'farmer1',
            farmerName: 'Rajesh Kumar',
            farmerLocation: 'Coimbatore, TN',
            farmerPhone: '+91 9876543210',
            cropName: 'Tomatoes',
            quantity: '500 kg',
            price: '₹25/kg',
            description: 'Fresh organic tomatoes, just harvested. Grade A quality, perfect for wholesale.',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
            postedDate: '2024-01-15',
            rating: 4.8
          },
          {
            id: '2',
            farmerId: 'farmer2',
            farmerName: 'Priya Devi',
            farmerLocation: 'Salem, TN',
            farmerPhone: '+91 9876543211',
            cropName: 'Rice (Paddy)',
            quantity: '2000 kg',
            price: '₹22/kg',
            description: 'Premium quality BPT 5204 variety rice. Properly dried and cleaned.',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            postedDate: '2024-01-14',
            rating: 4.9
          }
        ]
        setCropPosts(samplePosts)
      }
    }

    loadPosts()
  }, [])

  const quickAccess = [
    {
      id: 'farmer-home' as Page,
      icon: Sprout,
      title: t('farmer', language),
      active: false
    },
    {
      id: 'buyer-home' as Page,
      icon: ShoppingCart,
      title: t('buyer', language),
      active: true
    },
    {
      id: 'renter-home' as Page,
      icon: Package,
      title: t('renter', language),
      active: false
    }
  ]

  const handleContactFarmer = (phone: string) => {
    // In a real app, this would open the phone dialer or messaging app
    window.open(`tel:${phone}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-green-800">{t('appName', language)}</h1>
          </div>

          {/* Profile and Logout */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => {/* Navigate to profile */}}
              className="flex items-center space-x-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.profile.photo} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block">{user.profile.name}</span>
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:block">{t('logout', language)}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Access Navigation */}
      <div className="bg-white border-b p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {quickAccess.map((item) => (
            <Button
              key={item.id}
              variant={item.active ? "default" : "outline"}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center space-x-2 whitespace-nowrap ${
                item.active ? 'bg-blue-600 hover:bg-blue-700' : ''
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {user.profile.name}!
          </h2>
          <p className="text-gray-600">
            Browse fresh crops directly from farmers in your area
          </p>
        </div>

        {/* Available Crops Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {t('availableCrops', language)}
          </h3>
          
          {cropPosts.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">No crops available</h4>
                <p className="text-gray-500">Check back later for fresh crop listings from farmers.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cropPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback 
                      src={post.image}
                      alt={post.cropName}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      Fresh
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{post.cropName}</span>
                      <span className="text-lg font-bold text-green-600">{post.price}</span>
                    </CardTitle>
                    <div className="text-sm text-gray-600">
                      Quantity: {post.quantity}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{post.description}</p>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{post.rating}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <strong>Farmer:</strong> {post.farmerName}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{post.farmerLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <strong>Posted:</strong> {new Date(post.postedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleContactFarmer(post.farmerPhone)}
                      >
                        Contact Farmer
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center"
                        onClick={() => handleContactFarmer(post.farmerPhone)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Market Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Seasonal Demand</p>
                  <p className="text-sm text-gray-600">Tomato prices are expected to rise by 10% next week due to increased demand.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Quality Tip</p>
                  <p className="text-sm text-gray-600">Look for farmers with 4+ star ratings for consistent quality produce.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Best Buying Time</p>
                  <p className="text-sm text-gray-600">Early morning posts usually have the freshest produce available.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating ChatBot */}
      <ChatBot language={language} />
    </div>
  )
}