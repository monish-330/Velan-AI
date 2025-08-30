import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator,
  Calendar,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Language } from '../App'
import { t } from '../utils/translations'

interface PricePredictorProps {
  language: Language
  onBack: () => void
}

interface PriceAnalysis {
  cropType: string
  expenses: number
  quantity: number
  predictedPrice: number
  marketTrend: 'rising' | 'falling' | 'stable'
  trendPercentage: number
  bestSellingTime: string
  profitMargin: number
  profitPercentage: number
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
  marketFactors: string[]
}

export function PricePredictor({ language, onBack }: PricePredictorProps) {
  const [formData, setFormData] = useState({
    cropType: '',
    expenses: '',
    quantity: ''
  })
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null)
  const [calculating, setCalculating] = useState(false)

  const cropOptions = [
    { value: 'rice', label: 'Rice (Paddy)', basePrice: 22 },
    { value: 'wheat', label: 'Wheat', basePrice: 25 },
    { value: 'tomato', label: 'Tomato', basePrice: 28 },
    { value: 'onion', label: 'Onion', basePrice: 18 },
    { value: 'potato', label: 'Potato', basePrice: 15 },
    { value: 'green-gram', label: 'Green Gram', basePrice: 85 },
    { value: 'black-gram', label: 'Black Gram', basePrice: 120 },
    { value: 'cotton', label: 'Cotton', basePrice: 55 },
    { value: 'sugarcane', label: 'Sugarcane', basePrice: 3 },
    { value: 'maize', label: 'Maize', basePrice: 20 }
  ]

  const handleCalculate = () => {
    if (!formData.cropType || !formData.expenses || !formData.quantity) {
      alert('Please fill in all fields')
      return
    }

    setCalculating(true)

    setTimeout(() => {
      const selectedCrop = cropOptions.find(crop => crop.value === formData.cropType)
      const expenses = parseFloat(formData.expenses)
      const quantity = parseFloat(formData.quantity)
      
      if (!selectedCrop) return

      // Simulate market analysis with realistic data
      const basePrice = selectedCrop.basePrice
      const marketVariation = (Math.random() - 0.5) * 0.4 // ±20% variation
      const predictedPrice = basePrice * (1 + marketVariation)
      
      const totalRevenue = predictedPrice * quantity
      const profit = totalRevenue - expenses
      const profitPercentage = (profit / expenses) * 100

      const trends = ['rising', 'falling', 'stable'] as const
      const marketTrend = trends[Math.floor(Math.random() * trends.length)]
      const trendPercentage = Math.random() * 15 + 2 // 2-17%

      const riskLevels = ['low', 'medium', 'high'] as const
      const riskLevel = profit > expenses * 0.3 ? 'low' : profit > 0 ? 'medium' : 'high'

      const mockAnalysis: PriceAnalysis = {
        cropType: selectedCrop.label,
        expenses,
        quantity,
        predictedPrice: Math.round(predictedPrice * 100) / 100,
        marketTrend,
        trendPercentage: Math.round(trendPercentage * 100) / 100,
        bestSellingTime: getBestSellingTime(marketTrend),
        profitMargin: Math.round(profit),
        profitPercentage: Math.round(profitPercentage * 100) / 100,
        recommendations: getRecommendations(formData.cropType, marketTrend, profitPercentage),
        riskLevel,
        marketFactors: getMarketFactors(formData.cropType)
      }

      setAnalysis(mockAnalysis)
      setCalculating(false)
    }, 2000)
  }

  const getBestSellingTime = (trend: string): string => {
    const dates = [
      'This week (High demand period)',
      'Next week (Festival season)',
      'In 2 weeks (Post-harvest shortage)',
      'In 1 month (Export season)',
      'In 6 weeks (Storage advantage)'
    ]
    
    if (trend === 'rising') {
      return dates[Math.floor(Math.random() * 2) + 2] // Later dates for rising trend
    } else if (trend === 'falling') {
      return dates[Math.floor(Math.random() * 2)] // Earlier dates for falling trend
    } else {
      return dates[Math.floor(Math.random() * dates.length)]
    }
  }

  const getRecommendations = (crop: string, trend: string, profitPercentage: number): string[] => {
    const recommendations = []

    if (trend === 'rising') {
      recommendations.push('Hold your stock for 1-2 weeks for better prices')
      recommendations.push('Monitor daily price fluctuations closely')
    } else if (trend === 'falling') {
      recommendations.push('Sell immediately to avoid further price drops')
      recommendations.push('Consider value-added processing if possible')
    } else {
      recommendations.push('Current prices are stable, safe to sell anytime')
      recommendations.push('Consider long-term contracts with buyers')
    }

    if (profitPercentage < 10) {
      recommendations.push('Consider cost optimization for next season')
      recommendations.push('Explore direct selling to reduce intermediary costs')
    } else if (profitPercentage > 30) {
      recommendations.push('Excellent profit margins, reinvest in quality seeds')
      recommendations.push('Expand cultivation area for this crop')
    }

    recommendations.push('Join farmer producer organizations for better pricing')
    recommendations.push('Use grading and packaging to get premium prices')

    return recommendations
  }

  const getMarketFactors = (crop: string): string[] => {
    const commonFactors = [
      'Seasonal demand patterns',
      'Weather conditions affecting supply',
      'Government policy changes',
      'Export/import regulations',
      'Transportation costs'
    ]

    const cropSpecific: { [key: string]: string[] } = {
      'rice': ['Monsoon impact', 'PDS procurement prices', 'Export policies'],
      'wheat': ['Rabi season harvest', 'Government MSP', 'International wheat prices'],
      'tomato': ['Festival demand', 'Processing industry needs', 'Shelf life constraints'],
      'onion': ['Storage availability', 'Export restrictions', 'Seasonal supply gaps'],
      'cotton': ['Textile industry demand', 'International cotton prices', 'Fiber quality']
    }

    return [...commonFactors.slice(0, 3), ...(cropSpecific[crop] || [])]
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'falling':
        return <TrendingDown className="w-5 h-5 text-red-600" />
      default:
        return <BarChart3 className="w-5 h-5 text-blue-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'falling':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

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
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t('cropPricePredictor', language)}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Crop Price Analysis</span>
            </CardTitle>
            <p className="text-gray-600">Enter your crop details to get AI-powered price predictions</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Crop Type */}
              <div className="space-y-2">
                <Label htmlFor="cropType">{t('cropType', language)}</Label>
                <Select 
                  value={formData.cropType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropOptions.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total Expenses */}
              <div className="space-y-2">
                <Label htmlFor="expenses">{t('expenses', language)} (₹)</Label>
                <Input
                  id="expenses"
                  type="number"
                  placeholder="50000"
                  value={formData.expenses}
                  onChange={(e) => setFormData(prev => ({ ...prev, expenses: e.target.value }))}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">{t('quantity', language)}</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="1000"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
            </div>

            <Button 
              onClick={handleCalculate}
              disabled={calculating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {calculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing Market Data...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  {t('calculatePrice', language)}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{t('predictedPrice', language)}</h3>
                  <p className="text-2xl font-bold text-gray-800">₹{analysis.predictedPrice}/kg</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
                  <p className="text-2xl font-bold text-gray-800">₹{Math.round(analysis.predictedPrice * analysis.quantity).toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    analysis.profitMargin > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {analysis.profitMargin > 0 ? 
                      <CheckCircle className="w-5 h-5 text-green-600" /> : 
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{t('profitMargin', language)}</h3>
                  <p className={`text-2xl font-bold ${analysis.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{analysis.profitMargin.toLocaleString()}
                  </p>
                  <p className={`text-sm ${analysis.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({analysis.profitPercentage > 0 ? '+' : ''}{analysis.profitPercentage}%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{t('bestSellingTime', language)}</h3>
                  <p className="text-sm font-medium text-gray-800">{analysis.bestSellingTime}</p>
                </CardContent>
              </Card>
            </div>

            {/* Market Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>{t('marketTrend', language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(analysis.marketTrend)}
                    <div>
                      <h3 className="font-medium text-gray-800 capitalize">{analysis.marketTrend} Trend</h3>
                      <p className="text-sm text-gray-600">
                        Prices are {analysis.marketTrend} by {analysis.trendPercentage}% this week
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={`${getTrendColor(analysis.marketTrend)}`}>
                      {analysis.trendPercentage}% {analysis.marketTrend}
                    </Badge>
                    <Badge className={`${getRiskColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel} risk
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Market Factors */}
            <Card>
              <CardHeader>
                <CardTitle>Key Market Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.marketFactors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={() => {
                  setFormData({ cropType: '', expenses: '', quantity: '' })
                  setAnalysis(null)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Calculate for Another Crop
              </Button>
              <Button variant="outline">
                Save Analysis
              </Button>
              <Button variant="outline">
                Share Results
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}