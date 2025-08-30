import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Bug, 
  Leaf, 
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Scan,
  BookOpen,
  Phone,
  Share,
  Download,
  History,
  Zap,
  Shield,
  Target
} from 'lucide-react'
import { Language } from '../App'
import { t } from '../utils/translations'
import { ChatBot } from './ChatBot'
import { toast } from 'sonner@2.0.3'

interface DiseaseIdentifierProps {
  language: Language
  onBack: () => void
}

interface DiseaseResult {
  disease: string
  confidence: number
  description: string
  severity: 'low' | 'medium' | 'high'
  remedies: string[]
  fertilizers: string[]
  prevention: string[]
}

export function DiseaseIdentifier({ language, onBack }: DiseaseIdentifierProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<DiseaseResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setIsCameraActive(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Camera access denied or not available. Please use the upload option instead.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageDataUrl = canvas.toDataURL('image/jpeg')
        setSelectedImage(imageDataUrl)
        stopCamera()
        analyzeImage(imageDataUrl)
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        analyzeImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true)
    setAnalysisResult(null)

    try {
      // Show progress updates
      toast.info('Starting AI analysis...')
      
      // Simulate AI analysis with realistic delay and progress updates
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.info('Detecting plant features...')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.info('Analyzing disease patterns...')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.info('Generating recommendations...')
      // Mock disease detection results
      const mockResults: DiseaseResult[] = [
        {
          disease: 'Bacterial Leaf Spot',
          confidence: 87,
          description: 'A common bacterial infection affecting leaves, causing dark spots with yellow halos.',
          severity: 'medium',
          remedies: [
            'Remove affected leaves immediately',
            'Apply copper-based bactericide spray',
            'Improve air circulation around plants',
            'Avoid overhead watering'
          ],
          fertilizers: [
            'Copper oxychloride (50% WP) - 2g/L water',
            'Streptocycline sulfate - 0.5g/L water',
            'Potassium phosphonate - 2ml/L water'
          ],
          prevention: [
            'Use disease-resistant varieties',
            'Maintain proper plant spacing',
            'Practice crop rotation',
            'Avoid working with wet plants'
          ]
        },
        {
          disease: 'Powdery Mildew',
          confidence: 92,
          description: 'Fungal disease causing white powdery coating on leaves and stems.',
          severity: 'high',
          remedies: [
            'Apply fungicide spray immediately',
            'Remove heavily infected parts',
            'Increase air circulation',
            'Reduce humidity levels'
          ],
          fertilizers: [
            'Sulfur-based fungicide - 2g/L water',
            'Neem oil - 5ml/L water',
            'Potassium bicarbonate - 1g/L water'
          ],
          prevention: [
            'Avoid overcrowding plants',
            'Water at soil level',
            'Remove weeds regularly',
            'Apply preventive fungicide sprays'
          ]
        },
        {
          disease: 'Leaf Curl Virus',
          confidence: 78,
          description: 'Viral infection causing upward curling and yellowing of leaves.',
          severity: 'high',
          remedies: [
            'Remove affected plants immediately',
            'Control whitefly vectors',
            'Use reflective mulch',
            'Apply systemic insecticides'
          ],
          fertilizers: [
            'Imidacloprid - 1ml/L water (for vector control)',
            'Foliar nutrition with micronutrients',
            'Zinc sulfate - 1g/L water'
          ],
          prevention: [
            'Use virus-resistant varieties',
            'Control insect vectors',
            'Remove weeds around field',
            'Use yellow sticky traps'
          ]
        }
      ]

      // Randomly select a disease for demonstration
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setAnalysisResult(randomResult)
      setAnalyzing(false)
      
      toast.success(`Disease identified: ${randomResult.disease}`)
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze image. Please try again.')
      setAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'high':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-600" />
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
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
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Bug className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t('cropDiseaseIdentifier', language)}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">How to get best results:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Take clear, well-lit photos of affected plant parts</li>
                  <li>• Focus on leaves, stems, or fruits showing disease symptoms</li>
                  <li>• Avoid blurry or distant shots</li>
                  <li>• Include multiple affected areas if possible</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera and Upload Section */}
        {!selectedImage && !isCameraActive && (
          <Card>
            <CardHeader>
              <CardTitle>Capture or Upload Plant Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={startCamera}
                  className="h-32 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center space-y-2"
                >
                  <Camera className="w-8 h-8" />
                  <span>{t('takePhoto', language)}</span>
                </Button>
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="w-8 h-8" />
                  <span>{t('uploadImage', language)}</span>
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </CardContent>
          </Card>
        )}

        {/* Camera View */}
        {isCameraActive && (
          <Card>
            <CardHeader>
              <CardTitle>Camera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <video 
                  ref={videoRef}
                  className="w-full max-w-md mx-auto rounded-lg"
                  autoPlay
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex space-x-4 justify-center">
                <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Progress */}
        {analyzing && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <Bug className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
                <h3 className="text-lg font-medium text-gray-800">
                  {t('analyzing', language)}
                </h3>
                <p className="text-gray-600">AI is analyzing your plant image for diseases...</p>
                <Progress value={33} className="w-full max-w-md mx-auto" />
                <div className="text-sm text-gray-500 space-y-1">
                  <p>🔍 Detecting plant parts...</p>
                  <p>🧠 Analyzing disease patterns...</p>
                  <p>📊 Generating recommendations...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Disease Detection Result */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Analysis Result</span>
                  <Badge className={`${getSeverityColor(analysisResult.severity)} text-white`}>
                    {analysisResult.confidence}% {t('confidence', language)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(analysisResult.severity)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                      {analysisResult.disease}
                    </h3>
                    <p className="text-gray-600">{analysisResult.description}</p>
                  </div>
                </div>
                
                {selectedImage && (
                  <div className="mt-4">
                    <img 
                      src={selectedImage} 
                      alt="Analyzed plant" 
                      className="w-full max-w-sm rounded-lg border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Remedies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5" />
                  <span>{t('remedies', language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.remedies.map((remedy, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Suggested Fertilizers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>{t('suggestedFertilizers', language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.fertilizers.map((fertilizer, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{fertilizer}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prevention Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Prevention Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.prevention.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={() => {
                  setSelectedImage(null)
                  setAnalysisResult(null)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Analyze Another Image
              </Button>
              <Button variant="outline">
                Save Results
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}