from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any
import asyncio
import json
from datetime import datetime, timedelta
import random

router = APIRouter()

class DisruptionService:
    """Service for managing supply chain disruptions"""
    
    def __init__(self):
        self.active_disruptions = []
        self.disruption_history = []
    
    async def get_active_disruptions(self) -> List[Dict[str, Any]]:
        """Get currently active disruptions"""
        # Sample active disruptions
        active = [
            {
                "id": "d_001",
                "title": "Suez Canal Blockage",
                "description": "Container ship blocking major shipping route",
                "type": "infrastructure",
                "severity": "critical",
                "start_time": (datetime.now() - timedelta(hours=6)).isoformat(),
                "affected_routes": ["asia_europe", "asia_americas"],
                "estimated_delay": "3-5 days",
                "financial_impact": "$2.5M per day",
                "status": "active"
            },
            {
                "id": "d_002", 
                "title": "Port Strike - Los Angeles",
                "description": "Dock workers strike affecting port operations",
                "type": "labor_dispute",
                "severity": "high",
                "start_time": (datetime.now() - timedelta(hours=12)).isoformat(),
                "affected_routes": ["asia_us_west"],
                "estimated_delay": "5-7 days",
                "financial_impact": "$1.8M per day",
                "status": "active"
            },
            {
                "id": "d_003",
                "title": "Typhoon Warning - Pacific",
                "description": "Severe weather affecting shipping lanes",
                "type": "weather",
                "severity": "medium", 
                "start_time": datetime.now().isoformat(),
                "affected_routes": ["trans_pacific"],
                "estimated_delay": "2-3 days",
                "financial_impact": "$800K per day",
                "status": "monitoring"
            }
        ]
        
        return active
    
    async def create_disruption(self, disruption_data: Dict) -> Dict[str, Any]:
        """Create a new disruption event"""
        try:
            new_disruption = {
                "id": f"d_{len(self.active_disruptions) + 1:03d}",
                "created_at": datetime.now().isoformat(),
                "status": "active",
                **disruption_data
            }
            
            self.active_disruptions.append(new_disruption)
            
            return {
                "success": True,
                "disruption": new_disruption,
                "message": "Disruption created successfully"
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create disruption: {str(e)}")
    
    async def update_disruption(self, disruption_id: str, update_data: Dict) -> Dict[str, Any]:
        """Update an existing disruption"""
        try:
            # Find and update disruption
            for disruption in self.active_disruptions:
                if disruption["id"] == disruption_id:
                    disruption.update(update_data)
                    disruption["updated_at"] = datetime.now().isoformat()
                    
                    return {
                        "success": True,
                        "disruption": disruption,
                        "message": "Disruption updated successfully"
                    }
            
            raise HTTPException(status_code=404, detail="Disruption not found")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to update disruption: {str(e)}")
    
    async def resolve_disruption(self, disruption_id: str) -> Dict[str, Any]:
        """Mark a disruption as resolved"""
        try:
            for disruption in self.active_disruptions:
                if disruption["id"] == disruption_id:
                    disruption["status"] = "resolved"
                    disruption["resolved_at"] = datetime.now().isoformat()
                    
                    # Move to history
                    self.disruption_history.append(disruption)
                    self.active_disruptions.remove(disruption)
                    
                    return {
                        "success": True,
                        "message": "Disruption resolved successfully"
                    }
            
            raise HTTPException(status_code=404, detail="Disruption not found")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to resolve disruption: {str(e)}")
    
    async def get_disruption_analytics(self) -> Dict[str, Any]:
        """Get analytics on disruptions"""
        active = await self.get_active_disruptions()
        
        analytics = {
            "summary": {
                "total_active": len(active),
                "critical": len([d for d in active if d["severity"] == "critical"]),
                "high": len([d for d in active if d["severity"] == "high"]),
                "medium": len([d for d in active if d["severity"] == "medium"]),
                "low": len([d for d in active if d["severity"] == "low"])
            },
            "by_type": {},
            "financial_impact": {
                "daily_impact": sum([
                    float(d.get("financial_impact", "$0").replace("$", "").replace("M", "000000").replace("K", "000").split()[0])
                    for d in active
                ]),
                "currency": "USD"
            },
            "trends": {
                "last_24h": random.randint(2, 5),
                "last_7d": random.randint(8, 15),
                "last_30d": random.randint(25, 45)
            }
        }
        
        # Count by type
        for disruption in active:
            d_type = disruption.get("type", "unknown")
            analytics["by_type"][d_type] = analytics["by_type"].get(d_type, 0) + 1
        
        return analytics

@router.get("/active")
async def get_active_disruptions():
    """Get all active disruptions"""
    service = DisruptionService()
    disruptions = await service.get_active_disruptions()
    return {"disruptions": disruptions, "count": len(disruptions)}

@router.post("/")
async def create_disruption(disruption_data: dict):
    """Create a new disruption"""
    service = DisruptionService()
    result = await service.create_disruption(disruption_data)
    return result

@router.put("/{disruption_id}")
async def update_disruption(disruption_id: str, update_data: dict):
    """Update a disruption"""
    service = DisruptionService()
    result = await service.update_disruption(disruption_id, update_data)
    return result

@router.post("/{disruption_id}/resolve")
async def resolve_disruption(disruption_id: str):
    """Resolve a disruption"""
    service = DisruptionService()
    result = await service.resolve_disruption(disruption_id)
    return result

@router.get("/analytics")
async def get_disruption_analytics():
    """Get disruption analytics"""
    service = DisruptionService()
    analytics = await service.get_disruption_analytics()
    return analytics