"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RiskMetrics, Disruption } from "@/hooks/useDisruptions";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Target,
  Clock,
} from "lucide-react";

interface RiskAssessmentProps {
  riskMetrics: RiskMetrics;
  disruptions: Disruption[];
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export function RiskAssessment({
  riskMetrics,
  disruptions,
  timeframe,
  onTimeframeChange,
}: RiskAssessmentProps) {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>("overall");

  const timeframes = [
    { id: "24h", label: "24 Hours" },
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
  ];

  const riskCategories = [
    {
      id: "weather",
      label: "Weather Risk",
      value: 35,
      trend: "up",
      color: "text-supply-info",
      disruptions: disruptions.filter(d => d.type === "weather").length,
    },
    {
      id: "traffic",
      label: "Traffic Risk",
      value: 22,
      trend: "stable",
      color: "text-supply-warning",
      disruptions: disruptions.filter(d => d.type === "traffic").length,
    },
    {
      id: "supplier",
      label: "Supplier Risk",
      value: 18,
      trend: "down",
      color: "text-supply-success",
      disruptions: disruptions.filter(d => d.type === "supplier").length,
    },
    {
      id: "cyber",
      label: "Cyber Risk",
      value: 45,
      trend: "up",
      color: "text-supply-error",
      disruptions: disruptions.filter(d => d.type === "cyber").length,
    },
    {
      id: "geopolitical",
      label: "Geopolitical Risk",
      value: 28,
      trend: "stable",
      color: "text-supply-secondary",
      disruptions: disruptions.filter(d => d.type === "geopolitical").length,
    },
  ];

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "text-supply-error" };
    if (score >= 60) return { level: "High", color: "text-supply-warning" };
    if (score >= 40) return { level: "Medium", color: "text-supply-info" };
    return { level: "Low", color: "text-supply-success" };
  };

  const overallRisk = getRiskLevel(riskMetrics.riskScore);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-supply-warning" />
              Risk Assessment
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Comprehensive risk analysis and predictions
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf.id}
                variant={timeframe === tf.id ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeframeChange(tf.id)}
                className="text-xs"
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="text-center space-y-3">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="var(--muted)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={overallRisk.level === "Critical" ? "var(--supply-error)" :
                       overallRisk.level === "High" ? "var(--supply-warning)" :
                       overallRisk.level === "Medium" ? "var(--supply-info)" :
                       "var(--supply-success)"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(riskMetrics.riskScore / 100) * 314} 314`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {riskMetrics.riskScore}
                </div>
                <div className="text-xs text-muted-foreground">Risk Score</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <Badge
              variant="outline"
              className={`${overallRisk.color} border-current`}
            >
              {overallRisk.level} Risk
            </Badge>
            <div className="flex items-center justify-center gap-1 text-sm">
              {riskMetrics.riskTrend === "increasing" ? (
                <TrendingUp className="w-4 h-4 text-supply-error" />
              ) : riskMetrics.riskTrend === "decreasing" ? (
                <TrendingDown className="w-4 h-4 text-supply-success" />
              ) : (
                <BarChart3 className="w-4 h-4 text-supply-info" />
              )}
              <span className="text-muted-foreground capitalize">
                {riskMetrics.riskTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Categories */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Risk Breakdown by Category
          </h4>
          
          <div className="space-y-3">
            {riskCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRiskCategory === category.id
                    ? "border-supply-primary bg-supply-primary/5"
                    : "border-border bg-muted/20"
                }`}
                onClick={() => setSelectedRiskCategory(category.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${category.color}`}>
                      {category.label}
                    </span>
                    {category.disruptions > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {category.disruptions} active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-foreground">
                      {category.value}%
                    </span>
                    {category.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-supply-error" />
                    ) : category.trend === "down" ? (
                      <TrendingDown className="w-3 h-3 text-supply-success" />
                    ) : (
                      <BarChart3 className="w-3 h-3 text-supply-info" />
                    )}
                  </div>
                </div>
                <Progress value={category.value} className="h-2" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-supply-info" />
              <span className="text-muted-foreground">Prediction Accuracy</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {riskMetrics.predictionAccuracy}%
            </div>
            <Progress value={riskMetrics.predictionAccuracy} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-supply-secondary" />
              <span className="text-muted-foreground">Response Time</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {riskMetrics.responseTime}min
            </div>
            <Progress value={(10 - riskMetrics.responseTime) * 10} className="h-2" />
          </div>
        </div>

        {/* Risk Recommendations */}
        <div className="p-4 bg-supply-warning/10 border border-supply-warning/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-supply-warning" />
            <span className="text-sm font-medium text-supply-warning">
              Risk Mitigation Recommendations
            </span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Increase inventory buffer for high-risk routes</li>
            <li>• Implement backup supplier agreements</li>
            <li>• Monitor cyber security threats closely</li>
            <li>• Consider insurance for critical shipments</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}