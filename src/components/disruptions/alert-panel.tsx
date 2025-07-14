"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Disruption } from "@/hooks/useDisruptions";
import {
  AlertTriangle,
  Activity,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
} from "lucide-react";

interface AlertPanelProps {
  disruptions: Disruption[];
  onRefresh: () => void;
  isMonitoring: boolean;
}

export function AlertPanel({
  disruptions,
  onRefresh,
  isMonitoring,
}: AlertPanelProps) {
  const [selectedDisruption, setSelectedDisruption] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "critical">("all");

  const filteredDisruptions = disruptions.filter((disruption) => {
    switch (filter) {
      case "active":
        return disruption.status === "active";
      case "critical":
        return disruption.severity === "critical";
      default:
        return true;
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-supply-error/20 text-supply-error border-supply-error/50";
      case "high":
        return "bg-supply-warning/20 text-supply-warning border-supply-warning/50";
      case "medium":
        return "bg-supply-info/20 text-supply-info border-supply-info/50";
      case "low":
        return "bg-supply-success/20 text-supply-success border-supply-success/50";
      default:
        return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="w-4 h-4" />;
      case "monitoring":
        return <Eye className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weather":
        return "🌪️";
      case "traffic":
        return "🚛";
      case "port":
        return "⚓";
      case "supplier":
        return "🏭";
      case "cyber":
        return "🔒";
      case "geopolitical":
        return "🌍";
      default:
        return "⚠️";
    }
  };

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-supply-error" />
              Active Alerts
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Real-time disruption monitoring
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({disruptions.length})
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active ({disruptions.filter(d => d.status === "active").length})
          </Button>
          <Button
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("critical")}
          >
            Critical ({disruptions.filter(d => d.severity === "critical").length})
          </Button>
        </div>

        {/* Monitoring Status */}
        <div className={`p-3 rounded-lg border ${
          isMonitoring 
            ? "bg-supply-success/10 border-supply-success/20" 
            : "bg-supply-warning/10 border-supply-warning/20"
        }`}>
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${
              isMonitoring ? "text-supply-success animate-pulse" : "text-supply-warning"
            }`} />
            <span className={`text-sm font-medium ${
              isMonitoring ? "text-supply-success" : "text-supply-warning"
            }`}>
              {isMonitoring ? "Live Monitoring Active" : "Monitoring Paused"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isMonitoring 
              ? "Scanning 47 data sources for disruptions"
              : "Click to resume real-time monitoring"
            }
          </p>
        </div>

        {/* Disruptions List */}
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-3">
            <AnimatePresence>
              {filteredDisruptions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No disruptions found</p>
                  <p className="text-xs">All systems operating normally</p>
                </motion.div>
              ) : (
                filteredDisruptions.map((disruption, index) => (
                  <motion.div
                    key={disruption.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedDisruption === disruption.id
                        ? "ring-2 ring-supply-primary"
                        : ""
                    } ${getSeverityColor(disruption.severity)}`}
                    onClick={() =>
                      setSelectedDisruption(
                        selectedDisruption === disruption.id ? null : disruption.id
                      )
                    }
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getTypeIcon(disruption.type)}
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">
                            {disruption.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getSeverityColor(disruption.severity)}`}
                            >
                              {disruption.severity.toUpperCase()}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {getStatusIcon(disruption.status)}
                              <span className="capitalize">{disruption.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {Math.round(disruption.probability * 100)}% probability
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(disruption.timeline.detected).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      {disruption.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{disruption.location.region}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {Math.round(
                            (new Date(disruption.timeline.estimated_end).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60)
                          )}h remaining
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>${disruption.impact.cost.toLocaleString()} impact</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedDisruption === disruption.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-border"
                        >
                          <div className="space-y-3">
                            {/* Affected Areas */}
                            <div>
                              <h5 className="text-xs font-medium text-foreground mb-1">
                                Affected Areas
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {disruption.affectedNodes.map((node) => (
                                  <Badge
                                    key={node}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {node.split("_")[1]}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Mitigation Strategies */}
                            <div>
                              <h5 className="text-xs font-medium text-foreground mb-1">
                                Recommended Actions
                              </h5>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {disruption.mitigation_strategies.slice(0, 2).map((strategy, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span>•</span>
                                    <span>{strategy}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                Acknowledge
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                View Details
                              </Button>
                              {disruption.status === "active" && (
                                <Button size="sm" variant="outline" className="text-xs">
                                  Mark Resolved
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}