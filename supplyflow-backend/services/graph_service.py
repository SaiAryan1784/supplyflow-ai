from typing import Dict, List, Any
import networkx as nx
import json
from datetime import datetime

class GraphService:
    """Service for managing supply chain graph operations"""
    
    def __init__(self):
        self.graph = nx.DiGraph()
        self.nodes_data = {}
        self.edges_data = {}
    
    async def load_sample_data(self):
        """Load sample supply chain network data"""
        # Sample nodes
        nodes = [
            {
                "id": "supplier_asia_1",
                "name": "Shanghai Electronics Co.",
                "type": "supplier",
                "location": {"lat": 31.2304, "lng": 121.4737, "city": "Shanghai"},
                "capacity": 15000,
                "current_stock": 12000,
                "risk_level": "medium"
            },
            {
                "id": "supplier_asia_2",
                "name": "Seoul Components Ltd.",
                "type": "supplier", 
                "location": {"lat": 37.5665, "lng": 126.9780, "city": "Seoul"},
                "capacity": 8000,
                "current_stock": 6500,
                "risk_level": "low"
            },
            {
                "id": "port_asia_1",
                "name": "Port of Shanghai",
                "type": "port",
                "location": {"lat": 31.2304, "lng": 121.4737, "city": "Shanghai"},
                "capacity": 100000,
                "current_load": 75000,
                "risk_level": "medium"
            },
            {
                "id": "warehouse_us_west",
                "name": "LA Distribution Center",
                "type": "warehouse",
                "location": {"lat": 34.0522, "lng": -118.2437, "city": "Los Angeles"},
                "capacity": 50000,
                "current_stock": 35000,
                "risk_level": "low"
            },
            {
                "id": "warehouse_us_east",
                "name": "NYC Distribution Hub",
                "type": "warehouse",
                "location": {"lat": 40.7128, "lng": -74.0060, "city": "New York"},
                "capacity": 40000,
                "current_stock": 28000,
                "risk_level": "low"
            },
            {
                "id": "store_west_1",
                "name": "San Francisco Store",
                "type": "store",
                "location": {"lat": 37.7749, "lng": -122.4194, "city": "San Francisco"},
                "capacity": 2000,
                "current_stock": 1500,
                "risk_level": "low"
            },
            {
                "id": "store_east_1",
                "name": "Boston Store",
                "type": "store",
                "location": {"lat": 42.3601, "lng": -71.0589, "city": "Boston"},
                "capacity": 1800,
                "current_stock": 1200,
                "risk_level": "low"
            }
        ]
        
        # Sample edges (routes)
        edges = [
            {
                "id": "route_supplier_port_1",
                "source_id": "supplier_asia_1",
                "target_id": "port_asia_1",
                "route_type": "road",
                "distance": 50,
                "cost": 100,
                "duration": 4,
                "risk_score": 0.1
            },
            {
                "id": "route_port_warehouse_1",
                "source_id": "port_asia_1", 
                "target_id": "warehouse_us_west",
                "route_type": "sea",
                "distance": 11000,
                "cost": 3500,
                "duration": 240,  # 10 days
                "risk_score": 0.3
            },
            {
                "id": "route_warehouse_store_1",
                "source_id": "warehouse_us_west",
                "target_id": "store_west_1",
                "route_type": "road",
                "distance": 600,
                "cost": 200,
                "duration": 12,
                "risk_score": 0.05
            },
            {
                "id": "route_cross_country",
                "source_id": "warehouse_us_west",
                "target_id": "warehouse_us_east",
                "route_type": "rail",
                "distance": 4500,
                "cost": 1200,
                "duration": 96,  # 4 days
                "risk_score": 0.15
            },
            {
                "id": "route_east_store",
                "source_id": "warehouse_us_east",
                "target_id": "store_east_1",
                "route_type": "road",
                "distance": 300,
                "cost": 150,
                "duration": 8,
                "risk_score": 0.05
            }
        ]
        
        # Store data
        for node in nodes:
            self.nodes_data[node["id"]] = node
            self.graph.add_node(node["id"], **node)
            
        for edge in edges:
            self.edges_data[edge["id"]] = edge
            self.graph.add_edge(
                edge["source_id"], 
                edge["target_id"], 
                **edge
            )
    
    async def analyze_network(self, data: Dict) -> Dict[str, Any]:
        """Analyze supply chain network topology and performance"""
        try:
            # Basic network metrics
            num_nodes = self.graph.number_of_nodes()
            num_edges = self.graph.number_of_edges()
            
            # Calculate centrality measures
            betweenness = nx.betweenness_centrality(self.graph)
            closeness = nx.closeness_centrality(self.graph)
            
            # Identify critical nodes (high betweenness centrality)
            critical_nodes = sorted(betweenness.items(), key=lambda x: x[1], reverse=True)[:3]
            
            # Calculate network resilience
            resilience_score = self._calculate_resilience()
            
            # Identify bottlenecks
            bottlenecks = self._identify_bottlenecks()
            
            analysis = {
                "network_overview": {
                    "total_nodes": num_nodes,
                    "total_edges": num_edges,
                    "network_density": nx.density(self.graph),
                    "is_connected": nx.is_weakly_connected(self.graph)
                },
                "critical_nodes": [
                    {
                        "node_id": node_id,
                        "name": self.nodes_data[node_id]["name"],
                        "centrality_score": score,
                        "type": self.nodes_data[node_id]["type"]
                    }
                    for node_id, score in critical_nodes
                ],
                "resilience": {
                    "score": resilience_score,
                    "level": "high" if resilience_score > 0.7 else "medium" if resilience_score > 0.4 else "low"
                },
                "bottlenecks": bottlenecks,
                "recommendations": self._generate_network_recommendations(resilience_score, bottlenecks),
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            raise Exception(f"Network analysis failed: {str(e)}")
    
    async def find_optimal_routes(self, data: Dict) -> Dict[str, Any]:
        """Find optimal routes between nodes"""
        try:
            source = data.get("source")
            target = data.get("target")
            
            if source and target:
                # Find shortest path by different criteria
                paths = self._find_multiple_paths(source, target)
            else:
                # Find all optimal routes in the network
                paths = self._find_all_optimal_routes()
            
            return {
                "optimal_routes": paths,
                "criteria": ["shortest_distance", "lowest_cost", "fastest_time", "lowest_risk"],
                "total_routes_analyzed": len(paths),
                "optimization_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Route optimization failed: {str(e)}")
    
    def _calculate_resilience(self) -> float:
        """Calculate network resilience score"""
        try:
            # Simple resilience calculation based on connectivity and redundancy
            connectivity = nx.average_node_connectivity(self.graph.to_undirected())
            redundancy = len(list(nx.edge_disjoint_paths(self.graph.to_undirected(), 
                                                        list(self.graph.nodes())[0], 
                                                        list(self.graph.nodes())[-1])))
            
            # Normalize to 0-1 scale
            resilience = min(1.0, (connectivity + redundancy) / 5.0)
            return round(resilience, 2)
        except:
            return 0.5  # Default moderate resilience
    
    def _identify_bottlenecks(self) -> List[Dict[str, Any]]:
        """Identify potential bottlenecks in the network"""
        bottlenecks = []
        
        for node_id, node_data in self.nodes_data.items():
            # Check capacity utilization
            if node_data.get("current_stock") and node_data.get("capacity"):
                utilization = node_data["current_stock"] / node_data["capacity"]
                
                if utilization > 0.9:  # Over 90% capacity
                    bottlenecks.append({
                        "node_id": node_id,
                        "name": node_data["name"],
                        "type": "capacity",
                        "utilization": round(utilization, 2),
                        "severity": "high" if utilization > 0.95 else "medium"
                    })
        
        return bottlenecks
    
    def _generate_network_recommendations(self, resilience: float, bottlenecks: List) -> List[str]:
        """Generate recommendations based on network analysis"""
        recommendations = []
        
        if resilience < 0.5:
            recommendations.append("Consider adding redundant routes to improve network resilience")
            
        if len(bottlenecks) > 0:
            recommendations.append("Address capacity constraints at identified bottleneck nodes")
            
        if len(self.graph.nodes()) < 5:
            recommendations.append("Expand network with additional suppliers or distribution centers")
            
        recommendations.append("Implement real-time monitoring for critical network nodes")
        recommendations.append("Develop contingency plans for high-risk routes")
        
        return recommendations
    
    def _find_multiple_paths(self, source: str, target: str) -> List[Dict[str, Any]]:
        """Find multiple optimal paths between two nodes"""
        paths = []
        
        try:
            # Shortest path by distance
            shortest_path = nx.shortest_path(self.graph, source, target, weight='distance')
            paths.append(self._calculate_path_metrics(shortest_path, "shortest_distance"))
            
            # Lowest cost path
            cost_path = nx.shortest_path(self.graph, source, target, weight='cost')
            paths.append(self._calculate_path_metrics(cost_path, "lowest_cost"))
            
            # Fastest path
            time_path = nx.shortest_path(self.graph, source, target, weight='duration')
            paths.append(self._calculate_path_metrics(time_path, "fastest_time"))
            
        except nx.NetworkXNoPath:
            pass
            
        return paths
    
    def _find_all_optimal_routes(self) -> List[Dict[str, Any]]:
        """Find optimal routes for all node pairs"""
        routes = []
        
        for edge_id, edge_data in self.edges_data.items():
            route_score = self._calculate_route_score(edge_data)
            
            routes.append({
                "route_id": edge_id,
                "source": edge_data["source_id"],
                "target": edge_data["target_id"],
                "score": route_score,
                "metrics": {
                    "distance": edge_data["distance"],
                    "cost": edge_data["cost"],
                    "duration": edge_data["duration"],
                    "risk_score": edge_data["risk_score"]
                },
                "route_type": edge_data["route_type"]
            })
        
        # Sort by score
        routes.sort(key=lambda x: x["score"], reverse=True)
        return routes[:10]  # Top 10 routes
    
    def _calculate_path_metrics(self, path: List[str], optimization_type: str) -> Dict[str, Any]:
        """Calculate metrics for a given path"""
        total_distance = 0
        total_cost = 0
        total_duration = 0
        total_risk = 0
        
        for i in range(len(path) - 1):
            edge_data = self.graph[path[i]][path[i+1]]
            total_distance += edge_data.get("distance", 0)
            total_cost += edge_data.get("cost", 0)
            total_duration += edge_data.get("duration", 0)
            total_risk += edge_data.get("risk_score", 0)
        
        return {
            "path": path,
            "optimization_type": optimization_type,
            "metrics": {
                "total_distance": total_distance,
                "total_cost": total_cost,
                "total_duration": total_duration,
                "average_risk": round(total_risk / max(1, len(path) - 1), 2)
            }
        }
    
    def _calculate_route_score(self, edge_data: Dict) -> float:
        """Calculate a composite score for route optimization"""
        # Normalize metrics (lower is better for cost, duration, risk; higher for efficiency)
        distance_score = 1 / (1 + edge_data["distance"] / 1000)  # Normalize by 1000km
        cost_score = 1 / (1 + edge_data["cost"] / 1000)  # Normalize by $1000
        time_score = 1 / (1 + edge_data["duration"] / 24)  # Normalize by 24 hours
        risk_score = 1 - edge_data["risk_score"]  # Invert risk (lower risk = higher score)
        
        # Weighted average
        composite_score = (distance_score * 0.2 + cost_score * 0.3 + time_score * 0.3 + risk_score * 0.2)
        
        return round(composite_score, 3)
    
    async def optimize_routes(self, data: Dict) -> Dict[str, Any]:
        """Real-time route optimization"""
        return await self.find_optimal_routes(data)