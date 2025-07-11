'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { MessageBubble } from './message-bubble'
import { Suggestions } from './suggestions'
import { 
  Send, 
  Loader2, 
  Brain, 
  Zap, 
  AlertTriangle,
  TrendingUp,
  Network,
  BarChart3,
  Mic,
  MicOff
} from 'lucide-react'

const quickPrompts = [
  {
    icon: AlertTriangle,
    title: "Disruption Analysis",
    prompt: "What are the current supply chain disruptions I should be aware of?",
    color: "bg-red-500/20 text-red-400"
  },
  {
    icon: TrendingUp,
    title: "Demand Forecast",
    prompt: "Show me demand forecasting insights for the next quarter",
    color: "bg-green-500/20 text-green-400"
  },
  {
    icon: Network,
    title: "Route Optimization",
    prompt: "Suggest optimal routes for my current supply chain network",
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    prompt: "Analyze my supply chain performance and suggest improvements",
    color: "bg-purple-500/20 text-purple-400"
  }
]

export function ChatInterface() {
  const [isListening, setIsListening] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your AI Supply Chain Copilot. I can help you with disruption analysis, demand forecasting, route optimization, and supply chain insights. What would you like to know?'
      }
    ]
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle quick prompt selection
  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt)
    const event = new Event('submit', { cancelable: true, bubbles: true })
    const form = document.getElementById('chat-form') as HTMLFormElement
    if (form) {
      handleInputChange({ target: { value: prompt } } as any)
      setTimeout(() => form.dispatchEvent(event), 100)
    }
  }

  // Voice input (placeholder - would need speech recognition API)
  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Implement speech recognition here
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-4 bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-purple-400" />
            Supply Chain AI Copilot
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Groq
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickPrompts.map((prompt, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${prompt.color} flex items-center justify-center`}>
                    <prompt.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{prompt.title}</div>
                    <div className="text-sm text-slate-400 mt-1">{prompt.prompt}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLoading={isLoading && message.id === messages[messages.length - 1]?.id}
            />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center p-4"
          >
            <Loader2 className="w-5 h-5 animate-spin text-purple-400 mr-2" />
            <span className="text-slate-400">AI is thinking...</span>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
          >
            <div className="text-red-400 font-medium">Error</div>
            <div className="text-red-300 text-sm">{error.message}</div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <form 
            id="chat-form"
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about supply chain disruptions, demand forecasting, route optimization..."
                className="min-h-[48px] resize-none bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
              />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleVoiceInput}
                className={`absolute right-2 top-2 ${isListening ? 'text-red-400' : 'text-slate-400'}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          
          <div className="mt-2 text-xs text-slate-500">
            Press <kbd className="px-1 py-0.5 bg-slate-700 rounded">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-700 rounded">Shift+Enter</kbd> for new line
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Suggestions onSuggestionClick={handleQuickPrompt} />
    </div>
  )
}