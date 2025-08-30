import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Leaf, 
  User, 
  LogOut, 
  Wrench, 
  CloudRain, 
  Bug, 
  TrendingUp, 
  Camera, 
  MessageCircle,
  Sprout,
  ShoppingCart,
  Package,
  Bell,
  Settings,
  MapPin,
  Calendar,
  Sun,
  Droplets,
  Wind,
  Activity,
  ArrowRight,
  Zap
} from 'lucide-react'
import { Language, User as UserType, Page } from '../App'
import { t } from '../utils/translations'
import { ChatBot } from './ChatBot'
import { NotificationCenter, NotificationBell } from './NotificationCenter'
import { notificationsAPI, weatherAPI, priceAPI } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

interface FarmerHomePageProps {
  user: UserType
  language: Language
  onNavigate: (page: Page) => void
  onLogout: () => void
}

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  precipitation: number
}

interface QuickStat {
  label: string
  value: string
  change: string
  trending: 'up' | 'down' | 'stable'
  icon: any
}

export function FarmerHomePage({ user, language, onNavigate, onLogout }: FarmerHomePageProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [quickStats, setQuickStats] = useState<QuickStat[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadDashboardData()
    loadNotifications()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Simulate weather data loading
      setTimeout(() => {
        setWeatherData({
          temperature: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          precipitation: 20
        })

        setQuickStats([
          {
            label: 'Active Crops',
            value: '3',
            change: '+1 this week',
            trending: 'up',
            icon: Sprout
          },
          {
            label: 'Market Price',
            value: '₹28/kg',
            change: '+12% from last week',
            trending: 'up',
            icon: TrendingUp
          },
          {
            label: 'Weather Score',
            value: '85%',
            change: 'Good for farming',
            trending: 'stable',
            icon: Sun
          },
          {
            label: 'Tools Rented',
            value: '2',
            change: 'Active rentals',
            trending: 'stable',
            icon: Wrench
          }
        ])

        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setLoading(false)
    }
  }

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll()
      if (response.success) {
        setNotifications(response.notifications || [])
        setUnreadCount(response.notifications?.filter((n: any) => !n.read).length || 0)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
      // Set some mock notifications for demo
      const mockNotifications = [
        {
          id: '1',
          title: 'Weather Alert',
          body: 'Light rain expected tomorrow. Good time for transplanting.',
          type: 'weather',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Price Update',
          body: 'Tomato prices up by 15%. Consider harvesting early crops.',
          type: 'prices',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]
      setNotifications(mockNotifications)
      setUnreadCount(2)
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const sections = [
    {
      id: 'tools-seeds' as Page,
      icon: Wrench,
      title: t('toolsAndSeeds', language),
      description: 'Access farming tools and quality seeds',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      badge: 'Available'
    },
    {
      id: 'weather' as Page,
      icon: CloudRain,
      title: t('weatherPredictor', language),
      description: 'Get weather forecasts and farming advice',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      badge: 'Updated'
    },
    {
      id: 'disease' as Page,
      icon: Bug,
      title: t('diseaseIdentifier', language),
      description: 'Identify crop diseases using AI',
      color: 'bg-gradient-to-br from-red-500 to-pink-500',
      badge: 'AI Powered'
    },
    {
      id: 'price' as Page,
      icon: TrendingUp,
      title: t('pricePredictor', language),
      description: 'Predict market prices and optimize profits',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      badge: 'Live Data'
    },
    {
      id: 'post' as Page,
      icon: Camera,
      title: t('post', language),
      description: 'Share your crops with buyers',
      color: 'bg-gradient-to-br from-purple-500 to-violet-500',
      badge: 'New'
    }
  ]

  const quickAccess = [
    {
      id: 'farmer-home' as Page,
      icon: Sprout,
      title: t('farmer', language),
      active: true
    },
    {
      id: 'buyer-home' as Page,
      icon: ShoppingCart,
      title: t('buyer', language),
      active: false
    },
    {
      id: 'renter-home' as Page,
      icon: Package,
      title: t('renter', language),
      active: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-green-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-800">{t('appName', language)}</h1>
              <p className="text-xs text-green-600">Smart Farming Assistant</p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <NotificationBell
              unreadCount={unreadCount}
              onClick={() => setShowNotifications(true)}
            />
            
            <Button
              variant="ghost"
              onClick={() => {/* Navigate to profile */}}
              className="flex items-center space-x-2 hover:bg-green-50"
            >
              <Avatar className="w-9 h-9 border-2 border-green-200">
                <AvatarImage src={user.profile.photo} />
                <AvatarFallback className="bg-green-100 text-green-700">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user.profile.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:block">{t('logout', language)}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Quick Access Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-green-100 p-4">
        <div className="flex space-x-3 overflow-x-auto">
          {quickAccess.map((item) => (
            <Button
              key={item.id}
              variant={item.active ? "default" : "outline"}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 ${
                item.active 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg scale-105' 
                  : 'hover:bg-green-50 hover:border-green-300'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Main Content */}
      <main className="p-6 space-y-8">
        {/* Welcome Section with Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Sun className="w-5 h-5 text-yellow-300" />
                      <span className="text-green-100">Good morning!</span>
                    </div>
                    <h2 className="text-2xl font-bold">
                      Welcome back, {user.profile.name}!
                    </h2>
                    <div className="flex items-center space-x-4 text-green-100">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.profile.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Sprout className="w-4 h-4" />
                        <span>{user.profile.currentCultivation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{weatherData?.temperature || '--'}°C</div>
                    <div className="text-green-100">{weatherData?.condition || 'Loading...'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Weather Card */}
          <div>
            <Card className="shadow-lg border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-blue-700">
                  <CloudRain className="w-5 h-5" />
                  <span>Today's Weather</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="space-y-2">
                    <Progress value={60} className="h-2" />
                    <p className="text-sm text-gray-500">Loading weather data...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Humidity</span>
                      </div>
                      <span className="font-medium">{weatherData?.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Wind className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Wind</span>
                      </div>
                      <span className="font-medium">{weatherData?.windSpeed} km/h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <CloudRain className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Rain Chance</span>
                      </div>
                      <span className="font-medium">{weatherData?.precipitation}%</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Feature Sections Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Smart Farming Tools</h3>
            <Button variant="outline" size="sm" className="text-green-600 border-green-300">
              <Activity className="w-4 h-4 mr-2" />
              View All Features
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Card 
                key={section.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg overflow-hidden"
                onClick={() => onNavigate(section.id)}
              >
                <CardContent className="p-0">
                  <div className={`h-32 ${section.color} relative flex items-center justify-center`}>
                    <section.icon className="w-12 h-12 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
                    <Badge className="absolute top-3 right-3 bg-white/20 text-white border-white/30">
                      {section.badge}
                    </Badge>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 p-0">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Zap className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Recent Activity and Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Insights */}
          <Card className="shadow-lg border-amber-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-amber-700">
                <Sun className="w-5 h-5" />
                <span>Today's Farming Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <CloudRain className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Weather Alert</p>
                  <p className="text-sm text-gray-600">Light rain expected tomorrow. Good time for transplanting.</p>
                  <Badge variant="outline" className="mt-1 text-xs">High Priority</Badge>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Market Update</p>
                  <p className="text-sm text-gray-600">Tomato prices up by 15%. Consider harvesting early crops.</p>
                  <Badge variant="outline" className="mt-1 text-xs">Opportunity</Badge>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <Bug className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Disease Alert</p>
                  <p className="text-sm text-gray-600">Leaf spot disease detected in nearby farms. Monitor your crops.</p>
                  <Badge variant="destructive" className="mt-1 text-xs">Action Required</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-purple-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <Zap className="w-5 h-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => onNavigate('disease')}
                variant="outline" 
                className="w-full justify-start hover:bg-red-50 hover:border-red-300"
              >
                <Camera className="w-4 h-4 mr-3" />
                Scan Crop for Diseases
              </Button>
              
              <Button 
                onClick={() => onNavigate('weather')}
                variant="outline" 
                className="w-full justify-start hover:bg-blue-50 hover:border-blue-300"
              >
                <CloudRain className="w-4 h-4 mr-3" />
                Check Weather Forecast
              </Button>
              
              <Button 
                onClick={() => onNavigate('price')}
                variant="outline" 
                className="w-full justify-start hover:bg-green-50 hover:border-green-300"
              >
                <TrendingUp className="w-4 h-4 mr-3" />
                Check Market Prices
              </Button>
              
              <Button 
                onClick={() => onNavigate('post')}
                variant="outline" 
                className="w-full justify-start hover:bg-purple-50 hover:border-purple-300"
              >
                <Camera className="w-4 h-4 mr-3" />
                Post New Crop
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onMarkAsRead={handleMarkAsRead}
      />

      {/* Floating ChatBot */}
      <ChatBot language={language} />
    </div>
  )
}