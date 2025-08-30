import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { ArrowLeft, Wrench, Sprout, MapPin, Phone, Star } from 'lucide-react'
import { Language } from '../App'
import { t } from '../utils/translations'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { toolsAPI, seedsAPI } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

interface ToolsAndSeedsProps {
  language: Language
  onBack: () => void
}

export function ToolsAndSeeds({ language, onBack }: ToolsAndSeedsProps) {
  const [selectedCategory, setSelectedCategory] = useState('tools')
  const [tools, setTools] = useState<any[]>([])
  const [seeds, setSeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load tools and seeds from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [toolsData, seedsData] = await Promise.all([
          toolsAPI.getAll(),
          seedsAPI.getAll()
        ])
        
        setTools(toolsData)
        setSeeds(seedsData)
      } catch (error: any) {
        console.log('Error loading tools/seeds:', error)
        toast.error('Failed to load tools and seeds data')
        
        // Fallback data
        setTools(fallbackTools)
        setSeeds(fallbackSeeds)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const fallbackTools = [
    {
      id: '1',
      name: t('tractor', language),
      image: 'https://images.unsplash.com/photo-1685474442734-bb453f03060d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwYWdyaWN1bHR1cmFsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1NjU1ODY4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      dailyRate: '₹1,500',
      owner: 'Ravi Kumar',
      location: 'Coimbatore, TN',
      phone: '+91 9876543210',
      rating: 4.8,
      availability: 'Available',
      description: 'Mahindra 575 DI, 50HP, suitable for plowing and harvesting'
    },
    {
      id: '2',
      name: t('plow', language),
      image: 'https://images.unsplash.com/photo-1652872281568-06250aa1aaa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwcGxvdyUyMGN1bHRpdmF0b3J8ZW58MXx8fHwxNzU2NTU4NjkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      dailyRate: '₹300',
      owner: 'Murugan S',
      location: 'Salem, TN',
      phone: '+91 9876543211',
      rating: 4.6,
      availability: 'Available',
      description: '3-furrow reversible plow, perfect for soil preparation'
    },
    {
      id: '3',
      name: t('cultivator', language),
      image: 'https://images.unsplash.com/photo-1652872281568-06250aa1aaa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwcGxvdyUyMGN1bHRpdmF0b3J8ZW58MXx8fHwxNzU2NTU4NjkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      dailyRate: '₹250',
      owner: 'Karthik R',
      location: 'Erode, TN',
      phone: '+91 9876543212',
      rating: 4.7,
      availability: 'Rented',
      description: '9-tyne cultivator for secondary tillage operations'
    },
    {
      id: '4',
      name: t('seeder', language),
      image: 'https://images.unsplash.com/photo-1685474442734-bb453f03060d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwYWdyaWN1bHR1cmFsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1NjU1ODY4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      dailyRate: '₹400',
      owner: 'Priya M',
      location: 'Trichy, TN',
      phone: '+91 9876543213',
      rating: 4.9,
      availability: 'Available',
      description: 'Multi-crop seed drill with fertilizer attachment'
    },
    {
      id: '5',
      name: t('harvester', language),
      image: 'https://images.unsplash.com/photo-1685474442734-bb453f03060d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwYWdyaWN1bHR1cmFsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1NjU1ODY4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      dailyRate: '₹2,000',
      owner: 'Ganesh K',
      location: 'Madurai, TN',
      phone: '+91 9876543214',
      rating: 4.8,
      availability: 'Available',
      description: 'Combine harvester suitable for wheat, rice, and other grains'
    },
    {
      id: '6',
      name: t('sprinkler', language),
      image: 'https://images.unsplash.com/photo-1685474442734-bb453f03060d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwYWdyaWN1bHR1cmFsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1NjU1ODY4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      dailyRate: '₹150',
      owner: 'Lakshmi V',
      location: 'Thanjavur, TN',
      phone: '+91 9876543215',
      rating: 4.5,
      availability: 'Available',
      description: 'Portable sprinkler irrigation system for 1-acre coverage'
    }
  ]

  const fallbackSeeds = [
    {
      id: '1',
      name: t('paddy', language),
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkcyUyMGdyYWluJTIwd2hlYXQlMjByaWNlfGVufDF8fHx8MTc1NjU1ODY5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      variety: 'BPT 5204',
      pricePerKg: '₹45',
      seller: 'Tamil Nadu Seeds Corp',
      location: 'Chennai, TN',
      phone: '+91 9876543220',
      rating: 4.9,
      availability: 'In Stock',
      description: 'High-yielding, disease-resistant variety. 110 days maturity.'
    },
    {
      id: '2',
      name: t('wheat', language),
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkcyUyMGdyYWluJTIwd2hlYXQlMjByaWNlfGVufDF8fHx8MTc1NjU1ODY5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      variety: 'HD 2967',
      pricePerKg: '₹35',
      seller: 'Agri Seeds India',
      location: 'Bangalore, KA',
      phone: '+91 9876543221',
      rating: 4.7,
      availability: 'In Stock',
      description: 'Drought-tolerant wheat variety suitable for rainfed areas.'
    },
    {
      id: '3',
      name: t('blackGram', language),
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkcyUyMGdyYWluJTIwd2hlYXQlMjByaWNlfGVufDF8fHx8MTc1NjU1ODY5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      variety: 'ADT 3',
      pricePerKg: '₹120',
      seller: 'Pulses Research Center',
      location: 'Coimbatore, TN',
      phone: '+91 9876543222',
      rating: 4.8,
      availability: 'Limited Stock',
      description: 'Premium quality black gram seeds with 85% germination rate.'
    },
    {
      id: '4',
      name: t('greenGram', language),
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkcyUyMGdyYWluJTIwd2hlYXQlMjByaWNlfGVufDF8fHx8MTc1NjU1ODY5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      variety: 'CO 6',
      pricePerKg: '₹100',
      seller: 'Green Valley Seeds',
      location: 'Salem, TN',
      phone: '+91 9876543223',
      rating: 4.6,
      availability: 'In Stock',
      description: 'Fast-growing green gram variety. 65 days to harvest.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t('toolsAndSeeds', language)}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tools" className="flex items-center space-x-2">
              <Wrench className="w-4 h-4" />
              <span>{t('availableTools', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="seeds" className="flex items-center space-x-2">
              <Sprout className="w-4 h-4" />
              <span>{t('availableSeeds', language)}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading tools...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                <Card key={tool.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback 
                      src={tool.image}
                      alt={tool.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        tool.availability === 'Available' 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}
                    >
                      {tool.availability}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tool.name}</span>
                      <span className="text-lg font-bold text-green-600">{tool.dailyRate}/day</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{tool.description}</p>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{tool.rating}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <strong>Owner:</strong> {tool.owner}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{tool.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={tool.availability !== 'Available'}
                      >
                        {tool.availability === 'Available' ? 'Rent Now' : 'Not Available'}
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="seeds" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading seeds...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seeds.map((seed) => (
                <Card key={seed.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback 
                      src={seed.image}
                      alt={seed.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        seed.availability === 'In Stock' 
                          ? 'bg-green-500' 
                          : seed.availability === 'Limited Stock'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {seed.availability}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <div>{seed.name}</div>
                        <div className="text-sm font-normal text-gray-600">Variety: {seed.variety}</div>
                      </div>
                      <span className="text-lg font-bold text-green-600">{seed.pricePerKg}/kg</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{seed.description}</p>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{seed.rating}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <strong>Seller:</strong> {seed.seller}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{seed.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={seed.availability === 'Out of Stock'}
                      >
                        {seed.availability === 'Out of Stock' ? 'Out of Stock' : 'Buy Now'}
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}