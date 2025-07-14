"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RouteNode, RoutingAlgorithm } from "@/hooks/useRouting";
import {
  Play,
  Settings,
  MapPin,
  Target,
  Zap,
  Loader2,
} from "lucide-react";

interface RouteControlsProps {
  nodes: RouteNode[];
  selectedAlgorithm: RoutingAlgorithm;
  setSelectedAlgorithm: (algorithm: RoutingAlgorithm) => void;
  sourceNode: string | null;
  setSourceNode: (nodeId: string | null) => void;
  targetNode: string | null;
  setTargetNode: (nodeId: string | null) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

const algorithmInfo = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description: "Shortest path algorithm, optimal for cost minimization",
    complexity: "O(V²)",
    bestFor: "Cost optimization",
  },
  astar: {
    name: "A* Algorithm",
    description: "Heuristic search, faster than Dijkstra with good estimates",
    complexity: "O(V log V)",
    bestFor: "Time optimization",
  },
  "floyd-warshall": {
    name: "Floyd-Warshall",
    description: "All-pairs shortest path, good for multiple destinations",
    complexity: "O(V³)",
    bestFor: "Multiple routes",
  },
  genetic: {
    name: "Genetic Algorithm",
    description: "Evolutionary approach, good for complex constraints",
    complexity: "O(generations)",
    bestFor: "Complex optimization",
  },
  "ai-optimized": {
    name: "AI-Optimized",
    description: "Machine learning enhanced routing with real-time adaptation",
    complexity: "O(V log V)",
    bestFor: "Adaptive optimization",
  },
};

export function RouteControls({
  nodes,
  selectedAlgorithm,
  setSelectedAlgorithm,
  sourceNode,
  setSourceNode,
  targetNode,
  setTargetNode,
  onCalculate,
  isCalculating,
}: RouteControlsProps) {
  const canCalculate = sourceNode && targetNode && sourceNode !== targetNode && !isCalculating;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-supply-secondary" />
          Route Configuration
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure routing parameters and algorithm selection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Algorithm Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Optimization Algorithm
          </label>
          <Select
            value={selectedAlgorithm}
            onValueChange={(value: RoutingAlgorithm) => setSelectedAlgorithm(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(algorithmInfo).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex flex-col">
                    <span className="font-medium">{info.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {info.bestFor}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Algorithm Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {algorithmInfo[selectedAlgorithm].name}
              </span>
              <Badge variant="outline" className="text-xs">
                {algorithmInfo[selectedAlgorithm].complexity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {algorithmInfo[selectedAlgorithm].description}
            </p>
          </div>
        </div>

        {/* Source Node Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-supply-success" />
            Source Node
          </label>
          <Select
            value={sourceNode || ""}
            onValueChange={(value) => setSourceNode(value || null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select source node" />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      node.type === 'supplier' ? 'bg-purple-500' :
                      node.type === 'warehouse' ? 'bg-orange-500' :
                      node.type === 'distribution' ? 'bg-cyan-500' :
                      node.type === 'port' ? 'bg-green-500' :
                      'bg-pink-500'
                    }`} />
                    <span>{node.name}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {node.type}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Node Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-supply-error" />
            Target Node
          </label>
          <Select
            value={targetNode || ""}
            onValueChange={(value) => setTargetNode(value || null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select target node" />
            </SelectTrigger>
            <SelectContent>
              {nodes
                .filter((node) => node.id !== sourceNode)
                .map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        node.type === 'supplier' ? 'bg-purple-500' :
                        node.type === 'warehouse' ? 'bg-orange-500' :
                        node.type === 'distribution' ? 'bg-cyan-500' :
                        node.type === 'port' ? 'bg-green-500' :
                        'bg-pink-500'
                      }`} />
                      <span>{node.name}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {node.type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Optimization Objectives */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Optimization Objectives
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline" className="justify-center py-2">
              Minimize Cost
            </Badge>
            <Badge variant="outline" className="justify-center py-2">
              Minimize Time
            </Badge>
            <Badge variant="outline" className="justify-center py-2">
              Minimize Risk
            </Badge>
            <Badge variant="outline" className="justify-center py-2">
              Maximize Capacity
            </Badge>
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={onCalculate}
          disabled={!canCalculate}
          className="w-full bg-supply-primary hover:bg-supply-primary/90"
          size="lg"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Calculate Optimal Route
            </>
          )}
        </Button>

        {/* Quick Actions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Quick Actions
          </label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSourceNode("supplier_shanghai");
                setTargetNode("customer_newyork");
              }}
              className="text-xs"
            >
              Shanghai → New York
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSourceNode("supplier_mumbai");
                setTargetNode("distribution_london");
              }}
              className="text-xs"
            >
              Mumbai → London
            </Button>
          </div>
        </div>

        {/* Performance Hint */}
        <div className="p-3 bg-supply-info/10 border border-supply-info/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-supply-info" />
            <span className="text-sm font-medium text-supply-info">
              Performance Tip
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            AI-Optimized algorithm adapts to real-time conditions and provides 
            the best balance between cost, time, and risk factors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}