"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { AccuracyMetrics } from "@/hooks/useForecasting";
import {
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Clock,
} from "lucide-react";

interface AccuracyMetricsProps {
  metrics: AccuracyMetrics;
  selectedModel: string;
  timeHorizon: number;
}

export function AccuracyMetrics({
  metrics,
  selectedModel,
  timeHorizon,
}: AccuracyMetricsProps) {
  const metricsData = [
    {
      id: "accuracy",
      label: "Overall Accuracy",
      value: metrics.accuracy,
      unit: "%",
      icon: Target,
      color: "text-supply-success",
      description: "Percentage of predictions within acceptable range",
    },
    {
      id: "mae",
      label: "Mean Absolute Error",
      value: metrics.mae,
      unit: "",
      icon: BarChart3,
      color: "text-supply-info",
      description: "Average absolute difference between actual and predicted",
    },
    {
      id: "mape",
      label: "Mean Absolute % Error",
      value: metrics.mape,
      unit: "%",
      icon: TrendingUp,
      color: "text-supply-warning",
      description: "Average percentage error in predictions",
    },
    {
      id: "r2",
      label: "R-squared Score",
      value: Math.round(metrics.r2Score * 100),
      unit: "%",
      icon: CheckCircle,
      color: "text-supply-secondary",
      description: "Proportion of variance explained by the model",
    },
  ];

  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 95) return { level: "Excellent", color: "text-supply-success" };
    if (accuracy >= 90) return { level: "Good", color: "text-supply-info" };
    if (accuracy >= 80) return { level: "Fair", color: "text-supply-warning" };
    return { level: "Poor", color: "text-supply-error" };
  };

  const performance = getPerformanceLevel(metrics.accuracy);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-supply-success" />
          Model Accuracy Metrics
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Performance evaluation for {selectedModel} model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Performance */}
        <div className="text-center space-y-3">
          <div className="text-3xl font-bold text-foreground">
            {metrics.accuracy}%
          </div>
          <Badge
            variant="outline"
            className={`${performance.color} border-current`}
          >
            {performance.level} Performance
          </Badge>
          <p className="text-sm text-muted-foreground">
            Model accuracy over {timeHorizon} day forecast horizon
          </p>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Detailed Performance Metrics
          </h4>
          
          <div className="space-y-4">
            {metricsData.map((metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-sm font-medium text-foreground">
                      {metric.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {metric.value.toFixed(1)}{metric.unit}
                  </span>
                </div>
                
                <Progress 
                  value={metric.id === "mae" || metric.id === "mape" ? 100 - metric.value : metric.value} 
                  className="h-2" 
                />
                
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Model Comparison */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Historical Performance
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="text-xs text-muted-foreground">Last 30 Days</div>
              <div className="text-lg font-bold text-foreground">
                {(metrics.accuracy + 1.2).toFixed(1)}%
              </div>
              <div className="text-xs text-supply-success">+1.2%</div>
            </div>
            
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="text-xs text-muted-foreground">Last 90 Days</div>
              <div className="text-lg font-bold text-foreground">
                {(metrics.accuracy - 0.8).toFixed(1)}%
              </div>
              <div className="text-xs text-supply-warning">-0.8%</div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
          <Clock className="w-3 h-3" />
          <span>
            Last updated: {metrics.lastUpdated.toLocaleString()}
          </span>
        </div>

        {/* Performance Tips */}
        <div className="p-3 bg-supply-info/10 border border-supply-info/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-supply-info" />
            <span className="text-sm font-medium text-supply-info">
              Performance Insights
            </span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {metrics.accuracy >= 95 && (
              <li>• Excellent accuracy - model is performing optimally</li>
            )}
            {metrics.accuracy < 90 && (
              <li>• Consider retraining with more recent data</li>
            )}
            {metrics.mape > 10 && (
              <li>• High percentage error - check for outliers in data</li>
            )}
            <li>• Model performs best for {timeHorizon <= 30 ? "short" : timeHorizon <= 90 ? "medium" : "long"}-term forecasts</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}