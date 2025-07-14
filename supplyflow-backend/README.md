# SupplyFlow AI Backend

Python FastAPI backend for the SupplyFlow AI supply chain management platform.

## Features

- **Graph Analytics**: Network topology analysis and route optimization
- **Machine Learning**: Disruption prediction and demand forecasting  
- **Real-time APIs**: WebSocket and SSE support for live updates
- **Comprehensive Analytics**: Supply chain performance metrics

## Quick Start

1. **Install dependencies**
   ```bash
   uv sync
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Run the server**
   ```bash
   uv run python main.py
   ```

4. **Access API docs**
   Visit http://localhost:8000/docs

## API Endpoints

### Graph Analytics
- `GET /graph/nodes` - Get supply chain nodes
- `POST /graph/analyze` - Analyze network topology
- `POST /graph/optimize` - Find optimal routes

### Machine Learning  
- `POST /ml/predict` - Predict disruptions
- `POST /ml/recommendations` - Get AI recommendations

### Disruptions
- `GET /disruptions/active` - Get active disruptions
- `POST /disruptions/` - Create disruption event

## Development

The backend uses FastAPI with async support and includes:

- **Graph Service**: NetworkX-based supply chain network analysis
- **ML Service**: scikit-learn models for predictions
- **Disruption Service**: Event management and analytics
- **Real-time Streaming**: WebSocket and SSE endpoints

## Dependencies

Key Python packages:
- `fastapi` - Web framework
- `networkx` - Graph analysis
- `scikit-learn` - Machine learning
- `numpy` & `pandas` - Data processing
- `groq` - LLM integration