"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DemandInsights } from "@/hooks/useForecasting";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

interface DemandInsightsProps {
  insights: DemandInsights;
  selectedProduct: string;
  selectedRegion: string;
}

export function DemandInsights({
  insights,
  selectedProduct,
  selectedRegion,
}: DemandInsightsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-supply-success" />;
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-supply-error" />;
      case "volatile":
        return <BarChart3 className="w-4 h-4 text-supply-warning" />;
      default:
        return <BarChart3 className="w-4 h-4 text-supply-info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-supply-success";
      case "decreasing":
        return "text-supply-error";
      case "volatile":
        return "text-supply-warning";
      default:
        return "text-supply-info";
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-supply-secondary" />
          Demand Insights
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          AI-generated insights for {selectedProduct} in {selectedRegion}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trend Analysis */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Trend Analysis
          </h4>
          
          <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
            {getTrendIcon(insights.trend)}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getTrendColor(insights.trend)}`}>
                  {insights.trend.charAt(0).toUpperCase() + insights.trend.slice(1)} Trend
                </span>
                <Badge variant="outline" className="text-xs">
                  {insights.trendChange}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Demand is showing a {insights.trend} pattern over the forecast period
              </p>
            </div>
          </div>
        </div>

        {/* Seasonality */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-supply-info" />
            Seasonality
          </h4>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Seasonal Pattern Detected
              </span>
              <Badge 
                variant={insights.seasonality ? "default" : "outline"}
                className={insights.seasonality ? "bg-supply-success" : ""}
              >
                {insights.seasonality ? "Yes" : "No"}
              </Badge>
            </div>
            {insights.seasonality && insights.seasonalPattern && (
              <p className="text-xs text-muted-foreground">
                {insights.seasonalPattern}
              </p>
            )}
          </div>
        </div>

        {/* Key Drivers */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Key Demand Drivers
          </h4>
          
          <div className="space-y-2">
            {insights.keyDrivers.map((driver, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-supply-success/10 border border-supply-success/20 rounded"
              >
                <div className="w-2 h-2 bg-supply-success rounded-full"></div>
                <span className="text-xs text-foreground">{driver}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-supply-warning" />
            Risk Factors
          </h4>
          
          <div className="space-y-2">
            {insights.riskFactors.map((risk, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-supply-warning/10 border border-supply-warning/20 rounded"
              >
                <div className="w-2 h-2 bg-supply-warning rounded-full"></div>
                <span className="text-xs text-foreground">{risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Strategic Recommendations
          </h4>
          
          <div className="space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-supply-primary/10 border border-supply-primary/20 rounded-lg"
              >
                <div className="w-1.5 h-1.5 bg-supply-primary rounded-full mt-1.5"></div>
                <span className="text-xs text-foreground">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Confidence Assessment
          </h4>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Overall Confidence
              </span>
              <Badge
                variant="outline"
                className={`${
                  insights.confidence >= 0.8
                    ? "text-supply-success border-supply-success"
                    : insights.confidence >= 0.6
                    ? "text-supply-info border-supply-info"
                    : "text-supply-warning border-supply-warning"
                }`}
              >
                {Math.round(insights.confidence * 100)}%
              </Badge>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-supply-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${insights.confidence * 100}%` }}
              />
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              {insights.confidence >= 0.8
                ? "High confidence in forecast accuracy and insights"
                : insights.confidence >= 0.6
                ? "Moderate confidence - monitor for changes"
                : "Lower confidence - consider additional data sources"}
            </p>
          </div>
        </div>

        {/* Action Items */}
        <div className="p-4 bg-supply-secondary/10 border border-supply-secondary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-supply-secondary" />
            <span className="text-sm font-medium text-supply-secondary">
              Next Steps
            </span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Review inventory levels against forecast predictions</li>
            <li>• Adjust procurement schedules based on trend analysis</li>
            <li>• Monitor key drivers for early warning signals</li>
            <li>• Implement risk mitigation strategies for identified factors</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}