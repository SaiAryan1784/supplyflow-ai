"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
} from "lucide-react";

interface DisruptionTimelineProps {
  disruptions: Disruption[];
  timeframe: string;
}

export function DisruptionTimeline({
  disruptions,
  timeframe,
}: DisruptionTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Sort disruptions by detection time
  const sortedDisruptions = [...disruptions].sort(
    (a, b) => new Date(b.timeline.detected).getTime() - new Date(a.timeline.detected).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="w-4 h-4 text-supply-error" />;
      case "monitoring":
        return <Eye className="w-4 h-4 text-supply-info" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-supply-success" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-supply-error bg-supply-error/10";
      case "high":
        return "border-supply-warning bg-supply-warning/10";
      case "medium":
        return "border-supply-info bg-supply-info/10";
      case "low":
        return "border-supply-success bg-supply-success/10";
      default:
        return "border-border bg-muted/10";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-supply-secondary" />
          Disruption Timeline
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Chronological view of supply chain events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
            
            <div className="space-y-6">
              {sortedDisruptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No events in selected timeframe</p>
                </div>
              ) : (
                sortedDisruptions.map((disruption, index) => (
                  <motion.div
                    key={disruption.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-4"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-card border-2 border-border">
                      {getStatusIcon(disruption.status)}
                    </div>
                    
                    {/* Event content */}
                    <div className="flex-1 pb-6">
                      <div
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedEvent === disruption.id
                            ? "ring-2 ring-supply-primary"
                            : ""
                        } ${getSeverityColor(disruption.severity)}`}
                        onClick={() =>
                          setSelectedEvent(
                            selectedEvent === disruption.id ? null : disruption.id
                          )
                        }
                      >
                        <div className="flex items-start justify-between mb-2">
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
                              <span className="text-xs text-muted-foreground capitalize">
                                {disruption.type}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              {formatTimeAgo(new Date(disruption.timeline.detected))}
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
                            <TrendingUp className="w-3 h-3" />
                            <span>${disruption.impact.cost.toLocaleString()}</span>
                          </div>
                          <div className="text-muted-foreground">
                            {Math.round(disruption.probability * 100)}% probability
                          </div>
                        </div>

                        {/* Expanded details */}
                        {selectedEvent === disruption.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-border"
                          >
                            <div className="space-y-3">
                              {/* Timeline details */}
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Detected: </span>
                                  <span className="text-foreground">
                                    {new Date(disruption.timeline.detected).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Est. Start: </span>
                                  <span className="text-foreground">
                                    {new Date(disruption.timeline.estimated_start).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Est. End: </span>
                                  <span className="text-foreground">
                                    {new Date(disruption.timeline.estimated_end).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Last Updated: </span>
                                  <span className="text-foreground">
                                    {new Date(disruption.timeline.last_updated).toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              {/* Impact details */}
                              <div>
                                <h5 className="text-xs font-medium text-foreground mb-1">
                                  Impact Assessment
                                </h5>
                                <div className="grid grid-cols-3 gap-4 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">Cost: </span>
                                    <span className="text-foreground font-medium">
                                      ${disruption.impact.cost.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Time: </span>
                                    <span className="text-foreground font-medium">
                                      {disruption.impact.time} days
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Capacity: </span>
                                    <span className="text-foreground font-medium">
                                      -{disruption.impact.capacity}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Affected areas */}
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
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}