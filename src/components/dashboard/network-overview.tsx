"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe } from "lucide-react";

export function NetworkOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
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
  );
}