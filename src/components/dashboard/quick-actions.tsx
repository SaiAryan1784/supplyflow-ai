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
import {
  Brain,
  BarChart3,
  Network,
  Plus,
  ArrowRight,
} from "lucide-react";

const quickActions = [
  {
    title: "Create Order",
    description: "Start a new supply chain order",
    icon: Plus,
    color: "bg-supply-primary/20 text-supply-primary",
    href: "/dashboard", // Temporary redirect to dashboard until orders page is created
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
    href: "/routing",
  },
  {
    title: "View Forecasting",
    description: "View demand forecasting and predictions",
    icon: BarChart3,
    color: "bg-supply-secondary/20 text-supply-secondary",
    href: "/forecasting",
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
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
              <Link key={index} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-all cursor-pointer"
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
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}