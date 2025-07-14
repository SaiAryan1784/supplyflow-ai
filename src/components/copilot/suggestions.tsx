'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Route,
  BarChart3,
  Package,
  Truck,
  Factory
} from 'lucide-react'

interface SuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  {
    icon: AlertTriangle,
    text: "What are the current supply chain risks?",
    category: "Risk Analysis",
    color: "text-red-400"
  },
  {
    icon: TrendingUp,
    text: "Show me demand forecasting for Q1 2024",
    category: "Forecasting",
    color: "text-green-400"
  },
  {
    icon: Route,
    text: "Optimize routes from Asia to North America",
    category: "Optimization",
    color: "text-blue-400"
  },
  {
    icon: BarChart3,
    text: "Analyze inventory turnover rates",
    category: "Analytics",
    color: "text-purple-400"
  },
  {
    icon: Package,
    text: "Check stock levels for critical items",
    category: "Inventory",
    color: "text-orange-400"
  },
  {
    icon: Truck,
    text: "Track shipment delays and disruptions",
    category: "Logistics",
    color: "text-cyan-400"
  },
  {
    icon: Factory,
    text: "Evaluate supplier performance metrics",
    category: "Suppliers",
    color: "text-indigo-400"
  },
  {
    icon: Lightbulb,
    text: "Suggest cost reduction opportunities",
    category: "Optimization",
    color: "text-yellow-400"
  }
]

export function Suggestions({ onSuggestionClick }: SuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4"
    >
      <Card className="p-4 bg-slate-800/30 border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-slate-300">Suggested Questions</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}  
              transition={{ delay: 0.1 * index }}
            >
              <Button
                variant="ghost"
                onClick={() => onSuggestionClick(suggestion.text)}
                className="w-full justify-start p-3 h-auto text-left hover:bg-slate-700/50 group"
              >
                <div className="flex items-start gap-3">
                  <suggestion.icon className={`w-4 h-4 mt-0.5 ${suggestion.color} group-hover:scale-110 transition-transform`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 mb-1">{suggestion.category}</div>
                    <div className="text-sm text-black leading-relaxed">
                      {suggestion.text}
                    </div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Click any suggestion to get started, or type your own question above
          </p>
        </div>
      </Card>
    </motion.div>
  )
}