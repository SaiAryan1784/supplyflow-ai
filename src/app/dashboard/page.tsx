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
import { NavBar } from "@/components/shared/nav-bar";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Globe,
  Network,
  Package,
  TrendingUp,
  Truck,
  Users,
  Zap,
  ArrowRight,
  Plus,
} from "lucide-react";

const metrics = [
  {
    title: "Active Shipments",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Truck,
    color: "text-supply-info",
  },
  {
    title: "Suppliers",
    value: "89",
    change: "+3",
    trend: "up",
    icon: Users,
    color: "text-supply-secondary",
  },
  {
    title: "Inventory Items",
    value: "15,432",
    change: "-2%",
    trend: "down",
    icon: Package,
    color: "text-supply-warning",
  },
  {
    title: "On-Time Delivery",
    value: "94.2%",
    change: "+1.2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-supply-success",
  },
];

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Weather Disruption",
    message: "Severe weather expected in shipping route NYC-LA",
    time: "2 hours ago",
    severity: "medium",
  },
  {
    id: 2,
    type: "error",
    title: "Supplier Delay",
    message: "Acme Corp shipment delayed by 3 days",
    time: "4 hours ago",
    severity: "high",
  },
  {
    id: 3,
    type: "info",
    title: "New Route Available",
    message: "Alternative route discovered for Chicago distribution",
    time: "6 hours ago",
    severity: "low",
  },
];

const quickActions = [
  {
    title: "Create Order",
    description: "Start a new supply chain order",
    icon: Plus,
    color: "bg-supply-primary/20 text-supply-primary",
    href: "/orders/new",
  },
  {
    title: "AI Analysis",
    description: "Get AI insights on your supply chain",
    icon: Brain,
    color: "bg-supply-info/20 text-supply-info",
    href: "/copilot",
  },
  {
    title: "Route Optimization",
    description: "Optimize shipping routes",
    icon: Network,
    color: "bg-supply-success/20 text-supply-success",
    href: "/routes",
  },
  {
    title: "Analytics",
    description: "View detailed analytics",
    icon: BarChart3,
    color: "bg-supply-secondary/20 text-supply-secondary",
    href: "/analytics",
  },
];

export default function DashboardPage() {
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-supply-error bg-supply-error/10";
      case "medium":
        return "border-supply-warning bg-supply-warning/10";
      case "low":
        return "border-supply-info bg-supply-info/10";
      default:
        return "border-border bg-card";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-supply-error" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-supply-warning" />;
      case "info":
        return <Activity className="w-4 h-4 text-supply-info" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

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
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Supply Chain Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage your supply chain operations in real-time
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI-Powered
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
              key={index}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setSelectedMetric(index)}
              onHoverEnd={() => setSelectedMetric(null)}
            >
              <Card className={`bg-card border-border transition-all duration-300 ${
                selectedMetric === index ? "ring-2 ring-supply-primary" : ""
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    <Badge
                      variant={metric.trend === "up" ? "default" : "secondary"}
                      className={metric.trend === "up" ? "text-supply-success" : "text-supply-warning"}
                    >
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.title}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Common tasks and operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {action.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-supply-warning" />
                  Recent Alerts
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Latest supply chain notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-sm">
                          {alert.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {alert.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {alert.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-4">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Network Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-supply-secondary" />
                Supply Network Overview
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Global supply chain network status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-supply-secondary mx-auto mb-4" />
                  <div className="text-foreground font-medium mb-2">
                    Interactive Network Map
                  </div>
                  <div className="text-sm text-muted-foreground">
                    3D visualization coming soon
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}