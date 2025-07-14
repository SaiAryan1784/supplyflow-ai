from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import asyncio
from contextlib import asynccontextmanager
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers import graph, ml, disruptions
from services.graph_service import GraphService
from services.ml_service import MLService

# Global services
graph_service = None
ml_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup"""
    global graph_service, ml_service

    print("🚀 Starting SupplyFlow AI Backend...")

    # Initialize services
    graph_service = GraphService()
    ml_service = MLService()

    # Load sample data
    await graph_service.load_sample_data()
    await ml_service.initialize_models()

    print("✅ Backend services initialized successfully!")

    yield

    # Cleanup
    print("🔄 Shutting down services...")

# Create FastAPI app with lifespan
app = FastAPI(
    title="SupplyFlow AI Backend",
    description="AI-powered supply chain optimization and analytics API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://supplyflow-ai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(graph.router, prefix="/graph", tags=["graph"])
app.include_router(ml.router, prefix="/ml", tags=["machine-learning"])
app.include_router(disruptions.router, prefix="/disruptions", tags=["disruptions"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "SupplyFlow AI Backend is running!",
        "version": "1.0.0",
        "services": {
            "graph": graph_service is not None,
            "ml": ml_service is not None
        }
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "graph_service": "active" if graph_service else "inactive",
            "ml_service": "active" if ml_service else "inactive"
        },
        "memory_usage": "normal",
        "timestamp": asyncio.get_event_loop().time()
    }

# Supply Chain Analysis Endpoint
@app.post("/analyze")
async def analyze_supply_chain(data: dict):
    """
    Comprehensive supply chain analysis
    """
    try:
        if not graph_service or not ml_service:
            raise HTTPException(status_code=503, detail="Services not initialized")

        # Analyze network topology
        network_analysis = await graph_service.analyze_network(data)

        # Predict disruptions
        disruption_prediction = await ml_service.predict_disruptions(data)

        # Optimize routes
        optimal_routes = await graph_service.find_optimal_routes(data)

        # Generate recommendations
        recommendations = await ml_service.generate_recommendations(data)

        return {
            "network_analysis": network_analysis,
            "disruption_prediction": disruption_prediction,
            "optimal_routes": optimal_routes,
            "recommendations": recommendations,
            "analysis_timestamp": asyncio.get_event_loop().time()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Real-time Updates Stream
@app.get("/stream")
async def stream_updates():
    """
    Server-sent events for real-time updates
    """
    async def generate_updates():
        while True:
            try:
                # Check if ml_service is initialized
                if not ml_service:
                    yield f"data: {{\"error\": \"ML service not initialized\"}}\n\n"
                    await asyncio.sleep(10)
                    continue

                # Get latest disruptions
                disruptions = await ml_service.get_latest_disruptions()

                # Format as SSE
                yield f"data: {disruptions}\n\n"

                # Wait 30 seconds before next update
                await asyncio.sleep(30)

            except Exception as e:
                yield f"data: {{\"error\": \"{str(e)}\"}}\n\n"
                await asyncio.sleep(10)

    return StreamingResponse(
        generate_updates(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

# WebSocket for real-time communication (optional)
@app.websocket("/ws")
async def websocket_endpoint(websocket):
    """WebSocket endpoint for real-time communication"""
    await websocket.accept()

    try:
        if not ml_service or not graph_service:
            await websocket.send_text(json.dumps({"type": "error", "message": "Services not initialized"}))
            await websocket.close()
            return

        while True:
            # Listen for client messages
            data = await websocket.receive_text()

            # Process request
            response = await process_realtime_request(data)

            # Send response
            await websocket.send_text(response)

    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()

async def process_realtime_request(data: str) -> str:
    """Process real-time requests from WebSocket"""
    try:
        request = json.loads(data)

        if request.get("type") == "disruption_check":
            if not ml_service:
                return json.dumps({"type": "error", "message": "ML service not initialized"})
            result = await ml_service.check_disruptions(request.get("data"))
            return json.dumps({"type": "disruption_result", "data": result})

        elif request.get("type") == "route_optimization":
            if not graph_service:
                return json.dumps({"type": "error", "message": "Graph service not initialized"})
            result = await graph_service.optimize_routes(request.get("data"))
            return json.dumps({"type": "route_result", "data": result})

        else:
            return json.dumps({"type": "error", "message": "Unknown request type"})

    except Exception as e:
        return json.dumps({"type": "error", "message": str(e)})

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
