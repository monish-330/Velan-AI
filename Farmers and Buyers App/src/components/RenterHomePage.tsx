import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Package, 
  User, 
  LogOut, 
  Wrench, 
  Sprout, 
  Camera,
  Plus,
  ShoppingCart
} from 'lucide-react'
import { Language, User as UserType, Page } from '../App'
import { t } from '../utils/translations'
import { ChatBot } from './ChatBot'

interface RenterHomePageProps {
  user: UserType
  language: Language
  onNavigate: (page: Page) => void
  onLogout: () => void
}

interface ToolListing {
  id: string
  name: string
  description: string
  dailyRate: string
  image: string
  ownerId: string
}

interface SeedListing {
  id: string
  name: string
  variety: string
  description: string
  pricePerKg: string
  image: string
  sellerId: string
}

export function RenterHomePage({ user, language, onNavigate, onLogout }: RenterHomePageProps) {
  const [activeTab, setActiveTab] = useState('tools')
  const [toolForm, setToolForm] = useState({
    name: '',
    description: '',
    dailyRate: '',
    image: ''
  })
  const [seedForm, setSeedForm] = useState({
    name: '',
    variety: '',
    description: '',
    pricePerKg: '',
    image: ''
  })
  const [toolImagePreview, setToolImagePreview] = useState<string | null>(null)
  const [seedImagePreview, setSeedImagePreview] = useState<string | null>(null)

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
      active: false
    },
    {
      id: 'renter-home' as Page,
      icon: Package,
      title: t('renter', language),
      active: true
    }
  ]

  const handleToolImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setToolImagePreview(result)
        setToolForm(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSeedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSeedImagePreview(result)
        setSeedForm(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleToolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTool: ToolListing = {
      id: Date.now().toString(),
      name: toolForm.name,
      description: toolForm.description,
      dailyRate: toolForm.dailyRate,
      image: toolForm.image,
      ownerId: user.id
    }

    // Save to localStorage (in real app, this would be saved to database)
    const existingTools = JSON.parse(localStorage.getItem('tool-listings') || '[]')
    existingTools.push(newTool)
    localStorage.setItem('tool-listings', JSON.stringify(existingTools))

    // Reset form
    setToolForm({ name: '', description: '', dailyRate: '', image: '' })
    setToolImagePreview(null)
    
    alert('Tool listed successfully! It will now appear in the Tools & Seeds section for farmers to rent.')
  }

  const handleSeedSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newSeed: SeedListing = {
      id: Date.now().toString(),
      name: seedForm.name,
      variety: seedForm.variety,
      description: seedForm.description,
      pricePerKg: seedForm.pricePerKg,
      image: seedForm.image,
      sellerId: user.id
    }

    // Save to localStorage (in real app, this would be saved to database)
    const existingSeeds = JSON.parse(localStorage.getItem('seed-listings') || '[]')
    existingSeeds.push(newSeed)
    localStorage.setItem('seed-listings', JSON.stringify(existingSeeds))

    // Reset form
    setSeedForm({ name: '', variety: '', description: '', pricePerKg: '', image: '' })
    setSeedImagePreview(null)
    
    alert('Seeds listed successfully! They will now appear in the Tools & Seeds section for farmers to purchase.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
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
                item.active ? 'bg-purple-600 hover:bg-purple-700' : ''
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
            List your tools for rent and seeds for sale to help fellow farmers
          </p>
        </div>

        {/* Listing Forms */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tools" className="flex items-center space-x-2">
              <Wrench className="w-4 h-4" />
              <span>{t('listTool', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="seeds" className="flex items-center space-x-2">
              <Sprout className="w-4 h-4" />
              <span>{t('listSeeds', language)}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="w-5 h-5" />
                  <span>{t('listTool', language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleToolSubmit} className="space-y-6">
                  {/* Tool Image Upload */}
                  <div className="space-y-2">
                    <Label>Tool Image</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {toolImagePreview ? (
                          <img 
                            src={toolImagePreview} 
                            alt="Tool preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <Button type="button" variant="outline" className="flex items-center space-x-2">
                          <Camera className="w-4 h-4" />
                          <span>Upload Image</span>
                        </Button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleToolImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tool Name */}
                    <div className="space-y-2">
                      <Label htmlFor="toolName">{t('toolName', language)}</Label>
                      <Input
                        id="toolName"
                        type="text"
                        placeholder="e.g., Tractor, Plow, Cultivator"
                        value={toolForm.name}
                        onChange={(e) => setToolForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Daily Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="dailyRate">{t('dailyRate', language)}</Label>
                      <Input
                        id="dailyRate"
                        type="text"
                        placeholder="e.g., ₹1500"
                        value={toolForm.dailyRate}
                        onChange={(e) => setToolForm(prev => ({ ...prev, dailyRate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Tool Description */}
                  <div className="space-y-2">
                    <Label htmlFor="toolDescription">{t('description', language)}</Label>
                    <Textarea
                      id="toolDescription"
                      placeholder="Describe your tool, its condition, and usage instructions"
                      value={toolForm.description}
                      onChange={(e) => setToolForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    List Tool for Rent
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seeds">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sprout className="w-5 h-5" />
                  <span>{t('listSeeds', language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSeedSubmit} className="space-y-6">
                  {/* Seed Image Upload */}
                  <div className="space-y-2">
                    <Label>Seed Image</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {seedImagePreview ? (
                          <img 
                            src={seedImagePreview} 
                            alt="Seed preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <Button type="button" variant="outline" className="flex items-center space-x-2">
                          <Camera className="w-4 h-4" />
                          <span>Upload Image</span>
                        </Button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleSeedImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Seed Type */}
                    <div className="space-y-2">
                      <Label htmlFor="seedName">{t('seedType', language)}</Label>
                      <Input
                        id="seedName"
                        type="text"
                        placeholder="e.g., Rice, Wheat, Green Gram"
                        value={seedForm.name}
                        onChange={(e) => setSeedForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Variety */}
                    <div className="space-y-2">
                      <Label htmlFor="variety">Variety</Label>
                      <Input
                        id="variety"
                        type="text"
                        placeholder="e.g., BPT 5204, HD 2967"
                        value={seedForm.variety}
                        onChange={(e) => setSeedForm(prev => ({ ...prev, variety: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Price per Kg */}
                    <div className="space-y-2">
                      <Label htmlFor="pricePerKg">{t('pricePerKg', language)}</Label>
                      <Input
                        id="pricePerKg"
                        type="text"
                        placeholder="e.g., ₹45"
                        value={seedForm.pricePerKg}
                        onChange={(e) => setSeedForm(prev => ({ ...prev, pricePerKg: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Seed Description */}
                  <div className="space-y-2">
                    <Label htmlFor="seedDescription">{t('description', language)}</Label>
                    <Textarea
                      id="seedDescription"
                      placeholder="Describe seed quality, germination rate, growing conditions, etc."
                      value={seedForm.description}
                      onChange={(e) => setSeedForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    List Seeds for Sale
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Information Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">List Your Items</h4>
                  <p className="text-sm text-gray-600">Upload photos and details of your tools or seeds.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Get Discovered</h4>
                  <p className="text-sm text-gray-600">Your listings appear in the Tools & Seeds section for farmers to find.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Connect & Earn</h4>
                  <p className="text-sm text-gray-600">Farmers contact you directly to rent tools or buy seeds.</p>
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