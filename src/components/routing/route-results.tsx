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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptimizationResult, RouteCalculation, RoutingAlgorithm } from "@/hooks/useRouting";
import {
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  Route,
  History,
  Download,
  Share,
  BarChart3,
} from "lucide-react";

interface RouteResultsProps {
  results: OptimizationResult;
  algorithm: RoutingAlgorithm;
  routeHistory: RouteCalculation[];
}

export function RouteResults({
  results,
  algorithm,
  routeHistory,
}: RouteResultsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const metrics = [
    {
      id: "cost",
      label: "Total Cost",
      value: `$${results.totalCost.toLocaleString()}`,
      icon: DollarSign,
      color: "text-supply-primary",
      change: "-15%",
      trend: "down",
    },
    {
      id: "time",
      label: "Transit Time",
      value: `${results.totalTime} days`,
      icon: Clock,
      color: "text-supply-info",
      change: "-2 days",
      trend: "down",
    },
    {
      id: "efficiency",
      label: "Route Efficiency",
      value: `${results.efficiency}%`,
      icon: TrendingUp,
      color: "text-supply-success",
      change: "+12%",
      trend: "up",
    },
    {
      id: "risk",
      label: "Risk Score",
      value: results.riskScore.toFixed(1),
      icon: AlertTriangle,
      color: "text-supply-warning",
      change: "-0.3",
      trend: "down",
    },
  ];

  const exportResults = () => {
    const data = {
      algorithm,
      timestamp: new Date().toISOString(),
      results,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `route_optimization_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-supply-primary" />
              Optimization Results
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Route analysis using {algorithm} algorithm
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Route Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-muted/20 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        <Badge
                          variant={metric.trend === "up" ? "default" : "secondary"}
                          className={`text-xs ${
                            metric.trend === "up"
                              ? "bg-supply-success/20 text-supply-success"
                              : "bg-supply-info/20 text-supply-info"
                          }`}
                        >
                          {metric.change}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-foreground mb-1">
                        {metric.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Route Path */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Route className="w-4 h-4 text-supply-secondary" />
                Optimal Route Path
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {results.path.map((nodeId, index) => (
                  <div key={nodeId} className="flex items-center gap-2">
                    <Badge
                      variant={index === 0 ? "default" : index === results.path.length - 1 ? "destructive" : "outline"}
                      className={`${
                        index === 0
                          ? "bg-supply-success text-white"
                          : index === results.path.length - 1
                          ? "bg-supply-error text-white"
                          : "bg-supply-info/20 text-supply-info"
                      }`}
                    >
                      {nodeId.split("_")[1]?.charAt(0).toUpperCase() + nodeId.split("_")[1]?.slice(1) || nodeId}
                    </Badge>
                    {index < results.path.length - 1 && (
                      <div className="text-muted-foreground">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative Routes */}
            {results.alternativeRoutes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">
                  Alternative Routes
                </h4>
                <div className="space-y-2">
                  {results.alternativeRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/20 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Alternative {index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {route.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Cost: </span>
                          <span className="text-foreground font-medium">
                            ${route.cost.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time: </span>
                          <span className="text-foreground font-medium">
                            {route.time} days
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                Route Breakdown
              </h4>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b border-border pb-2">
                  <div>Segment</div>
                  <div>Cost & Time</div>
                  <div>Transport Mode</div>
                </div>
                
                {results.path.slice(0, -1).map((nodeId, index) => {
                  const nextNodeId = results.path[index + 1];
                  return (
                    <div key={`${nodeId}-${nextNodeId}`} className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">
                          {nodeId.split("_")[1]} → {nextNodeId.split("_")[1]}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        $500 • 3 days
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          Sea
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-supply-info/10 border border-supply-info/20 rounded-lg">
              <h5 className="text-sm font-medium text-supply-info mb-2">
                Optimization Summary
              </h5>
              <p className="text-xs text-muted-foreground">
                This route was optimized using the {algorithm} algorithm, 
                achieving a {results.efficiency}% efficiency rating with 
                minimal risk exposure. The total distance covered is{" "}
                {results.totalDistance.toLocaleString()} km.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-supply-secondary" />
                Recent Calculations
              </h4>
              
              {routeHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No calculation history available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {routeHistory.map((calculation) => (
                    <div
                      key={calculation.id}
                      className="p-3 bg-muted/20 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {calculation.sourceNode.split("_")[1]} → {calculation.targetNode.split("_")[1]}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {calculation.algorithm}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Cost: </span>
                          <span className="text-foreground">
                            ${calculation.result.totalCost.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time: </span>
                          <span className="text-foreground">
                            {calculation.result.totalTime}d
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Efficiency: </span>
                          <span className="text-foreground">
                            {calculation.result.efficiency}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {calculation.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}