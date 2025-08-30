import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Sprout, ShoppingCart, Package, ArrowRight } from 'lucide-react'
import { Language, UserRole } from '../App'
import { t } from '../utils/translations'

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void
  language: Language
}

export function RoleSelection({ onRoleSelect, language }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const roles = [
    {
      id: 'farmer' as UserRole,
      icon: Sprout,
      title: t('farmer', language),
      description: t('farmerDesc', language),
      color: 'green',
      features: [
        'Weather predictions',
        'Disease identification',
        'Price forecasting',
        'Tools marketplace'
      ]
    },
    {
      id: 'buyer' as UserRole,
      icon: ShoppingCart,
      title: t('buyer', language),
      description: t('buyerDesc', language),
      color: 'blue',
      features: [
        'Browse crop listings',
        'Direct farmer contact',
        'Price negotiations',
        'Quality assurance'
      ]
    },
    {
      id: 'renter' as UserRole,
      icon: Package,
      title: t('renter', language),
      description: t('renterDesc', language),
      color: 'purple',
      features: [
        'List tools for rent',
        'Sell seeds',
        'Manage inventory',
        'Track earnings'
      ]
    }
  ]

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = isSelected ? 'ring-2 ring-offset-2' : 'hover:shadow-lg'
    
    switch (color) {
      case 'green':
        return `${baseClasses} ${isSelected ? 'ring-green-500 bg-green-50' : 'hover:bg-green-50'}`
      case 'blue':
        return `${baseClasses} ${isSelected ? 'ring-blue-500 bg-blue-50' : 'hover:bg-blue-50'}`
      case 'purple':
        return `${baseClasses} ${isSelected ? 'ring-purple-500 bg-purple-50' : 'hover:bg-purple-50'}`
      default:
        return baseClasses
    }
  }

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600'
      case 'blue':
        return 'bg-blue-100 text-blue-600'
      case 'purple':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
            {t('chooseRole', language)}
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Select your role to get a personalized experience
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 ${getColorClasses(role.color, selectedRole === role.id)}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getIconColorClasses(role.color)}`}>
                    <role.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {role.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {role.description}
                  </p>
                  
                  <div className="text-left">
                    <h4 className="font-medium text-gray-700 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedRole === role.id && (
                    <div className="mt-4 p-2 bg-white rounded-lg">
                      <span className="text-sm font-medium text-green-600">Selected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={() => selectedRole && onRoleSelect(selectedRole)}
              disabled={!selectedRole}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
              size="lg"
            >
              Continue as {selectedRole && t(selectedRole, language)}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              Don't worry, you can switch between roles anytime later
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}