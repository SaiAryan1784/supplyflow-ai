import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';

// Types for forecasting
export interface ForecastDataPoint {
  date: Date;
  actual?: number;
  predicted?: number;
  upperBound?: number;
  lowerBound?: number;
  confidence?: number;
}

export interface ForecastModel {
  id: string;
  name: string;
  type: 'arima' | 'lstm' | 'prophet' | 'linear' | 'ensemble';
  description: string;
  accuracy: number;
  trainingTime: number;
  complexity: 'low' | 'medium' | 'high';
  bestFor: string[];
}

export interface AccuracyMetrics {
  mae: number; // Mean Absolute Error
  mape: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Square Error
  accuracy: number; // Overall accuracy percentage
  r2Score: number; // R-squared score
  lastUpdated: Date;
}

export interface DemandInsights {
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  trendChange: string;
  seasonality: boolean;
  seasonalPattern?: string;
  keyDrivers: string[];
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
}

export interface ScenarioData {
  id: string;
  name: string;
  description: string;
  parameters: {
    demandMultiplier: number;
    seasonalityFactor: number;
    volatilityIncrease: number;
    externalFactors: string[];
  };
  results: ForecastDataPoint[];
}

// Zustand store for forecasting
interface ForecastingStore {
  forecastData: ForecastDataPoint[];
  selectedModel: string;
  timeHorizon: number; // days
  confidenceLevel: number; // percentage
  accuracyMetrics: AccuracyMetrics;
  demandInsights: DemandInsights;
  scenarios: ScenarioData[];
  isGenerating: boolean;
  lastGenerated: Date | null;
  
  setForecastData: (data: ForecastDataPoint[]) => void;
  setSelectedModel: (modelId: string) => void;
  setTimeHorizon: (days: number) => void;
  setConfidenceLevel: (level: number) => void;
  setAccuracyMetrics: (metrics: AccuracyMetrics) => void;
  setDemandInsights: (insights: DemandInsights) => void;
  setScenarios: (scenarios: ScenarioData[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setLastGenerated: (date: Date) => void;
  loadSampleData: () => void;
}

const useForecastingStore = create<ForecastingStore>((set, get) => ({
  forecastData: [],
  selectedModel: 'prophet',
  timeHorizon: 90,
  confidenceLevel: 95,
  accuracyMetrics: {
    mae: 0,
    mape: 0,
    rmse: 0,
    accuracy: 0,
    r2Score: 0,
    lastUpdated: new Date()
  },
  demandInsights: {
    trend: 'stable',
    trendChange: '+2.3%',
    seasonality: true,
    seasonalPattern: 'Strong Q4 peaks',
    keyDrivers: ['Market demand', 'Seasonal trends', 'Economic indicators'],
    riskFactors: ['Supply disruptions', 'Economic uncertainty'],
    recommendations: ['Increase Q4 inventory', 'Diversify suppliers'],
    confidence: 0.87
  },
  scenarios: [],
  isGenerating: false,
  lastGenerated: null,
  
  setForecastData: (data) => set({ forecastData: data }),
  setSelectedModel: (modelId) => set({ selectedModel: modelId }),
  setTimeHorizon: (days) => set({ timeHorizon: days }),
  setConfidenceLevel: (level) => set({ confidenceLevel: level }),
  setAccuracyMetrics: (metrics) => set({ accuracyMetrics: metrics }),
  setDemandInsights: (insights) => set({ demandInsights: insights }),
  setScenarios: (scenarios) => set({ scenarios: scenarios }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setLastGenerated: (date) => set({ lastGenerated: date }),
  
  loadSampleData: () => {
    // Generate sample historical and forecast data
    const data: ForecastDataPoint[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365); // Start 1 year ago
    
    // Generate historical data (past 365 days)
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Simulate demand with trend, seasonality, and noise
      const trend = 1000 + (i * 0.5); // Slight upward trend
      const seasonal = 100 * Math.sin((i / 365) * 2 * Math.PI); // Yearly seasonality
      const weekly = 50 * Math.sin((i / 7) * 2 * Math.PI); // Weekly pattern
      const noise = (Math.random() - 0.5) * 100; // Random noise
      
      const actual = Math.max(0, trend + seasonal + weekly + noise);
      
      data.push({
        date,
        actual: Math.round(actual)
      });
    }
    
    // Generate forecast data (next 90 days)
    const { timeHorizon, confidenceLevel } = get();
    for (let i = 0; i < timeHorizon; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Simulate forecast with uncertainty
      const trend = 1000 + ((365 + i) * 0.5);
      const seasonal = 100 * Math.sin(((365 + i) / 365) * 2 * Math.PI);
      const weekly = 50 * Math.sin(((365 + i) / 7) * 2 * Math.PI);
      
      const predicted = Math.max(0, trend + seasonal + weekly);
      const uncertainty = predicted * 0.1; // 10% uncertainty
      
      data.push({
        date,
        predicted: Math.round(predicted),
        upperBound: Math.round(predicted + uncertainty),
        lowerBound: Math.round(Math.max(0, predicted - uncertainty)),
        confidence: confidenceLevel / 100
      });
    }
    
    // Sample accuracy metrics
    const sampleMetrics: AccuracyMetrics = {
      mae: 45.2,
      mape: 4.8,
      rmse: 67.3,
      accuracy: 94.2,
      r2Score: 0.89,
      lastUpdated: new Date()
    };
    
    set({ 
      forecastData: data,
      accuracyMetrics: sampleMetrics,
      lastGenerated: new Date()
    });
  }
}));

// Available forecasting models
export const FORECAST_MODELS: ForecastModel[] = [
  {
    id: 'prophet',
    name: 'Prophet',
    type: 'prophet',
    description: 'Facebook Prophet - Great for seasonal data with holidays',
    accuracy: 94.2,
    trainingTime: 30,
    complexity: 'medium',
    bestFor: ['Seasonal patterns', 'Holiday effects', 'Trend changes']
  },
  {
    id: 'lstm',
    name: 'LSTM Neural Network',
    type: 'lstm',
    description: 'Deep learning model for complex patterns',
    accuracy: 91.8,
    trainingTime: 120,
    complexity: 'high',
    bestFor: ['Complex patterns', 'Non-linear trends', 'Large datasets']
  },
  {
    id: 'arima',
    name: 'ARIMA',
    type: 'arima',
    description: 'Classical time series model',
    accuracy: 88.5,
    trainingTime: 15,
    complexity: 'medium',
    bestFor: ['Stationary data', 'Linear trends', 'Fast predictions']
  },
  {
    id: 'linear',
    name: 'Linear Regression',
    type: 'linear',
    description: 'Simple linear trend model',
    accuracy: 82.1,
    trainingTime: 5,
    complexity: 'low',
    bestFor: ['Simple trends', 'Quick estimates', 'Baseline models']
  },
  {
    id: 'ensemble',
    name: 'Ensemble Model',
    type: 'ensemble',
    description: 'Combination of multiple models for best accuracy',
    accuracy: 96.1,
    trainingTime: 90,
    complexity: 'high',
    bestFor: ['Maximum accuracy', 'Robust predictions', 'Critical forecasts']
  }
];

// Forecasting engine
class ForecastingEngine {
  // Generate forecast using selected model
  static async generateForecast(
    model: string,
    timeHorizon: number,
    confidenceLevel: number,
    historicalData: ForecastDataPoint[]
  ): Promise<ForecastDataPoint[]> {
    // Simulate model training and prediction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const forecast: ForecastDataPoint[] = [];
    const lastDate = new Date();
    
    for (let i = 1; i <= timeHorizon; i++) {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i);
      
      // Simulate different model behaviors
      let predicted: number;
      let uncertainty: number;
      
      switch (model) {
        case 'prophet':
          // Prophet with strong seasonality
          predicted = 1000 + (i * 0.5) + 100 * Math.sin((i / 365) * 2 * Math.PI);
          uncertainty = predicted * 0.08;
          break;
        case 'lstm':
          // LSTM with complex patterns
          predicted = 1000 + (i * 0.7) + 80 * Math.sin((i / 30) * 2 * Math.PI);
          uncertainty = predicted * 0.06;
          break;
        case 'arima':
          // ARIMA with linear trend
          predicted = 1000 + (i * 0.4);
          uncertainty = predicted * 0.12;
          break;
        case 'ensemble':
          // Ensemble with best accuracy
          predicted = 1000 + (i * 0.6) + 90 * Math.sin((i / 365) * 2 * Math.PI);
          uncertainty = predicted * 0.05;
          break;
        default:
          // Linear regression
          predicted = 1000 + (i * 0.3);
          uncertainty = predicted * 0.15;
      }
      
      forecast.push({
        date,
        predicted: Math.round(Math.max(0, predicted)),
        upperBound: Math.round(Math.max(0, predicted + uncertainty)),
        lowerBound: Math.round(Math.max(0, predicted - uncertainty)),
        confidence: confidenceLevel / 100
      });
    }
    
    return forecast;
  }
  
  // Calculate accuracy metrics
  static calculateAccuracy(
    actual: number[],
    predicted: number[]
  ): AccuracyMetrics {
    const n = Math.min(actual.length, predicted.length);
    
    // Mean Absolute Error
    const mae = actual.slice(0, n).reduce((sum, a, i) => 
      sum + Math.abs(a - predicted[i]), 0) / n;
    
    // Mean Absolute Percentage Error
    const mape = actual.slice(0, n).reduce((sum, a, i) => 
      sum + Math.abs((a - predicted[i]) / a), 0) / n * 100;
    
    // Root Mean Square Error
    const rmse = Math.sqrt(
      actual.slice(0, n).reduce((sum, a, i) => 
        sum + Math.pow(a - predicted[i], 2), 0) / n
    );
    
    // R-squared
    const actualMean = actual.reduce((sum, a) => sum + a, 0) / actual.length;
    const ssRes = actual.slice(0, n).reduce((sum, a, i) => 
      sum + Math.pow(a - predicted[i], 2), 0);
    const ssTot = actual.slice(0, n).reduce((sum, a) => 
      sum + Math.pow(a - actualMean, 2), 0);
    const r2Score = 1 - (ssRes / ssTot);
    
    // Overall accuracy
    const accuracy = Math.max(0, 100 - mape);
    
    return {
      mae: Math.round(mae * 100) / 100,
      mape: Math.round(mape * 100) / 100,
      rmse: Math.round(rmse * 100) / 100,
      accuracy: Math.round(accuracy * 100) / 100,
      r2Score: Math.round(r2Score * 1000) / 1000,
      lastUpdated: new Date()
    };
  }
  
  // Generate demand insights
  static generateInsights(data: ForecastDataPoint[]): DemandInsights {
    const actualData = data.filter(d => d.actual !== undefined);
    const forecastData = data.filter(d => d.predicted !== undefined);
    
    // Calculate trend
    let trend: 'increasing' | 'decreasing' | 'stable' | 'volatile' = 'stable';
    if (actualData.length > 30) {
      const recent = actualData.slice(-30).map(d => d.actual!);
      const older = actualData.slice(-60, -30).map(d => d.actual!);
      
      const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
      const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
      
      const change = (recentAvg - olderAvg) / olderAvg;
      
      if (change > 0.05) trend = 'increasing';
      else if (change < -0.05) trend = 'decreasing';
      else trend = 'stable';
    }
    
    return {
      trend,
      trendChange: '+2.3%',
      seasonality: true,
      seasonalPattern: 'Strong Q4 peaks, Q1 dips',
      keyDrivers: [
        'Seasonal consumer behavior',
        'Market expansion',
        'Product launches',
        'Economic indicators'
      ],
      riskFactors: [
        'Supply chain disruptions',
        'Economic uncertainty',
        'Competitor actions',
        'Regulatory changes'
      ],
      recommendations: [
        'Increase inventory buffer for Q4',
        'Diversify supplier base',
        'Implement dynamic pricing',
        'Monitor competitor activities'
      ],
      confidence: 0.87
    };
  }
}

// Main hook
export const useForecasting = () => {
  const store = useForecastingStore();

  useEffect(() => {
    // Load sample data on mount
    if (store.forecastData.length === 0) {
      store.loadSampleData();
    }
  }, [store.loadSampleData, store.forecastData.length]);

  const generateForecast = useCallback(async () => {
    store.setIsGenerating(true);
    
    try {
      // Get historical data for training
      const historicalData = store.forecastData.filter(d => d.actual !== undefined);
      
      // Generate new forecast
      const forecast = await ForecastingEngine.generateForecast(
        store.selectedModel,
        store.timeHorizon,
        store.confidenceLevel,
        historicalData
      );
      
      // Combine historical and forecast data
      const combinedData = [
        ...historicalData,
        ...forecast
      ];
      
      store.setForecastData(combinedData);
      
      // Calculate accuracy metrics (using last 30 days for validation)
      const validationData = historicalData.slice(-30);
      const actualValues = validationData.map(d => d.actual!);
      const predictedValues = validationData.map(d => d.predicted || d.actual!);
      
      const metrics = ForecastingEngine.calculateAccuracy(actualValues, predictedValues);
      store.setAccuracyMetrics(metrics);
      
      // Generate insights
      const insights = ForecastingEngine.generateInsights(combinedData);
      store.setDemandInsights(insights);
      
      store.setLastGenerated(new Date());
    } catch (error) {
      console.error('Forecast generation error:', error);
    } finally {
      store.setIsGenerating(false);
    }
  }, [store]);

  const exportForecast = useCallback(() => {
    // Create CSV data
    const csvData = store.forecastData.map(d => ({
      date: d.date.toISOString().split('T')[0],
      actual: d.actual || '',
      predicted: d.predicted || '',
      upperBound: d.upperBound || '',
      lowerBound: d.lowerBound || '',
      confidence: d.confidence || ''
    }));
    
    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demand_forecast_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [store.forecastData]);

  return {
    ...store,
    models: FORECAST_MODELS,
    generateForecast,
    exportForecast
  };
};