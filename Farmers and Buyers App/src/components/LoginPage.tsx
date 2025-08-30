import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ArrowLeft, Leaf, Mail, Phone, Lock, CheckCircle } from 'lucide-react'
import { Language } from '../App'
import { t } from '../utils/translations'
import { Alert, AlertDescription } from './ui/alert'

interface LoginPageProps {
  onLogin: (email: string, password: string) => void
  onBack: () => void
  language: Language
}

export function LoginPage({ onLogin, onBack, language }: LoginPageProps) {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPSent, setShowOTPSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validate email or phone
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = t('enterValidEmail', language)
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      
      if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone)) {
        newErrors.emailOrPhone = t('enterValidEmail', language)
      }
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = t('enterPassword', language)
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Simulate OTP sending
      setShowOTPSent(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otpCode.trim() || otpCode.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' })
      return
    }

    setIsLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      // In a real app, you'd verify the OTP here
      onLogin(formData.emailOrPhone, formData.password)
      setIsLoading(false)
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const isEmail = formData.emailOrPhone.includes('@')

  if (showOTPSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              OTP Verification
            </CardTitle>
            <p className="text-gray-600">
              We've sent a 6-digit code to {formData.emailOrPhone}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOTPVerification} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="text-sm text-red-600">{errors.otp}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowOTPSent(false)}
                  className="flex-1"
                >
                  {t('back', language)}
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? t('loading', language) : 'Verify & Continue'}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    // Simulate resending OTP
                    setOtpCode('')
                    setErrors({})
                  }}
                  className="text-green-600"
                >
                  Resend OTP
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute left-4 top-4 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t('signIn', language)}
          </CardTitle>
          <p className="text-gray-600">
            Welcome to {t('appName', language)}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emailOrPhone" className="flex items-center space-x-2">
                {isEmail ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                <span>{t('emailOrPhone', language)}</span>
              </Label>
              <Input
                id="emailOrPhone"
                type="text"
                placeholder="example@email.com or +91 9876543210"
                value={formData.emailOrPhone}
                onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
                className={errors.emailOrPhone ? 'border-red-500' : ''}
              />
              {errors.emailOrPhone && (
                <p className="text-sm text-red-600">{errors.emailOrPhone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>{t('createPassword', language)}</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              <p className="text-sm text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? t('loading', language) : t('submitAndSendOTP', language)}
            </Button>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                <strong>Demo Note:</strong> Use any email/phone and password to continue. 
                An OTP will be simulated for demonstration purposes.
              </AlertDescription>
            </Alert>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}