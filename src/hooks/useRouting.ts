import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';

// Types for routing
export interface RouteNode {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'distribution' | 'customer' | 'port';
  location: {
    lat: number;
    lng: number;
  };
  capacity?: number;
  cost?: number;
  currentStock?: number;
}

export interface RouteEdge {
  id: string;
  from: string;
  to: string;
  transportMode: 'road' | 'rail' | 'sea' | 'air';
  distance: number;
  cost: number;
  time: number; // in days
  riskFactor: number; // 0-1
  capacity: number;
}

export interface OptimizationResult {
  path: string[];
  totalCost: number;
  totalTime: number;
  totalDistance: number;
  efficiency: number;
  riskScore: number;
  alternativeRoutes: Array<{
    path: string[];
    cost: number;
    time: number;
    confidence: number;
  }>;
}

export interface RouteCalculation {
  id: string;
  timestamp: Date;
  algorithm: string;
  sourceNode: string;
  targetNode: string;
  result: OptimizationResult;
}

// Algorithm types
export type RoutingAlgorithm = 'dijkstra' | 'astar' | 'floyd-warshall' | 'genetic' | 'ai-optimized';

// Zustand store for routing state
interface RoutingStore {
  nodes: RouteNode[];
  edges: RouteEdge[];
  selectedAlgorithm: RoutingAlgorithm;
  sourceNode: string | null;
  targetNode: string | null;
  optimizationResults: OptimizationResult | null;
  isCalculating: boolean;
  routeHistory: RouteCalculation[];
  
  setSelectedAlgorithm: (algorithm: RoutingAlgorithm) => void;
  setSourceNode: (nodeId: string | null) => void;
  setTargetNode: (nodeId: string | null) => void;
  setOptimizationResults: (results: OptimizationResult | null) => void;
  setIsCalculating: (calculating: boolean) => void;
  addToHistory: (calculation: RouteCalculation) => void;
  loadSampleData: () => void;
}

const useRoutingStore = create<RoutingStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedAlgorithm: 'dijkstra',
  sourceNode: null,
  targetNode: null,
  optimizationResults: null,
  isCalculating: false,
  routeHistory: [],
  
  setSelectedAlgorithm: (algorithm) => set({ selectedAlgorithm: algorithm }),
  setSourceNode: (nodeId) => set({ sourceNode: nodeId }),
  setTargetNode: (nodeId) => set({ targetNode: nodeId }),
  setOptimizationResults: (results) => set({ optimizationResults: results }),
  setIsCalculating: (calculating) => set({ isCalculating: calculating }),
  
  addToHistory: (calculation) => set((state) => ({
    routeHistory: [calculation, ...state.routeHistory].slice(0, 10) // Keep last 10
  })),
  
  loadSampleData: () => {
    const sampleNodes: RouteNode[] = [
      {
        id: 'supplier_shanghai',
        name: 'Shanghai Supplier',
        type: 'supplier',
        location: { lat: 31.2304, lng: 121.4737 },
        capacity: 1000,
        cost: 10
      },
      {
        id: 'supplier_mumbai',
        name: 'Mumbai Supplier',
        type: 'supplier',
        location: { lat: 19.0760, lng: 72.8777 },
        capacity: 800,
        cost: 8
      },
      {
        id: 'warehouse_singapore',
        name: 'Singapore Warehouse',
        type: 'warehouse',
        location: { lat: 1.3521, lng: 103.8198 },
        capacity: 5000,
        currentStock: 2000
      },
      {
        id: 'warehouse_dubai',
        name: 'Dubai Warehouse',
        type: 'warehouse',
        location: { lat: 25.2048, lng: 55.2708 },
        capacity: 3000,
        currentStock: 1500
      },
      {
        id: 'port_rotterdam',
        name: 'Port of Rotterdam',
        type: 'port',
        location: { lat: 51.9244, lng: 4.4777 },
        capacity: 10000
      },
      {
        id: 'distribution_london',
        name: 'London Distribution',
        type: 'distribution',
        location: { lat: 51.5074, lng: -0.1278 },
        capacity: 2000,
        currentStock: 800
      },
      {
        id: 'customer_newyork',
        name: 'New York Customer',
        type: 'customer',
        location: { lat: 40.7128, lng: -74.0060 },
        capacity: 1000
      }
    ];

    const sampleEdges: RouteEdge[] = [
      {
        id: 'edge_1',
        from: 'supplier_shanghai',
        to: 'warehouse_singapore',
        transportMode: 'sea',
        distance: 2400,
        cost: 500,
        time: 3,
        riskFactor: 0.2,
        capacity: 1000
      },
      {
        id: 'edge_2',
        from: 'supplier_mumbai',
        to: 'warehouse_dubai',
        transportMode: 'sea',
        distance: 1200,
        cost: 300,
        time: 2,
        riskFactor: 0.3,
        capacity: 800
      },
      {
        id: 'edge_3',
        from: 'warehouse_singapore',
        to: 'port_rotterdam',
        transportMode: 'sea',
        distance: 16000,
        cost: 2000,
        time: 20,
        riskFactor: 0.4,
        capacity: 5000
      },
      {
        id: 'edge_4',
        from: 'warehouse_dubai',
        to: 'port_rotterdam',
        transportMode: 'sea',
        distance: 6500,
        cost: 1200,
        time: 12,
        riskFactor: 0.3,
        capacity: 3000
      },
      {
        id: 'edge_5',
        from: 'port_rotterdam',
        to: 'distribution_london',
        transportMode: 'road',
        distance: 350,
        cost: 200,
        time: 1,
        riskFactor: 0.1,
        capacity: 2000
      },
      {
        id: 'edge_6',
        from: 'distribution_london',
        to: 'customer_newyork',
        transportMode: 'air',
        distance: 5500,
        cost: 3000,
        time: 1,
        riskFactor: 0.2,
        capacity: 500
      },
      {
        id: 'edge_7',
        from: 'warehouse_singapore',
        to: 'customer_newyork',
        transportMode: 'air',
        distance: 17000,
        cost: 5000,
        time: 2,
        riskFactor: 0.3,
        capacity: 1000
      }
    ];

    set({ nodes: sampleNodes, edges: sampleEdges });
  }
}));

// Graph algorithms implementation
class RoutingAlgorithms {
  // Dijkstra's algorithm for shortest path
  static dijkstra(
    nodes: RouteNode[],
    edges: RouteEdge[],
    sourceId: string,
    targetId: string,
    optimizeFor: 'cost' | 'time' | 'risk' = 'cost'
  ): OptimizationResult | null {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();

    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = node.id === sourceId ? 0 : Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = Array.from(unvisited).reduce((min, node) => 
        distances[node] < distances[min] ? node : min
      );

      if (distances[current] === Infinity) break;
      if (current === targetId) break;

      unvisited.delete(current);

      // Check neighbors
      const neighbors = edges.filter(edge => edge.from === current);
      neighbors.forEach(edge => {
        if (unvisited.has(edge.to)) {
          let weight: number;
          switch (optimizeFor) {
            case 'time':
              weight = edge.time;
              break;
            case 'risk':
              weight = edge.riskFactor * 100;
              break;
            default:
              weight = edge.cost;
          }

          const alt = distances[current] + weight;
          if (alt < distances[edge.to]) {
            distances[edge.to] = alt;
            previous[edge.to] = current;
          }
        }
      });
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | null = targetId;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    if (path[0] !== sourceId) return null;

    // Calculate metrics
    const pathEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      const edge = edges.find(e => e.from === path[i] && e.to === path[i + 1]);
      if (edge) pathEdges.push(edge);
    }

    const totalCost = pathEdges.reduce((sum, edge) => sum + edge.cost, 0);
    const totalTime = pathEdges.reduce((sum, edge) => sum + edge.time, 0);
    const totalDistance = pathEdges.reduce((sum, edge) => sum + edge.distance, 0);
    const avgRisk = pathEdges.reduce((sum, edge) => sum + edge.riskFactor, 0) / pathEdges.length;
    const efficiency = Math.max(0, 100 - (avgRisk * 50) - (totalTime * 2));

    return {
      path,
      totalCost,
      totalTime,
      totalDistance,
      efficiency: Math.round(efficiency),
      riskScore: avgRisk,
      alternativeRoutes: [] // TODO: Implement alternative routes
    };
  }

  // A* algorithm (simplified version)
  static astar(
    nodes: RouteNode[],
    edges: RouteEdge[],
    sourceId: string,
    targetId: string
  ): OptimizationResult | null {
    // For now, use Dijkstra as A* requires heuristic function
    return this.dijkstra(nodes, edges, sourceId, targetId, 'cost');
  }

  // AI-optimized routing (mock implementation)
  static aiOptimized(
    nodes: RouteNode[],
    edges: RouteEdge[],
    sourceId: string,
    targetId: string
  ): OptimizationResult | null {
    // Simulate AI optimization with slight improvements
    const result = this.dijkstra(nodes, edges, sourceId, targetId, 'cost');
    if (result) {
      result.efficiency = Math.min(100, result.efficiency + 5);
      result.totalCost = Math.round(result.totalCost * 0.95); // 5% cost reduction
    }
    return result;
  }
}

// Main hook
export const useRouting = () => {
  const store = useRoutingStore();

  useEffect(() => {
    // Load sample data on mount
    if (store.nodes.length === 0) {
      store.loadSampleData();
    }
  }, [store.loadSampleData, store.nodes.length]);

  const calculateOptimalRoute = useCallback(async () => {
    if (!store.sourceNode || !store.targetNode) return;

    store.setIsCalculating(true);

    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let result: OptimizationResult | null = null;

    switch (store.selectedAlgorithm) {
      case 'dijkstra':
        result = RoutingAlgorithms.dijkstra(store.nodes, store.edges, store.sourceNode, store.targetNode);
        break;
      case 'astar':
        result = RoutingAlgorithms.astar(store.nodes, store.edges, store.sourceNode, store.targetNode);
        break;
      case 'ai-optimized':
        result = RoutingAlgorithms.aiOptimized(store.nodes, store.edges, store.sourceNode, store.targetNode);
        break;
      default:
        result = RoutingAlgorithms.dijkstra(store.nodes, store.edges, store.sourceNode, store.targetNode);
    }

    if (result) {
      store.setOptimizationResults(result);
      
      // Add to history
      const calculation: RouteCalculation = {
        id: `calc_${Date.now()}`,
        timestamp: new Date(),
        algorithm: store.selectedAlgorithm,
        sourceNode: store.sourceNode,
        targetNode: store.targetNode,
        result
      };
      store.addToHistory(calculation);
    }

    store.setIsCalculating(false);
  }, [store]);

  return {
    ...store,
    calculateOptimalRoute
  };
};