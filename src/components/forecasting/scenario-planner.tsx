"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ForecastDataPoint } from "@/hooks/useForecasting";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  X,
} from "lucide-react";

interface ScenarioPlannerProps {
  baselineForecast: ForecastDataPoint[];
  selectedProduct: string;
  selectedRegion: string;
}

interface Scenario {
  id: string;
  name: string;
  demandMultiplier: number;
  seasonalityFactor: number;
  volatilityIncrease: number;
  description: string;
  active: boolean;
}

export function ScenarioPlanner({
  baselineForecast,
  selectedProduct,
  selectedRegion,
}: ScenarioPlannerProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: "optimistic",
      name: "Optimistic Growth",
      demandMultiplier: 1.2,
      seasonalityFactor: 1.1,
      volatilityIncrease: 0.8,
      description: "Market expansion and increased consumer demand",
      active: false,
    },
    {
      id: "pessimistic",
      name: "Economic Downturn",
      demandMultiplier: 0.8,
      seasonalityFactor: 0.9,
      volatilityIncrease: 1.3,
      description: "Reduced consumer spending and market contraction",
      active: false,
    },
    {
      id: "disruption",
      name: "Supply Disruption",
      demandMultiplier: 1.1,
      seasonalityFactor: 1.0,
      volatilityIncrease: 1.8,
      description: "Increased demand due to supply constraints",
      active: false,
    },
  ]);

  const [customScenario, setCustomScenario] = useState({
    name: "Custom Scenario",
    demandMultiplier: 1.0,
    seasonalityFactor: 1.0,
    volatilityIncrease: 1.0,
  });

  const toggleScenario = (scenarioId: string) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId ? { ...s, active: !s.active } : s
    ));
  };

  const calculateScenarioImpact = (scenario: Scenario) => {
    const forecastData = baselineForecast.filter(d => d.predicted !== undefined);
    const totalBaseline = forecastData.reduce((sum, d) => sum + (d.predicted || 0), 0);
    const totalScenario = totalBaseline * scenario.demandMultiplier;
    const impact = ((totalScenario - totalBaseline) / totalBaseline) * 100;
    
    return {
      impact: Math.round(impact * 10) / 10,
      totalDemand: Math.round(totalScenario),
      variance: Math.round(scenario.volatilityIncrease * 100 - 100),
    };
  };

  const addCustomScenario = () => {
    const newScenario: Scenario = {
      id: `custom_${Date.now()}`,
      name: customScenario.name,
      demandMultiplier: customScenario.demandMultiplier,
      seasonalityFactor: customScenario.seasonalityFactor,
      volatilityIncrease: customScenario.volatilityIncrease,
      description: "Custom scenario configuration",
      active: true,
    };
    
    setScenarios([...scenarios, newScenario]);
    setCustomScenario({
      name: "Custom Scenario",
      demandMultiplier: 1.0,
      seasonalityFactor: 1.0,
      volatilityIncrease: 1.0,
    });
  };

  const removeScenario = (scenarioId: string) => {
    setScenarios(scenarios.filter(s => s.id !== scenarioId));
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-supply-accent" />
          Scenario Planning
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Explore different demand scenarios and their potential impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predefined Scenarios */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Predefined Scenarios
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.filter(s => !s.id.startsWith('custom')).map((scenario) => {
              const impact = calculateScenarioImpact(scenario);
              
              return (
                <motion.div
                  key={scenario.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    scenario.active
                      ? "border-supply-primary bg-supply-primary/5"
                      : "border-border bg-muted/20"
                  }`}
                  onClick={() => toggleScenario(scenario.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-foreground">
                      {scenario.name}
                    </h5>
                    <Badge
                      variant={scenario.active ? "default" : "outline"}
                      className={scenario.active ? "bg-supply-primary" : ""}
                    >
                      {scenario.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {scenario.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Demand Impact:</span>
                      <span className={`font-medium ${
                        impact.impact > 0 ? "text-supply-success" : "text-supply-error"
                      }`}>
                        {impact.impact > 0 ? "+" : ""}{impact.impact}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Volatility:</span>
                      <span className="text-foreground font-medium">
                        {impact.variance > 0 ? "+" : ""}{impact.variance}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Custom Scenario Builder */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Custom Scenario Builder
          </h4>
          
          <div className="p-4 bg-muted/20 rounded-lg space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Scenario Name
              </label>
              <input
                type="text"
                value={customScenario.name}
                onChange={(e) => setCustomScenario({
                  ...customScenario,
                  name: e.target.value
                })}
                className="w-full p-2 text-sm bg-background border border-border rounded"
              />
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">
                  Demand Multiplier: {customScenario.demandMultiplier.toFixed(1)}x
                </label>
                <Slider
                  value={[customScenario.demandMultiplier]}
                  onValueChange={(value) => setCustomScenario({
                    ...customScenario,
                    demandMultiplier: value[0]
                  })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">
                  Seasonality Factor: {customScenario.seasonalityFactor.toFixed(1)}x
                </label>
                <Slider
                  value={[customScenario.seasonalityFactor]}
                  onValueChange={(value) => setCustomScenario({
                    ...customScenario,
                    seasonalityFactor: value[0]
                  })}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">
                  Volatility Increase: {customScenario.volatilityIncrease.toFixed(1)}x
                </label>
                <Slider
                  value={[customScenario.volatilityIncrease]}
                  onValueChange={(value) => setCustomScenario({
                    ...customScenario,
                    volatilityIncrease: value[0]
                  })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
            
            <Button
              onClick={addCustomScenario}
              size="sm"
              className="w-full bg-supply-accent hover:bg-supply-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Scenario
            </Button>
          </div>
        </div>

        {/* Active Scenarios Summary */}
        {scenarios.some(s => s.active) && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">
              Active Scenarios Impact
            </h4>
            
            <div className="space-y-3">
              {scenarios.filter(s => s.active).map((scenario) => {
                const impact = calculateScenarioImpact(scenario);
                
                return (
                  <div
                    key={scenario.id}
                    className="flex items-center justify-between p-3 bg-supply-primary/10 border border-supply-primary/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {scenario.name}
                        </span>
                        {scenario.id.startsWith('custom') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScenario(scenario.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs">
                        <span className="text-muted-foreground">
                          Total Demand: {impact.totalDemand.toLocaleString()}
                        </span>
                        <span className={`font-medium ${
                          impact.impact > 0 ? "text-supply-success" : "text-supply-error"
                        }`}>
                          {impact.impact > 0 ? "+" : ""}{impact.impact}% vs baseline
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {impact.impact > 0 ? (
                        <TrendingUp className="w-4 h-4 text-supply-success" />
                      ) : impact.impact < 0 ? (
                        <TrendingDown className="w-4 h-4 text-supply-error" />
                      ) : (
                        <BarChart3 className="w-4 h-4 text-supply-info" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scenario Planning Tips */}
        <div className="p-4 bg-supply-info/10 border border-supply-info/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-supply-info" />
            <span className="text-sm font-medium text-supply-info">
              Scenario Planning Tips
            </span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use optimistic scenarios to plan for growth opportunities</li>
            <li>• Pessimistic scenarios help identify risk mitigation strategies</li>
            <li>• High volatility scenarios test supply chain resilience</li>
            <li>• Compare multiple scenarios to make robust decisions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}