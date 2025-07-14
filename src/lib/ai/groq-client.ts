import { createGroq } from '@ai-sdk/groq'
import { generateText, streamText, generateObject } from 'ai'
import { z } from 'zod'

// Initialize Groq client with API key
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Supply chain specific models
export const GROQ_MODELS = {
  FAST: 'llama-3.1-8b-instant',    // Ultra fast responses
  BALANCED: 'llama-3.1-70b-versatile', // Balanced speed/quality
  SMART: 'llama-3.2-90b-text-preview', // Highest quality
} as const

// Supply chain context for better responses
const SUPPLY_CHAIN_CONTEXT = `You are an expert supply chain AI assistant. You have deep knowledge of:
- Logistics and transportation
- Inventory management
- Supplier relationships
- Risk management
- Demand forecasting
- Supply chain optimization
- Disruption management

Always provide practical, actionable advice. Use data-driven insights when possible.`

export class GroqSupplyChainAI {
  private model: string
  
  constructor(model: string = GROQ_MODELS.BALANCED) {
    this.model = model
  }

  // Generate quick text response
  async generateResponse(prompt: string, context?: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: groq(this.model),
        messages: [
          { role: 'system', content: SUPPLY_CHAIN_CONTEXT },
          { role: 'user', content: context ? `Context: ${context}\n\nQuestion: ${prompt}` : prompt }
        ],
        temperature: 0.7,
        maxTokens: 500,
      })
      
      return text
    } catch (error) {
      console.error('Groq generation error:', error)
      throw new Error('Failed to generate response')
    }
  }

  // Stream response for real-time chat
  async streamResponse(prompt: string, context?: string) {
    try {
      const result = await streamText({
        model: groq(this.model),
        messages: [
          { role: 'system', content: SUPPLY_CHAIN_CONTEXT },
          { role: 'user', content: context ? `Context: ${context}\n\nQuestion: ${prompt}` : prompt }
        ],
        temperature: 0.7,
        maxTokens: 800,
      })
      
      return result.toTextStreamResponse()
    } catch (error) {
      console.error('Groq streaming error:', error)
      throw new Error('Failed to stream response')
    }
  }

  // Generate structured supply chain analysis
  async analyzeSupplyChain(data: Record<string, unknown>) {
    const analysisSchema = z.object({
      riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
      riskFactors: z.array(z.string()),
      recommendations: z.array(z.string()),
      priority: z.enum(['low', 'medium', 'high', 'urgent']),
      estimatedImpact: z.string(),
      timeToResolve: z.string(),
    })

    try {
      const { object } = await generateObject({
        model: groq(this.model),
        schema: analysisSchema,
        prompt: `Analyze this supply chain data and provide structured insights: ${JSON.stringify(data)}`,
      })
      
      return object
    } catch (error) {
      console.error('Groq analysis error:', error)
      throw new Error('Failed to analyze supply chain data')
    }
  }

  // Generate disruption response plan
  async generateDisruptionResponse(disruption: Record<string, unknown>) {
    const responseSchema = z.object({
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      affectedRoutes: z.array(z.string()),
      alternativeRoutes: z.array(z.object({
        route: z.string(),
        costIncrease: z.number(),
        timeDelay: z.string(),
        confidence: z.number(),
      })),
      immediateActions: z.array(z.string()),
      longTermStrategies: z.array(z.string()),
      estimatedRecoveryTime: z.string(),
      financialImpact: z.string(),
    })

    try {
      const { object } = await generateObject({
        model: groq(this.model),
        schema: responseSchema,
        prompt: `Generate a comprehensive disruption response plan for: ${JSON.stringify(disruption)}`,
      })
      
      return object
    } catch (error) {
      console.error('Groq disruption response error:', error)
      throw new Error('Failed to generate disruption response')
    }
  }

  // Quick decision support
  async getQuickDecision(scenario: string, options: string[]): Promise<string> {
    const prompt = `Given this supply chain scenario: "${scenario}"
    
Available options:
${options.map((option, i) => `${i + 1}. ${option}`).join('\n')}

Provide a quick recommendation with reasoning (max 3 sentences).`

    return this.generateResponse(prompt)
  }

  // Demand forecasting insights
  async analyzeDemandPattern(historicalData: Record<string, unknown>) {
    const forecastSchema = z.object({
      trend: z.enum(['increasing', 'decreasing', 'stable', 'volatile']),
      seasonality: z.boolean(),
      forecastAccuracy: z.number(),
      riskFactors: z.array(z.string()),
      recommendations: z.array(z.string()),
      confidenceLevel: z.number(),
    })

    try {
      const { object } = await generateObject({
        model: groq(this.model),
        schema: forecastSchema,
        prompt: `Analyze this demand data and provide forecasting insights: ${JSON.stringify(historicalData)}`,
      })
      
      return object
    } catch (error) {
      console.error('Groq demand analysis error:', error)
      throw new Error('Failed to analyze demand pattern')
    }
  }
}

// Export singleton instance
export const supplyChainAI = new GroqSupplyChainAI()

// Helper functions for specific use cases
export const generateSupplyChainInsight = async (data: Record<string, unknown>, question: string) => {
  return supplyChainAI.generateResponse(question, JSON.stringify(data))
}

export const streamSupplyChainChat = async (message: string, context?: string) => {
  return supplyChainAI.streamResponse(message, context)
}