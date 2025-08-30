import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Leaf, CloudRain, Bug, TrendingUp, Wrench, Calendar, Camera, BarChart3 } from 'lucide-react'
import { Language } from '../App'
import { t } from '../utils/translations'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface EntrancePageProps {
  onSignIn: () => void
  language: Language
}

export function EntrancePage({ onSignIn, language }: EntrancePageProps) {
  const problems = [
    {
      icon: CloudRain,
      title: t('problem1', language),
      description: 'Weather unpredictability affects crop yield and planning'
    },
    {
      icon: Bug,
      title: t('problem2', language),
      description: 'Disease identification requires expert knowledge'
    },
    {
      icon: TrendingUp,
      title: t('problem3', language),
      description: 'Market price fluctuations are hard to predict'
    },
    {
      icon: Wrench,
      title: t('problem4', language),
      description: 'Expensive tools and equipment accessibility'
    }
  ]

  const solutions = [
    {
      icon: Calendar,
      title: t('solution1', language),
      description: 'AI-powered weather predictions for better crop planning'
    },
    {
      icon: Camera,
      title: t('solution2', language),
      description: 'Instant disease identification using image analysis'
    },
    {
      icon: BarChart3,
      title: t('solution3', language),
      description: 'Real-time market prices and selling recommendations'
    },
    {
      icon: Wrench,
      title: t('solution4', language),
      description: 'Easy access to tools and seeds marketplace'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">{t('appName', language)}</h1>
        </div>
        <Button 
          onClick={onSignIn}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
        >
          {t('signIn', language)}
        </Button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-6 relative z-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          {t('tagline', language)}
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('getStarted', language)}
        </p>
        
        {/* Farmer Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1707721691170-bf913a7a6231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBhZ3JpY3VsdHVyYWwlMjBmaWVsZCUyMGNyb3BzfGVufDF8fHx8MTc1NjU1ODQ3OXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Indian farmer in agricultural field"
              className="w-full h-48 object-cover"
            />
          </Card>
          <Card className="overflow-hidden">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1655980235599-8e3d642e4993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwdG9vbHMlMjB0cmFjdG9yJTIwYWdyaWN1bHR1cmFsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1NjU1ODQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Farming tools and tractor"
              className="w-full h-48 object-cover"
            />
          </Card>
          <Card className="overflow-hidden">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1740477138822-906f6b845579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMGZhcm1lcnMlMjB3b3JraW5nfGVufDF8fHx8MTc1NjU1ODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Rural Indian farmers working"
              className="w-full h-48 object-cover"
            />
          </Card>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t('farmerProblems', language)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <problem.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{problem.title}</h4>
                  <p className="text-sm text-gray-600">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t('howWeHelp', language)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <solution.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{solution.title}</h4>
                  <p className="text-sm text-gray-600">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Farming?
          </h3>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of farmers already using Velan AI to increase their productivity and profits.
          </p>
          <Button 
            onClick={onSignIn}
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
          >
            {t('getStarted', language)}
          </Button>
        </div>
      </section>

      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-40 animate-pulse"></div>
    </div>
  )
}