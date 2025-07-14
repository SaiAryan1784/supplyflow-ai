"use client";

import { useState, useEffect } from "react";
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
import { NavBar } from "@/components/shared/nav-bar";
import { ForecastChart } from "@/components/forecasting/forecast-chart";
import { ModelSelector } from "@/components/forecasting/model-selector";
import { AccuracyMetrics } from "@/components/forecasting/accuracy-metrics";
import { DemandInsights } from "@/components/forecasting/demand-insights";
import { ScenarioPlanner } from "@/components/forecasting/scenario-planner";
import { useForecasting } from "@/hooks/useForecasting";
import {
  TrendingUp,
  BarChart3,
  Brain,
  Target,
  Calendar,
  Zap,
  Download,
  RefreshCw,
} from "lucide-react";

export default function ForecastingPage() {
  const {
    forecastData,
    selectedModel,
    setSelectedModel,
    timeHorizon,
    setTimeHorizon,
    confidenceLevel,
    setConfidenceLevel,
    accuracyMetrics,
    isGenerating,
    generateForecast,
    exportForecast,
    demandInsights,
  } = useForecasting();

  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("global");

  const forecastSummary = [
    {
      id: "accuracy",
      label: "Model Accuracy",
      value: accuracyMetrics.accuracy ? `${accuracyMetrics.accuracy}%` : "--",
      icon: Target,
      color: "text-supply-success",
      trend: "+2.1%",
    },
    {
      id: "trend",
      label: "Demand Trend",
      value: demandInsights.trend || "Stable",
      icon: TrendingUp,
      color: "text-supply-primary",
      trend: demandInsights.trendChange || "0%",
    },
    {
      id: "confidence",
      label: "Confidence Level",
      value: `${confidenceLevel}%`,
      icon: Brain,
      color: "text-supply-info",
      trend: "High",
    },
    {
      id: "horizon",
      label: "Forecast Horizon",
      value: `${timeHorizon} days`,
      icon: Calendar,
      color: "text-supply-secondary",
      trend: "Extended",
    },
  ];

  const products = [
    { id: "all", label: "All Products", count: 156 },
    { id: "electronics", label: "Electronics", count: 45 },
    { id: "automotive", label: "Automotive", count: 32 },
    { id: "textiles", label: "Textiles", count: 28 },
    { id: "food", label: "Food & Beverage", count: 51 },
  ];

  const regions = [
    { id: "global", label: "Global" },
    { id: "north-america", label: "North America" },
    { id: "europe", label: "Europe" },
    { id: "asia-pacific", label: "Asia Pacific" },
    { id: "latin-america", label: "Latin America" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-supply-primary" />
                Demand Forecasting
              </h1>
              <p className="text-muted-foreground">
                AI-powered demand prediction with confidence intervals and scenario planning
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                ML-Powered
              </Badge>
              <Button
                onClick={generateForecast}
                disabled={isGenerating}
                className="bg-supply-primary hover:bg-supply-primary/90"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Generate Forecast
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Forecast Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {forecastSummary.map((metric, index) => (
            <motion.div
              key={metric.id}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-card border-border transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    <Badge variant="outline" className="text-xs">
                      {metric.trend}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Product Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Product Category
              </label>
              <div className="flex flex-wrap gap-2">
                {products.map((product) => (
                  <Button
                    key={product.id}
                    variant={selectedProduct === product.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedProduct(product.id)}
                    className="flex items-center gap-2"
                  >
                    {product.label}
                    <Badge variant="secondary" className="ml-1">
                      {product.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Region
              </label>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant={selectedRegion === region.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRegion(region.id)}
                  >
                    {region.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Model Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              timeHorizon={timeHorizon}
              onTimeHorizonChange={setTimeHorizon}
              confidenceLevel={confidenceLevel}
              onConfidenceLevelChange={setConfidenceLevel}
              onGenerate={generateForecast}
              isGenerating={isGenerating}
            />
          </motion.div>

          {/* Forecast Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-supply-primary" />
                      Demand Forecast
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Historical data with AI-generated predictions and confidence intervals
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportForecast}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ForecastChart
                  data={forecastData}
                  selectedProduct={selectedProduct}
                  selectedRegion={selectedRegion}
                  confidenceLevel={confidenceLevel}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Accuracy Metrics & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AccuracyMetrics
              metrics={accuracyMetrics}
              selectedModel={selectedModel}
              timeHorizon={timeHorizon}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <DemandInsights
              insights={demandInsights}
              selectedProduct={selectedProduct}
              selectedRegion={selectedRegion}
            />
          </motion.div>
        </div>

        {/* Scenario Planner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <ScenarioPlanner
            baselineForecast={forecastData}
            selectedProduct={selectedProduct}
            selectedRegion={selectedRegion}
          />
        </motion.div>
      </div>
    </div>
  );
}