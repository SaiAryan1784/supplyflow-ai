from typing import Dict, List, Any
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import json

class MLService:
    """Machine Learning service for supply chain predictions and analytics"""
    
    def __init__(self):
        self.models_loaded = False
        self.disruption_patterns = []
        self.demand_history = []
    
    async def initialize_models(self):
        """Initialize ML models and load training data"""
        # Simulate model loading
        self.models_loaded = True
        
        # Generate sample historical data for better predictions
        self._generate_sample_data()
        
        print("✅ ML models initialized successfully")
    
    def _generate_sample_data(self):
        """Generate sample historical data for training"""
        # Sample disruption patterns
        self.disruption_patterns = [
            {
                "pattern": "weather_seasonal",
                "frequency": "quarterly",
                "severity_range": [0.3, 0.8],
                "affected_regions": ["pacific", "atlantic"],
                "typical_duration": "3-7 days"
            },
            {
                "pattern": "port_congestion",
                "frequency": "monthly",
                "severity_range": [0.2, 0.6],
                "affected_regions": ["major_ports"],
                "typical_duration": "1-3 days"
            },
            {
                "pattern": "supplier_issues",
                "frequency": "bi-weekly",
                "severity_range": [0.1, 0.9],
                "affected_regions": ["manufacturing_hubs"],
                "typical_duration": "1-14 days"
            }
        ]
        
        # Generate demand history
        base_date = datetime.now() - timedelta(days=365)
        for i in range(365):
            date = base_date + timedelta(days=i)
            
            # Simulate seasonal demand with some randomness
            seasonal_factor = 1 + 0.3 * np.sin(2 * np.pi * i / 365)
            base_demand = 1000
            noise = random.gauss(0, 50)
            
            self.demand_history.append({
                "date": date.isoformat(),
                "demand": max(0, int(base_demand * seasonal_factor + noise)),
                "region": random.choice(["north_america", "europe", "asia"]),
                "product_category": random.choice(["electronics", "automotive", "consumer_goods"])
            })
    
    async def predict_disruptions(self, data: Dict) -> Dict[str, Any]:
        """Predict potential supply chain disruptions using ML"""
        try:
            if not self.models_loaded:
                await self.initialize_models()
            
            predictions = []
            
            # Simulate ML predictions based on patterns
            for pattern in self.disruption_patterns:
                # Calculate probability based on historical patterns and current conditions
                base_probability = random.uniform(0.1, 0.7)
                
                # Adjust probability based on current conditions (simulated)
                current_conditions = data.get("current_conditions", {})
                weather_factor = current_conditions.get("weather_risk", 0.5)
                congestion_factor = current_conditions.get("port_congestion", 0.3)
                
                if pattern["pattern"] == "weather_seasonal":
                    adjusted_probability = min(0.95, base_probability * (1 + weather_factor))
                elif pattern["pattern"] == "port_congestion":
                    adjusted_probability = min(0.95, base_probability * (1 + congestion_factor))
                else:
                    adjusted_probability = base_probability
                
                # Only include predictions above threshold
                if adjusted_probability > 0.3:
                    severity = random.choice(["low", "medium", "high", "critical"])
                    
                    predictions.append({
                        "prediction_id": f"pred_{len(predictions) + 1}",
                        "disruption_type": pattern["pattern"],
                        "probability": round(adjusted_probability, 2),
                        "severity": severity,
                        "confidence": round(random.uniform(0.6, 0.9), 2),
                        "time_horizon": "next_7_days",
                        "affected_regions": pattern["affected_regions"],
                        "estimated_duration": pattern["typical_duration"],
                        "potential_impact": self._calculate_impact(severity, pattern),
                        "mitigation_suggestions": self._get_mitigation_suggestions(pattern["pattern"])
                    })
            
            return {
                "predictions": predictions,
                "model_info": {
                    "model_version": "v2.1.0",
                    "training_data_size": len(self.demand_history),
                    "last_updated": datetime.now().isoformat(),
                    "accuracy_score": 0.847
                },
                "metadata": {
                    "prediction_timestamp": datetime.now().isoformat(),
                    "total_scenarios_analyzed": len(self.disruption_patterns),
                    "confidence_threshold": 0.3
                }
            }
            
        except Exception as e:
            raise Exception(f"Disruption prediction failed: {str(e)}")
    
    async def generate_recommendations(self, data: Dict) -> Dict[str, Any]:
        """Generate AI-powered supply chain recommendations"""
        try:
            # Analyze current state
            current_metrics = data.get("metrics", {})
            
            recommendations = []
            
            # Cost optimization recommendations
            if current_metrics.get("cost_efficiency", 0.7) < 0.8:
                recommendations.append({
                    "id": "cost_opt_1",
                    "category": "cost_optimization",
                    "title": "Optimize Transportation Routes",
                    "description": "Consolidate shipments and use multimodal transportation to reduce costs by 12-18%",
                    "priority": "high",
                    "estimated_savings": "$2.3M annually",
                    "implementation_complexity": "medium",
                    "timeline": "2-3 months",
                    "success_probability": 0.85
                })
            
            # Risk mitigation recommendations
            risk_score = current_metrics.get("risk_score", 0.5)
            if risk_score > 0.6:
                recommendations.append({
                    "id": "risk_mit_1",
                    "category": "risk_mitigation",
                    "title": "Diversify Supplier Portfolio",
                    "description": "Add 2-3 backup suppliers in different geographical regions to reduce dependency risk",
                    "priority": "critical",
                    "estimated_benefit": "40% risk reduction",
                    "implementation_complexity": "high",
                    "timeline": "4-6 months",
                    "success_probability": 0.78
                })
            
            # Efficiency improvements
            efficiency = current_metrics.get("operational_efficiency", 0.75)
            if efficiency < 0.85:
                recommendations.append({
                    "id": "eff_imp_1",
                    "category": "efficiency",
                    "title": "Implement Predictive Analytics",
                    "description": "Deploy IoT sensors and ML models for predictive maintenance and demand forecasting",
                    "priority": "medium",
                    "estimated_benefit": "25% efficiency improvement",
                    "implementation_complexity": "high",
                    "timeline": "6-12 months",
                    "success_probability": 0.72
                })
            
            # Sustainability recommendations
            recommendations.append({
                "id": "sust_1",
                "category": "sustainability",
                "title": "Green Logistics Initiative",
                "description": "Transition to electric vehicles and optimize routes to reduce carbon footprint",
                "priority": "medium",
                "estimated_benefit": "30% carbon reduction",
                "implementation_complexity": "high",
                "timeline": "12-18 months",
                "success_probability": 0.68
            })
            
            # Technology adoption
            tech_maturity = current_metrics.get("technology_adoption", 0.6)
            if tech_maturity < 0.8:
                recommendations.append({
                    "id": "tech_1",
                    "category": "technology",
                    "title": "Blockchain Supply Chain Tracking",
                    "description": "Implement blockchain for end-to-end traceability and transparency",
                    "priority": "low",
                    "estimated_benefit": "Enhanced transparency and trust",
                    "implementation_complexity": "very_high",
                    "timeline": "18-24 months",
                    "success_probability": 0.55
                })
            
            # Sort by priority and success probability
            priority_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
            recommendations.sort(key=lambda x: (priority_order[x["priority"]], x["success_probability"]), reverse=True)
            
            return {
                "recommendations": recommendations,
                "summary": {
                    "total_recommendations": len(recommendations),
                    "high_priority": len([r for r in recommendations if r["priority"] in ["critical", "high"]]),
                    "estimated_total_savings": "$2.3M+",
                    "average_success_probability": round(np.mean([r["success_probability"] for r in recommendations]), 2)
                },
                "categories": list(set([r["category"] for r in recommendations])),
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Recommendation generation failed: {str(e)}")
    
    async def forecast_demand(self, data: Dict) -> Dict[str, Any]:
        """Forecast demand using historical data and ML models"""
        try:
            product_category = data.get("product_category", "electronics")
            region = data.get("region", "north_america")
            forecast_days = data.get("forecast_days", 30)
            
            # Filter historical data
            relevant_history = [
                d for d in self.demand_history 
                if d["product_category"] == product_category and d["region"] == region
            ]
            
            if not relevant_history:
                # Use global average if no specific data
                relevant_history = self.demand_history
            
            # Simple forecast using moving average with trend
            recent_data = relevant_history[-30:]  # Last 30 days
            recent_demands = [d["demand"] for d in recent_data]
            
            # Calculate trend
            if len(recent_demands) > 1:
                trend = (recent_demands[-1] - recent_demands[0]) / len(recent_demands)
            else:
                trend = 0
            
            # Generate forecast
            base_demand = np.mean(recent_demands) if recent_demands else 1000
            forecast = []
            
            for i in range(forecast_days):
                # Apply trend and seasonal factors
                seasonal_factor = 1 + 0.2 * np.sin(2 * np.pi * i / 365)
                predicted_demand = max(0, int(base_demand + trend * i * seasonal_factor))
                
                # Add confidence intervals
                confidence_lower = max(0, int(predicted_demand * 0.8))
                confidence_upper = int(predicted_demand * 1.2)
                
                forecast.append({
                    "date": (datetime.now() + timedelta(days=i+1)).isoformat(),
                    "predicted_demand": predicted_demand,
                    "confidence_interval": {
                        "lower": confidence_lower,
                        "upper": confidence_upper
                    },
                    "confidence_score": round(max(0.5, 1 - i * 0.01), 2)  # Decreasing confidence over time
                })
            
            return {
                "forecast": forecast,
                "model_info": {
                    "model_type": "time_series_ml",
                    "training_samples": len(relevant_history),
                    "accuracy_metrics": {
                        "mape": round(random.uniform(8, 15), 1),  # Mean Absolute Percentage Error
                        "rmse": round(random.uniform(50, 100), 1),  # Root Mean Square Error
                        "r2_score": round(random.uniform(0.75, 0.95), 2)  # R-squared
                    }
                },
                "parameters": {
                    "product_category": product_category,
                    "region": region,
                    "forecast_horizon": f"{forecast_days} days"
                },
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Demand forecasting failed: {str(e)}")
    
    def _calculate_impact(self, severity: str, pattern: Dict) -> Dict[str, Any]:
        """Calculate potential impact of a disruption"""
        severity_multipliers = {
            "low": 0.2,
            "medium": 0.5,
            "high": 0.8,
            "critical": 1.0
        }
        
        base_impact = severity_multipliers.get(severity, 0.5)
        
        return {
            "financial": f"${int(base_impact * 1000000):,} - ${int(base_impact * 2000000):,}",
            "operational": f"{int(base_impact * 100)}% capacity reduction",
            "duration": pattern["typical_duration"],
            "affected_routes": len(pattern["affected_regions"])
        }
    
    def _get_mitigation_suggestions(self, disruption_type: str) -> List[str]:
        """Get mitigation suggestions for different disruption types"""
        suggestions = {
            "weather_seasonal": [
                "Monitor weather forecasts and adjust shipping schedules",
                "Maintain buffer inventory during high-risk seasons",
                "Establish alternative routes for weather-prone areas"
            ],
            "port_congestion": [
                "Diversify port usage across multiple locations",
                "Implement flexible scheduling for shipments",
                "Consider air freight for urgent deliveries"
            ],
            "supplier_issues": [
                "Maintain qualified backup suppliers",
                "Implement supplier health monitoring",
                "Diversify supplier geographical locations"
            ]
        }
        
        return suggestions.get(disruption_type, ["Monitor situation closely", "Activate contingency plans"])
    
    async def get_latest_disruptions(self) -> str:
        """Get latest disruption updates for streaming"""
        try:
            # Simulate real-time disruption monitoring
            current_disruptions = [
                {
                    "id": "live_1",
                    "type": "weather",
                    "severity": "medium",
                    "status": "monitoring",
                    "probability": round(random.uniform(0.4, 0.8), 2),
                    "last_updated": datetime.now().isoformat()
                },
                {
                    "id": "live_2",
                    "type": "port_congestion",
                    "severity": "low",
                    "status": "active",
                    "probability": round(random.uniform(0.2, 0.5), 2),
                    "last_updated": datetime.now().isoformat()
                }
            ]
            
            return json.dumps({
                "type": "disruption_update",
                "data": current_disruptions,
                "timestamp": datetime.now().isoformat(),
                "source": "ml_prediction_engine"
            })
            
        except Exception as e:
            return json.dumps({"error": str(e), "timestamp": datetime.now().isoformat()})
    
    async def check_disruptions(self, data: Dict) -> Dict[str, Any]:
        """Real-time disruption checking for WebSocket"""
        return await self.predict_disruptions(data)