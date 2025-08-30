import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Camera, User, MapPin, Sprout, Phone, Mail } from 'lucide-react'
import { Language, UserRole } from '../App'
import { t } from '../utils/translations'

interface ProfileCreationProps {
  onComplete: (profileData: any) => void
  role: UserRole
  language: Language
}

export function ProfileCreation({ onComplete, role, language }: ProfileCreationProps) {
  const [profileData, setProfileData] = useState({
    name: '',
    photo: '',
    location: '',
    currentCultivation: '',
    phoneNumber: '',
    emailAddress: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!profileData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!profileData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(profileData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    if (!profileData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address'
    }

    if (role === 'farmer' && !profileData.currentCultivation.trim()) {
      newErrors.currentCultivation = 'Current cultivation is required for farmers'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        setProfileData(prev => ({ ...prev, photo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onComplete(profileData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            {t('createProfile', language)}
          </CardTitle>
          <p className="text-gray-600">
            Complete your profile to get started as a {t(role, language)}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">{t('uploadPhoto', language)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{t('name', language)}</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{t('location', language)}</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, State"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Current Cultivation (only for farmers) */}
            {role === 'farmer' && (
              <div className="space-y-2">
                <Label htmlFor="cultivation" className="flex items-center space-x-2">
                  <Sprout className="w-4 h-4" />
                  <span>{t('currentCultivation', language)}</span>
                </Label>
                <Textarea
                  id="cultivation"
                  placeholder="Describe your current crops and farming practices"
                  value={profileData.currentCultivation}
                  onChange={(e) => handleInputChange('currentCultivation', e.target.value)}
                  className={errors.currentCultivation ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.currentCultivation && (
                  <p className="text-sm text-red-600">{errors.currentCultivation}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{t('phoneNumber', language)}</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{t('emailAddress', language)}</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={profileData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  className={errors.emailAddress ? 'border-red-500' : ''}
                />
                {errors.emailAddress && (
                  <p className="text-sm text-red-600">{errors.emailAddress}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 py-3"
              size="lg"
            >
              {t('complete', language)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}