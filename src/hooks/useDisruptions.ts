import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';

// Types for disruptions
export interface Disruption {
  id: string;
  type: 'weather' | 'traffic' | 'port' | 'supplier' | 'geopolitical' | 'pandemic' | 'cyber';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    region: string;
    country: string;
  };
  affectedNodes: string[];
  affectedRoutes: string[];
  probability: number; // 0-1
  impact: {
    cost: number;
    time: number;
    capacity: number;
  };
  timeline: {
    detected: Date;
    estimated_start: Date;
    estimated_end: Date;
    last_updated: Date;
  };
  status: 'active' | 'resolved' | 'monitoring' | 'predicted';
  confidence: number; // 0-1
  source: string;
  mitigation_strategies: string[];
  alternative_routes?: string[];
}

export interface RiskMetrics {
  overallRisk: string;
  riskScore: number; // 0-100
  riskTrend: 'increasing' | 'decreasing' | 'stable';
  criticalAlerts: number;
  highRiskRoutes: number;
  predictionAccuracy: number;
  responseTime: number; // in minutes
}

export interface AlertNotification {
  id: string;
  disruptionId: string;
  type: 'new' | 'update' | 'resolved' | 'escalated';
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Zustand store for disruptions
interface DisruptionsStore {
  disruptions: Disruption[];
  riskMetrics: RiskMetrics;
  alerts: AlertNotification[];
  isMonitoring: boolean;
  lastUpdate: Date | null;
  
  setDisruptions: (disruptions: Disruption[]) => void;
  addDisruption: (disruption: Disruption) => void;
  updateDisruption: (id: string, updates: Partial<Disruption>) => void;
  removeDisruption: (id: string) => void;
  setRiskMetrics: (metrics: RiskMetrics) => void;
  addAlert: (alert: AlertNotification) => void;
  markAlertAsRead: (alertId: string) => void;
  setIsMonitoring: (monitoring: boolean) => void;
  setLastUpdate: (date: Date) => void;
  loadSampleData: () => void;
}

const useDisruptionsStore = create<DisruptionsStore>((set, get) => ({
  disruptions: [],
  riskMetrics: {
    overallRisk: 'Medium',
    riskScore: 65,
    riskTrend: 'stable',
    criticalAlerts: 0,
    highRiskRoutes: 0,
    predictionAccuracy: 94.2,
    responseTime: 3
  },
  alerts: [],
  isMonitoring: true,
  lastUpdate: null,
  
  setDisruptions: (disruptions) => set({ disruptions }),
  addDisruption: (disruption) => set((state) => ({
    disruptions: [...state.disruptions, disruption]
  })),
  updateDisruption: (id, updates) => set((state) => ({
    disruptions: state.disruptions.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  removeDisruption: (id) => set((state) => ({
    disruptions: state.disruptions.filter(d => d.id !== id)
  })),
  setRiskMetrics: (metrics) => set({ riskMetrics: metrics }),
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts].slice(0, 50) // Keep last 50 alerts
  })),
  markAlertAsRead: (alertId) => set((state) => ({
    alerts: state.alerts.map(a => a.id === alertId ? { ...a, read: true } : a)
  })),
  setIsMonitoring: (monitoring) => set({ isMonitoring: monitoring }),
  setLastUpdate: (date) => set({ lastUpdate: date }),
  
  loadSampleData: () => {
    const sampleDisruptions: Disruption[] = [
      {
        id: 'disruption_1',
        type: 'weather',
        severity: 'high',
        title: 'Typhoon Approaching Shanghai',
        description: 'Category 3 typhoon expected to hit Shanghai port area within 24 hours',
        location: {
          lat: 31.2304,
          lng: 121.4737,
          region: 'East Asia',
          country: 'China'
        },
        affectedNodes: ['supplier_shanghai', 'port_shanghai'],
        affectedRoutes: ['route_shanghai_singapore', 'route_shanghai_rotterdam'],
        probability: 0.89,
        impact: {
          cost: 50000,
          time: 5,
          capacity: 70
        },
        timeline: {
          detected: new Date(Date.now() - 2 * 60 * 60 * 1000),
          estimated_start: new Date(Date.now() + 6 * 60 * 60 * 1000),
          estimated_end: new Date(Date.now() + 48 * 60 * 60 * 1000),
          last_updated: new Date()
        },
        status: 'active',
        confidence: 0.89,
        source: 'Weather API',
        mitigation_strategies: [
          'Reroute through Mumbai supplier',
          'Use air transport for urgent shipments',
          'Increase inventory buffer'
        ],
        alternative_routes: ['route_mumbai_singapore']
      },
      {
        id: 'disruption_2',
        type: 'traffic',
        severity: 'medium',
        title: 'Port Congestion in Rotterdam',
        description: 'Heavy container traffic causing 2-3 day delays at Rotterdam port',
        location: {
          lat: 51.9244,
          lng: 4.4777,
          region: 'Western Europe',
          country: 'Netherlands'
        },
        affectedNodes: ['port_rotterdam'],
        affectedRoutes: ['route_singapore_rotterdam', 'route_dubai_rotterdam'],
        probability: 0.95,
        impact: {
          cost: 15000,
          time: 3,
          capacity: 30
        },
        timeline: {
          detected: new Date(Date.now() - 12 * 60 * 60 * 1000),
          estimated_start: new Date(Date.now() - 6 * 60 * 60 * 1000),
          estimated_end: new Date(Date.now() + 72 * 60 * 60 * 1000),
          last_updated: new Date()
        },
        status: 'active',
        confidence: 0.95,
        source: 'Port Authority',
        mitigation_strategies: [
          'Use alternative ports in Hamburg or Antwerp',
          'Schedule deliveries during off-peak hours',
          'Negotiate priority handling'
        ]
      },
      {
        id: 'disruption_3',
        type: 'supplier',
        severity: 'low',
        title: 'Supplier Maintenance Window',
        description: 'Scheduled maintenance at Mumbai supplier facility',
        location: {
          lat: 19.0760,
          lng: 72.8777,
          region: 'South Asia',
          country: 'India'
        },
        affectedNodes: ['supplier_mumbai'],
        affectedRoutes: ['route_mumbai_dubai'],
        probability: 1.0,
        impact: {
          cost: 5000,
          time: 1,
          capacity: 50
        },
        timeline: {
          detected: new Date(Date.now() - 24 * 60 * 60 * 1000),
          estimated_start: new Date(Date.now() + 24 * 60 * 60 * 1000),
          estimated_end: new Date(Date.now() + 48 * 60 * 60 * 1000),
          last_updated: new Date()
        },
        status: 'monitoring',
        confidence: 1.0,
        source: 'Supplier Notification',
        mitigation_strategies: [
          'Use Shanghai supplier as backup',
          'Adjust production schedule'
        ]
      },
      {
        id: 'disruption_4',
        type: 'cyber',
        severity: 'critical',
        title: 'Ransomware Attack on Logistics Network',
        description: 'Cyber attack affecting multiple logistics providers in Europe',
        location: {
          lat: 52.5200,
          lng: 13.4050,
          region: 'Central Europe',
          country: 'Germany'
        },
        affectedNodes: ['distribution_london', 'port_rotterdam'],
        affectedRoutes: ['route_rotterdam_london'],
        probability: 0.75,
        impact: {
          cost: 200000,
          time: 7,
          capacity: 90
        },
        timeline: {
          detected: new Date(Date.now() - 30 * 60 * 1000),
          estimated_start: new Date(Date.now() - 30 * 60 * 1000),
          estimated_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          last_updated: new Date()
        },
        status: 'active',
        confidence: 0.75,
        source: 'Security Alert',
        mitigation_strategies: [
          'Activate backup systems',
          'Use manual processes',
          'Coordinate with cybersecurity team',
          'Consider alternative logistics providers'
        ]
      }
    ];

    const sampleAlerts: AlertNotification[] = [
      {
        id: 'alert_1',
        disruptionId: 'disruption_4',
        type: 'new',
        message: 'CRITICAL: Ransomware attack detected affecting European logistics',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        priority: 'urgent'
      },
      {
        id: 'alert_2',
        disruptionId: 'disruption_1',
        type: 'update',
        message: 'Typhoon probability increased to 89% - Consider immediate action',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false,
        priority: 'high'
      }
    ];

    set({ 
      disruptions: sampleDisruptions,
      alerts: sampleAlerts,
      lastUpdate: new Date()
    });
  }
}));

// Disruption monitoring service
class DisruptionMonitor {
  private static instance: DisruptionMonitor;
  private intervalId: NodeJS.Timeout | null = null;

  static getInstance(): DisruptionMonitor {
    if (!DisruptionMonitor.instance) {
      DisruptionMonitor.instance = new DisruptionMonitor();
    }
    return DisruptionMonitor.instance;
  }

  startMonitoring(callback: () => void, interval: number = 30000) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(callback, interval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Simulate real-time data updates
  async fetchLatestDisruptions(): Promise<Disruption[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data with random updates
    return [];
  }

  // Risk assessment algorithm
  calculateRiskMetrics(disruptions: Disruption[]): RiskMetrics {
    const activeDisruptions = disruptions.filter(d => d.status === 'active');
    const criticalAlerts = activeDisruptions.filter(d => d.severity === 'critical').length;
    const highRiskRoutes = new Set(activeDisruptions.flatMap(d => d.affectedRoutes)).size;
    
    // Calculate overall risk score
    const riskScore = Math.min(100, activeDisruptions.reduce((score, d) => {
      const severityWeight = { low: 1, medium: 2, high: 3, critical: 5 }[d.severity];
      return score + (severityWeight * d.probability * 10);
    }, 0));

    let overallRisk: string;
    if (riskScore < 30) overallRisk = 'Low';
    else if (riskScore < 60) overallRisk = 'Medium';
    else if (riskScore < 80) overallRisk = 'High';
    else overallRisk = 'Critical';

    return {
      overallRisk,
      riskScore: Math.round(riskScore),
      riskTrend: 'stable', // TODO: Calculate trend
      criticalAlerts,
      highRiskRoutes,
      predictionAccuracy: 94.2,
      responseTime: 3
    };
  }
}

// Main hook
export const useDisruptions = () => {
  const store = useDisruptionsStore();
  const monitor = DisruptionMonitor.getInstance();

  useEffect(() => {
    // Load sample data on mount
    if (store.disruptions.length === 0) {
      store.loadSampleData();
    }
  }, [store.loadSampleData, store.disruptions.length]);

  useEffect(() => {
    // Update risk metrics when disruptions change
    const metrics = monitor.calculateRiskMetrics(store.disruptions);
    store.setRiskMetrics(metrics);
  }, [store.disruptions, monitor, store.setRiskMetrics]);

  useEffect(() => {
    // Start/stop monitoring based on isMonitoring state
    if (store.isMonitoring) {
      monitor.startMonitoring(async () => {
        // Simulate periodic updates
        store.setLastUpdate(new Date());
      });
    } else {
      monitor.stopMonitoring();
    }

    return () => monitor.stopMonitoring();
  }, [store.isMonitoring, monitor, store.setLastUpdate]);

  const toggleMonitoring = useCallback(() => {
    store.setIsMonitoring(!store.isMonitoring);
  }, [store]);

  const refreshData = useCallback(async () => {
    // Simulate data refresh
    store.setLastUpdate(new Date());
  }, [store]);

  const getDisruptionsByType = useCallback((type: string) => {
    return store.disruptions.filter(d => d.type === type);
  }, [store.disruptions]);

  const getActiveAlertsCount = useCallback(() => {
    return store.alerts.filter(a => !a.read && a.priority === 'urgent').length;
  }, [store.alerts]);

  const acknowledgeDisruption = useCallback((disruptionId: string) => {
    store.updateDisruption(disruptionId, { status: 'monitoring' });
  }, [store]);

  const resolveDisruption = useCallback((disruptionId: string) => {
    store.updateDisruption(disruptionId, { 
      status: 'resolved',
      timeline: {
        ...store.disruptions.find(d => d.id === disruptionId)?.timeline!,
        estimated_end: new Date()
      }
    });
  }, [store]);

  return {
    ...store,
    toggleMonitoring,
    refreshData,
    getDisruptionsByType,
    getActiveAlertsCount,
    acknowledgeDisruption,
    resolveDisruption
  };
};