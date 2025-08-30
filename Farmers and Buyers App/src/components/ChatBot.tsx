import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { Language } from '../App'
import { t } from '../utils/translations'

interface ChatBotProps {
  language: Language
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function ChatBot({ language }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatWithAI', language),
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Agriculture-related responses
    if (message.includes('weather') || message.includes('rain') || message.includes('climate')) {
      return 'Based on current weather patterns, I recommend checking the weather predictor section for detailed forecasts. Light irrigation might be needed if no rain is expected in the next 3 days.'
    }
    
    if (message.includes('disease') || message.includes('pest') || message.includes('leaf') || message.includes('crop')) {
      return 'For crop disease identification, please use our Disease Identifier feature. Take a clear photo of the affected plant part and I\'ll analyze it for you. Common diseases this season include leaf spot and bacterial blight.'
    }
    
    if (message.includes('price') || message.includes('market') || message.includes('sell') || message.includes('profit')) {
      return 'Market prices fluctuate based on demand and supply. Use our Price Predictor to get the best selling time for your crops. Current market trends show good prices for seasonal vegetables.'
    }
    
    if (message.includes('tools') || message.includes('equipment') || message.includes('tractor') || message.includes('rent')) {
      return 'You can find various farming tools and equipment in our Tools & Seeds section. Many items are available for rent at affordable daily rates from local farmers.'
    }
    
    if (message.includes('seeds') || message.includes('variety') || message.includes('cultivation')) {
      return 'Quality seeds are crucial for good yield. Check our Seeds section for certified varieties. I recommend choosing disease-resistant varieties suitable for your local climate.'
    }
    
    if (message.includes('fertilizer') || message.includes('nutrient') || message.includes('soil')) {
      return 'Soil testing is important before applying fertilizers. Generally, NPK fertilizers work well for most crops. Organic fertilizers like vermicompost are also excellent for soil health.'
    }
    
    if (message.includes('irrigation') || message.includes('water')) {
      return 'Proper irrigation timing is crucial. Water early morning or late evening to reduce evaporation. Drip irrigation systems are most efficient for water conservation.'
    }
    
    if (message.includes('harvest') || message.includes('when to harvest')) {
      return 'Harvest timing depends on crop maturity indicators like color, size, and firmness. Check our Price Predictor for optimal selling times to maximize profits.'
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return 'Hello! I\'m your AI farming assistant. I can help you with weather predictions, crop diseases, market prices, farming tools, and general agriculture advice. What would you like to know?'
    }
    
    // Default responses for app-related queries
    if (message.includes('app') || message.includes('feature') || message.includes('how to use')) {
      return 'Velan AI offers 4 main features: 1) Weather Predictor for climate advice, 2) Disease Identifier for crop health, 3) Price Predictor for market insights, 4) Tools & Seeds marketplace. You can also post your crops for buyers to see.'
    }
    
    // Default response
    return 'I\'m here to help with all your farming needs! You can ask me about weather, crop diseases, market prices, farming tools, or any agricultural practices. How can I assist you today?'
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-green-600 text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>AI Assistant</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-0.5 text-green-600" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5" />
                      )}
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-green-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('askQuestion', language)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}