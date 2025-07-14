"use client";

import { useState, useEffect, useRef } from "react";
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
import { RouteVisualization } from "@/components/routing/route-visualization";
import { RouteControls } from "@/components/routing/route-controls";
import { RouteResults } from "@/components/routing/route-results";
import { useRouting } from "@/hooks/useRouting";
import {
  Network,
  Zap,
  MapPin,
  Route,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function RoutingPage() {
  const {
    nodes,
    edges,
    selectedAlgorithm,
    setSelectedAlgorithm,
    sourceNode,
    setSourceNode,
    targetNode,
    setTargetNode,
    optimizationResults,
    isCalculating,
    calculateOptimalRoute,
    routeHistory,
  } = useRouting();

  const [selectedMetric, setSelectedMetric] = useState<string>("cost");

  const metrics = [
    {
      id: "cost",
      label: "Total Cost",
      value: optimizationResults?.totalCost ? `$${optimizationResults.totalCost.toLocaleString()}` : "--",
      icon: DollarSign,
      color: "text-supply-primary",
    },
    {
      id: "time",
      label: "Transit Time",
      value: optimizationResults?.totalTime ? `${optimizationResults.totalTime} days` : "--",
      icon: Clock,
      color: "text-supply-info",
    },
    {
      id: "efficiency",
      label: "Route Efficiency",
      value: optimizationResults?.efficiency ? `${optimizationResults.efficiency}%` : "--",
      icon: TrendingUp,
      color: "text-supply-success",
    },
    {
      id: "risk",
      label: "Risk Score",
      value: optimizationResults?.riskScore ? optimizationResults.riskScore.toFixed(1) : "--",
      icon: AlertTriangle,
      color: "text-supply-warning",
    },
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
                <Network className="w-8 h-8 text-supply-secondary" />
                Smart Routing Engine
              </h1>
              <p className="text-muted-foreground">
                Optimize supply chain routes using advanced graph algorithms
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI-Powered Optimization
            </Badge>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <Card className={`bg-card border-border transition-all duration-300 cursor-pointer ${
                selectedMetric === metric.id ? "ring-2 ring-supply-primary" : ""
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    <Badge variant="outline" className="text-xs">
                      Live
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RouteControls
              nodes={nodes}
              selectedAlgorithm={selectedAlgorithm}
              setSelectedAlgorithm={setSelectedAlgorithm}
              sourceNode={sourceNode}
              setSourceNode={setSourceNode}
              targetNode={targetNode}
              setTargetNode={setTargetNode}
              onCalculate={calculateOptimalRoute}
              isCalculating={isCalculating}
            />
          </motion.div>

          {/* Route Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Route className="w-5 h-5 text-supply-secondary" />
                  Network Visualization
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Interactive supply chain network with optimal routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RouteVisualization
                  nodes={nodes}
                  edges={edges}
                  optimalRoute={optimizationResults?.path}
                  sourceNode={sourceNode}
                  targetNode={targetNode}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Route Results */}
        {optimizationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <RouteResults
              results={optimizationResults}
              algorithm={selectedAlgorithm}
              routeHistory={routeHistory}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}