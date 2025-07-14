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
import { DisruptionMap } from "@/components/disruptions/disruption-map";
import { AlertPanel } from "@/components/disruptions/alert-panel";
import { RiskAssessment } from "@/components/disruptions/risk-assessment";
import { DisruptionTimeline } from "@/components/disruptions/disruption-timeline";
import { useDisruptions } from "@/hooks/useDisruptions";
import {
  AlertTriangle,
  Activity,
  Shield,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  Globe,
} from "lucide-react";

export default function DisruptionsPage() {
  const {
    disruptions,
    riskMetrics,
    isMonitoring,
    toggleMonitoring,
    refreshData,
    getDisruptionsByType,
    getActiveAlertsCount,
  } = useDisruptions();

  const [selectedDisruptionType, setSelectedDisruptionType] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("24h");

  const riskSummary = [
    {
      id: "active",
      label: "Active Alerts",
      value: getActiveAlertsCount(),
      icon: AlertTriangle,
      color: "text-supply-error",
      trend: "+3",
    },
    {
      id: "risk",
      label: "Overall Risk",
      value: riskMetrics.overallRisk,
      icon: Shield,
      color: "text-supply-warning",
      trend: "-5%",
    },
    {
      id: "monitoring",
      label: "Sources Monitored",
      value: "47",
      icon: Activity,
      color: "text-supply-info",
      trend: "+2",
    },
    {
      id: "prediction",
      label: "Prediction Accuracy",
      value: "94.2%",
      icon: TrendingUp,
      color: "text-supply-success",
      trend: "+1.2%",
    },
  ];

  const disruptionTypes = [
    { id: "all", label: "All Disruptions", count: disruptions.length },
    { id: "weather", label: "Weather", count: getDisruptionsByType("weather").length },
    { id: "traffic", label: "Traffic", count: getDisruptionsByType("traffic").length },
    { id: "port", label: "Port Issues", count: getDisruptionsByType("port").length },
    { id: "supplier", label: "Supplier", count: getDisruptionsByType("supplier").length },
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
                <AlertTriangle className="w-8 h-8 text-supply-error" />
                Disruption Intelligence
              </h1>
              <p className="text-muted-foreground">
                Real-time monitoring and prediction of supply chain disruptions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge 
                variant={isMonitoring ? "default" : "secondary"} 
                className={`flex items-center gap-2 ${isMonitoring ? "bg-supply-success" : ""}`}
              >
                <Activity className={`w-4 h-4 ${isMonitoring ? "animate-pulse" : ""}`} />
                {isMonitoring ? "Live Monitoring" : "Monitoring Paused"}
              </Badge>
              <Button
                onClick={toggleMonitoring}
                variant={isMonitoring ? "destructive" : "default"}
                size="sm"
              >
                {isMonitoring ? "Pause" : "Start"} Monitoring
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Risk Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {riskSummary.map((metric, index) => (
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

        {/* Disruption Type Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {disruptionTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedDisruptionType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDisruptionType(type.id)}
                className="flex items-center gap-2"
              >
                {type.label}
                <Badge variant="secondary" className="ml-1">
                  {type.count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AlertPanel
              disruptions={selectedDisruptionType === "all" ? disruptions : getDisruptionsByType(selectedDisruptionType)}
              onRefresh={refreshData}
              isMonitoring={isMonitoring}
            />
          </motion.div>

          {/* Disruption Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-supply-info" />
                  Global Disruption Map
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Real-time visualization of supply chain disruptions worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DisruptionMap
                  disruptions={disruptions}
                  selectedType={selectedDisruptionType}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Risk Assessment & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RiskAssessment
              riskMetrics={riskMetrics}
              disruptions={disruptions}
              timeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <DisruptionTimeline
              disruptions={disruptions}
              timeframe={selectedTimeframe}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}