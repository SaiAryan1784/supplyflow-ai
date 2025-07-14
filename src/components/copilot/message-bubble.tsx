'use client'

import { motion } from 'framer-motion'
import { Message } from 'ai/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Bot, 
  Loader2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface MessageBubbleProps {
  message: Message
  isLoading?: boolean
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getMessageType = (content: string) => {
    if (content.toLowerCase().includes('error') || content.toLowerCase().includes('failed')) {
      return 'error'
    }
    if (content.toLowerCase().includes('warning') || content.toLowerCase().includes('risk')) {
      return 'warning'
    }
    if (content.toLowerCase().includes('success') || content.toLowerCase().includes('completed')) {
      return 'success'
    }
    return 'info'
  }

  const messageType = getMessageType(message.content)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-supply-info' 
            : 'bg-supply-primary'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <Card className={`p-4 ${
          isUser 
            ? 'bg-supply-info text-white border-supply-info' 
            : 'bg-card text-card-foreground border-border'
        }`}>
          <div className="space-y-2">
            {/* Message Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium opacity-70">
                  {isUser ? 'You' : 'AI Assistant'}
                </span>
                {isAssistant && (
                  <Badge variant="secondary" className="text-xs">
                    Supply Chain AI
                  </Badge>
                )}
              </div>
              
              {/* Message Type Indicator */}
              {isAssistant && (
                <div className="flex items-center gap-1">
                  {messageType === 'error' && (
                    <AlertTriangle className="w-3 h-3 text-supply-error" />
                  )}
                  {messageType === 'warning' && (
                    <AlertTriangle className="w-3 h-3 text-supply-warning" />
                  )}
                  {messageType === 'success' && (
                    <CheckCircle className="w-3 h-3 text-supply-success" />
                  )}
                  {messageType === 'info' && (
                    <Info className="w-3 h-3 text-supply-info" />
                  )}
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="prose prose-sm max-w-none">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm opacity-70">Thinking...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              )}
            </div>

            {/* Message Actions */}
            {isAssistant && !isLoading && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-6 px-2 text-xs hover:bg-muted"
                >
                  {copied ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-muted"
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-muted"
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}