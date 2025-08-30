import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Globe, Check } from 'lucide-react'
import { Language } from '../App'

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void
  currentLanguage: Language
}

export function LanguageSelection({ onLanguageSelect, currentLanguage }: LanguageSelectionProps) {
  const languages = [
    {
      code: 'en' as Language,
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'ta' as Language,
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳'
    },
    {
      code: 'te' as Language,
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳'
    },
    {
      code: 'hi' as Language,
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Select Your Language
          </CardTitle>
          <p className="text-gray-600">
            Choose your preferred language to continue
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant={currentLanguage === language.code ? "default" : "outline"}
                onClick={() => onLanguageSelect(language.code)}
                className={`p-6 h-auto justify-start space-x-4 ${
                  currentLanguage === language.code 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'hover:bg-green-50 hover:border-green-300'
                }`}
              >
                <span className="text-2xl">{language.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{language.name}</div>
                  <div className="text-sm opacity-75">{language.nativeName}</div>
                </div>
                {currentLanguage === language.code && (
                  <Check className="w-5 h-5" />
                )}
              </Button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              You can change the language later in settings
            </p>
            <Button 
              onClick={() => onLanguageSelect(currentLanguage)}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!currentLanguage}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}