"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Activity } from "lucide-react";

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

export function AlertsPanel() {
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
          
          <Button asChild variant="outline" className="w-full mt-4">
            <Link href="/disruptions">
              View All Alerts
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}