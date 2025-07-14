from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any
import asyncio
import json
from datetime import datetime

router = APIRouter()

class GraphService:
    """Service for managing supply chain graph operations"""
    
    def __init__(self):
        self.nodes = {}
        self.edges = {}
        self.network_cache = {}
    
    async def load_sample_data(self):
        """Load sample supply chain data"""
        # Sample nodes (suppliers, warehouses, stores)
        sample_nodes = [
            {
                "id": "supplier_1",
                "name": "Asia Electronics Supplier",
                "type": "supplier",
                "location": {"lat": 35.6762, "lng": 139.6503, "city": "Tokyo"},
                "capacity": 10000,
                "risk_level": "medium"
            },
            {
                "id": "warehouse_1", 
                "name": "West Coast Distribution Center",
                "type": "warehouse",
                "location": {"lat": 34.0522, "lng": -118.2437, "city": "Los Angeles"},
                "capacity": 50000,
                "risk_level": "low"
            },
            {
                "id": "store_1",
                "name": "NYC Retail Store",
                "type": "store", 
                "location": {"lat": 40.7128, "lng": -74.0060, "city": "New York"},
                "capacity": 5000,
                "risk_level": "low"
            }
        ]
        
        # Sample edges (routes)
        sample_edges = [
            {
                "id": "route_1",
                "source_id": "supplier_1",
                "target_id": "warehouse_1",
                "route_type": "sea",
                "distance": 8500,
                "cost": 2500,
                "duration": 168,  # 7 days
                "risk_score": 0.3
            },
            {
                "id": "route_2", 
                "source_id": "warehouse_1",
                "target_id": "store_1",
                "route_type": "road",
                "distance": 2800,
                "cost": 800,
                "duration": 72,  # 3 days
                "risk_score": 0.1
            }
        ]
        
        for node in sample_nodes:
            self.nodes[node["id"]] = node
            
        for edge in sample_edges:
            self.edges[edge["id"]] = edge
    
    async def analyze_network(self, data: Dict) -> Dict[str, Any]:
        """Analyze supply chain network topology"""
        try:
            analysis = {
                "total_nodes": len(self.nodes),
                "total_routes": len(self.edges),
                "network_health": "good",
                "bottlenecks": [],
                "recommendations": [
                    "Consider adding redundant routes for critical paths",
                    "Monitor high-risk nodes more frequently"
                ],
                "risk_assessment": {
                    "overall_risk": "medium",
                    "critical_paths": ["supplier_1 -> warehouse_1"],
                    "vulnerable_nodes": []
                }
            }
            
            # Calculate network metrics
            high_risk_nodes = [node for node in self.nodes.values() if node.get("risk_level") == "high"]
            if high_risk_nodes:
                analysis["risk_assessment"]["vulnerable_nodes"] = [node["id"] for node in high_risk_nodes]
            
            return analysis
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Network analysis failed: {str(e)}")
    
    async def find_optimal_routes(self, data: Dict) -> Dict[str, Any]:
        """Find optimal routes in the supply chain network"""
        try:
            # Simple route optimization logic
            routes = []
            for edge in self.edges.values():
                route_score = (1 / (edge["cost"] + edge["duration"])) * (1 - edge["risk_score"])
                routes.append({
                    "route_id": edge["id"],
                    "from": edge["source_id"],
                    "to": edge["target_id"],
                    "score": route_score,
                    "cost": edge["cost"],
                    "duration": edge["duration"],
                    "risk": edge["risk_score"]
                })
            
            # Sort by score (higher is better)
            routes.sort(key=lambda x: x["score"], reverse=True)
            
            return {
                "optimal_routes": routes[:5],  # Top 5 routes
                "total_routes_analyzed": len(routes),
                "optimization_criteria": ["cost", "time", "risk"],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Route optimization failed: {str(e)}")
    
    async def optimize_routes(self, data: Dict) -> Dict[str, Any]:
        """Real-time route optimization for WebSocket"""
        return await self.find_optimal_routes(data)

@router.get("/nodes")
async def get_nodes():
    """Get all supply chain nodes"""
    service = GraphService()
    await service.load_sample_data()
    return {"nodes": list(service.nodes.values())}

@router.get("/edges") 
async def get_edges():
    """Get all supply chain routes"""
    service = GraphService()
    await service.load_sample_data()
    return {"edges": list(service.edges.values())}

@router.post("/analyze")
async def analyze_network(data: dict):
    """Analyze supply chain network"""
    service = GraphService()
    await service.load_sample_data()
    result = await service.analyze_network(data)
    return result

@router.post("/optimize")
async def optimize_routes(data: dict):
    """Find optimal routes"""
    service = GraphService()
    await service.load_sample_data()
    result = await service.find_optimal_routes(data)
    return result