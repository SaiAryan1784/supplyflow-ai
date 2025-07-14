'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
    color: "bg-supply-error/20 text-supply-error"
  },
  {
    icon: TrendingUp,
    title: "Demand Forecast",
    prompt: "Show me demand forecasting insights for the next quarter",
    color: "bg-supply-success/20 text-supply-success"
  },
  {
    icon: Network,
    title: "Route Optimization",
    prompt: "Suggest optimal routes for my current supply chain network",
    color: "bg-supply-info/20 text-supply-info"
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    prompt: "Analyze my supply chain performance and suggest improvements",
    color: "bg-supply-primary/20 text-supply-primary"
  }
]

export function ChatInterface() {
  const [isListening, setIsListening] = useState(false)
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
    const event = new Event('submit', { cancelable: true, bubbles: true })
    const form = document.getElementById('chat-form') as HTMLFormElement
    if (form) {
      handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>)
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
      <Card className="mb-4 bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="w-5 h-5 text-supply-primary" />
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
          <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickPrompts.map((prompt, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${prompt.color} flex items-center justify-center`}>
                    <prompt.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{prompt.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{prompt.prompt}</div>
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
            <Loader2 className="w-5 h-5 animate-spin text-supply-primary mr-2" />
            <span className="text-muted-foreground">AI is thinking...</span>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-destructive/20 border border-destructive/50 rounded-lg"
          >
            <div className="text-destructive font-medium">Error</div>
            <div className="text-destructive/80 text-sm">{error.message}</div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <Card className="bg-card/50 border-border">
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
                className="min-h-[48px] resize-none bg-background/50 border-input text-foreground placeholder-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    const form = e.currentTarget.form
                    if (form) {
                      const formEvent = new Event('submit', { cancelable: true, bubbles: true })
                      form.dispatchEvent(formEvent)
                    }
                  }
                }}
              />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleVoiceInput}
                className={`absolute right-2 top-2 ${isListening ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-supply-primary hover:bg-supply-primary/90"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Press <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-muted rounded">Shift+Enter</kbd> for new line
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Suggestions onSuggestionClick={handleQuickPrompt} />
    </div>
  )
}