import { NextRequest, NextResponse } from 'next/server'
import { supplyChainAI } from '@/lib/ai/groq-client'
import { rateLimit } from '@/lib/rate-limit'

// Rate limiting for API calls
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Limit each IP to 500 requests per interval
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await limiter.check(request, 10) // 10 requests per minute per IP
    
    const { message, context, conversationHistory } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build context from conversation history
    let enhancedContext = context || ''
    if (conversationHistory && conversationHistory.length > 0) {
      const recentMessages = conversationHistory.slice(-5) // Last 5 messages
      enhancedContext += `\n\nRecent conversation:\n${recentMessages
        .map((msg: any) => `${msg.role}: ${msg.content}`)
        .join('\n')}`
    }

    // Stream response back to client
    const stream = await supplyChainAI.streamResponse(message, enhancedContext)
    
    return stream
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Handle rate limiting
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

// Handle supply chain analysis requests
export async function PUT(request: NextRequest) {
  try {
    await limiter.check(request, 5) // 5 analysis requests per minute
    
    const { data, analysisType } = await request.json()
    
    if (!data || !analysisType) {
      return NextResponse.json(
        { error: 'Data and analysis type are required' },
        { status: 400 }
      )
    }

    let result
    
    switch (analysisType) {
      case 'supply-chain':
        result = await supplyChainAI.analyzeSupplyChain(data)
        break
      case 'disruption':
        result = await supplyChainAI.generateDisruptionResponse(data)
        break
      case 'demand':
        result = await supplyChainAI.analyzeDemandPattern(data)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { error: 'Failed to perform analysis' },
      { status: 500 }
    )
  }
}