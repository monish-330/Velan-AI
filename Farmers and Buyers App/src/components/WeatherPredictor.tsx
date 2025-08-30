import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  ArrowLeft, 
  CloudRain, 
  Sun, 
  Cloud, 
  Wind, 
  Droplets, 
  Thermometer,
  Calendar,
  Leaf,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Eye,
  Sunrise,
  Sunset,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Language } from '../App'
import { t } from '../utils/translations'
import { ChatBot } from './ChatBot'
import { weatherAPI } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

interface WeatherPredictorProps {
  language: Language
  onBack: () => void
  userCultivation?: string
}

interface WeatherData {
  date: string
  day: string
  temperature: {
    max: number
    min: number
  }
  humidity: number
  rainfall: number
  windSpeed: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy'
  description: string
}

interface FarmingAdvice {
  activity: string
  recommendation: string
  priority: 'high' | 'medium' | 'low'
  icon: any
}

export function WeatherPredictor({ language, onBack, userCultivation }: WeatherPredictorProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [farmingAdvice, setFarmingAdvice] = useState<FarmingAdvice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeatherData()
  }, [userCultivation])

  const fetchWeatherData = async () => {
    setLoading(true)
    
    try {
      // Try to fetch real weather data from backend
      // For now, using mock data with realistic API simulation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock weather data for next 7 days with more realistic variations
      const mockWeatherData: WeatherData[] = [
          {
            date: '2024-01-16',
            day: 'Today',
            temperature: { max: 28, min: 18 },
            humidity: 65,
            rainfall: 2,
            windSpeed: 12,
            condition: 'partly-cloudy',
            description: 'Partly cloudy with light showers'
          },
          {
            date: '2024-01-17',
            day: 'Tomorrow',
            temperature: { max: 30, min: 20 },
            humidity: 70,
            rainfall: 15,
            windSpeed: 10,
            condition: 'rainy',
            description: 'Moderate rainfall expected'
          },
          {
            date: '2024-01-18',
            day: 'Thu',
            temperature: { max: 26, min: 19 },
            humidity: 80,
            rainfall: 25,
            windSpeed: 8,
            condition: 'rainy',
            description: 'Heavy rainfall, avoid field work'
          },
          {
            date: '2024-01-19',
            day: 'Fri',
            temperature: { max: 32, min: 22 },
            humidity: 55,
            rainfall: 0,
            windSpeed: 15,
            condition: 'sunny',
            description: 'Clear sunny day'
          },
          {
            date: '2024-01-20',
            day: 'Sat',
            temperature: { max: 31, min: 21 },
            humidity: 60,
            rainfall: 0,
            windSpeed: 12,
            condition: 'sunny',
            description: 'Perfect farming weather'
          },
          {
            date: '2024-01-21',
            day: 'Sun',
            temperature: { max: 29, min: 20 },
            humidity: 65,
            rainfall: 5,
            windSpeed: 10,
            condition: 'partly-cloudy',
            description: 'Partly cloudy with light drizzle'
          },
          {
            date: '2024-01-22',
            day: 'Mon',
            temperature: { max: 33, min: 23 },
            humidity: 50,
            rainfall: 0,
            windSpeed: 18,
            condition: 'sunny',
            description: 'Hot and dry conditions'
          }
        ]

        // Generate farming advice based on weather and user cultivation
        const mockAdvice: FarmingAdvice[] = [
          {
            activity: 'Irrigation',
            recommendation: 'Skip irrigation today and tomorrow due to expected rainfall. Resume on Friday.',
            priority: 'high',
            icon: Droplets
          },
          {
            activity: 'Transplanting',
            recommendation: 'Thursday\'s heavy rain is ideal for transplanting seedlings. Prepare beforehand.',
            priority: 'high',
            icon: Leaf
          },
          {
            activity: 'Harvesting',
            recommendation: 'Friday and Saturday are perfect for harvesting due to dry conditions.',
            priority: 'medium',
            icon: Calendar
          },
          {
            activity: 'Fertilizer Application',
            recommendation: 'Avoid fertilizer application during rainy days (Wed-Thu). Best time: Friday morning.',
            priority: 'medium',
            icon: Leaf
          },
          {
            activity: 'Pest Management',
            recommendation: 'High humidity may increase pest activity. Monitor crops closely after rain.',
            priority: 'low',
            icon: AlertTriangle
          }
        ]

      setWeatherData(mockWeatherData)
      setFarmingAdvice(mockAdvice)
      setLoading(false)
      
      toast.success('Weather data updated successfully!')
    } catch (error) {
      console.error('Weather fetch error:', error)
      toast.error('Failed to fetch weather data')
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />
      case 'partly-cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-8 shadow-2xl border-0">
          <CardContent className="space-y-6">
            <div className="relative">
              <CloudRain className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-pulse" />
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium text-gray-800">
                {t('loadingWeather', language)}
              </h3>
              <p className="text-gray-600">Analyzing weather patterns for your location...</p>
              <Progress value={65} className="w-full max-w-xs mx-auto" />
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>🌍 Fetching location data...</p>
              <p>☁️ Analyzing cloud patterns...</p>
              <p>🌡️ Processing temperature trends...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-blue-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CloudRain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{t('weatherPredictor', language)}</h1>
                <p className="text-sm text-gray-600">AI-powered weather insights</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWeatherData}
              disabled={loading}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Current Location</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Current Cultivation Info */}
        {userCultivation && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Current Cultivation: {userCultivation}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 7-Day Weather Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{t('weatherForecast', language)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {weatherData.map((day, index) => (
                <Card key={index} className={`text-center ${index === 0 ? 'ring-2 ring-blue-300' : ''}`}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-800">{day.day}</h3>
                      <div className="flex justify-center">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{day.temperature.max}°C</div>
                        <div className="text-gray-500">{day.temperature.min}°C</div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center justify-center space-x-1">
                          <Droplets className="w-3 h-3" />
                          <span>{day.rainfall}mm</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <Wind className="w-3 h-3" />
                          <span>{day.windSpeed}km/h</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{day.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farming Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Smart Farming Recommendations</CardTitle>
            <p className="text-gray-600">AI-powered advice based on weather forecast and your crops</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {farmingAdvice.map((advice, index) => (
                <Card key={index} className={`border ${getPriorityColor(advice.priority)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(advice.priority)}`}>
                          <advice.icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">{advice.activity}</h4>
                        <p className="text-sm text-gray-600">{advice.recommendation}</p>
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(advice.priority)}`}>
                            {advice.priority.charAt(0).toUpperCase() + advice.priority.slice(1)} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weather Alerts */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Weather Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Heavy Rainfall Warning</p>
                  <p className="text-sm text-yellow-700">Expected heavy rainfall on Thursday. Avoid outdoor farming activities and ensure proper drainage.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-orange-800">High Temperature Alert</p>
                  <p className="text-sm text-orange-700">Monday will be particularly hot (33°C). Ensure adequate irrigation and shade for sensitive crops.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={fetchWeatherData}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Weather Data
          </Button>
          
          <Button 
            variant="outline"
            className="border-green-300 text-green-600 hover:bg-green-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Set Reminders
          </Button>
          
          <Button 
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Activity className="w-4 h-4 mr-2" />
            Weather History
          </Button>
        </div>

        {/* Additional Weather Info */}
        <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Sun className="w-5 h-5" />
              <span>Today's Highlights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Sunrise className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Sunrise</p>
                <p className="font-medium">6:24 AM</p>
              </div>
              <div className="text-center">
                <Sunset className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Sunset</p>
                <p className="font-medium">6:47 PM</p>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Visibility</p>
                <p className="font-medium">10 km</p>
              </div>
              <div className="text-center">
                <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">UV Index</p>
                <p className="font-medium">6 (High)</p>
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