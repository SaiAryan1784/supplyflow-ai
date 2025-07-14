"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Package,
  TrendingUp,
  Truck,
  Users,
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

export function DashboardMetrics() {
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);

  return (
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
  );
}