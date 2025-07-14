# SupplyFlow AI 🚀

**Intelligent Supply Chain Management Platform**

SupplyFlow AI is a comprehensive, AI-powered supply chain optimization and analytics platform that helps businesses manage their supply chains more efficiently through real-time monitoring, predictive analytics, and intelligent automation.

## 🌟 Features

### 🤖 AI-Powered Analytics
- **Disruption Prediction**: ML models predict potential supply chain disruptions before they occur
- **Demand Forecasting**: Advanced time-series analysis for accurate demand predictions
- **Route Optimization**: AI-driven route planning for cost and time efficiency
- **Risk Assessment**: Real-time risk scoring and mitigation recommendations

### 📊 Real-Time Dashboard
- **Live Metrics**: Monitor key performance indicators in real-time
- **Interactive Visualizations**: Dynamic charts and network visualizations
- **Alert System**: Instant notifications for critical events
- **Multi-view Interface**: Overview, disruptions, routes, and AI copilot tabs

### 💬 AI Copilot
- **Natural Language Queries**: Ask questions about your supply chain in plain English
- **Intelligent Recommendations**: Get actionable insights and suggestions
- **Context-Aware Responses**: AI understands your specific supply chain context
- **Real-time Chat**: Instant responses powered by Groq's fast LLM inference

### 🔗 Comprehensive Backend
- **Graph Analytics**: Network topology analysis and optimization
- **Machine Learning Pipeline**: Automated model training and inference
- **RESTful APIs**: Well-documented endpoints for all functionality
- **Real-time Streaming**: WebSocket and SSE support for live updates

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **UI Components**: Radix UI with Tailwind CSS
- **Animations**: Framer Motion for smooth interactions
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query for server state

### Backend (Python FastAPI)
- **API Framework**: FastAPI with async support
- **Machine Learning**: scikit-learn, NetworkX for graph analysis
- **AI Integration**: Groq for fast LLM inference
- **Database**: SQLite with Drizzle ORM
- **Vector Database**: Qdrant for embeddings

### AI & ML Stack
- **LLM Provider**: Groq (Llama models)
- **ML Libraries**: NumPy, Pandas, scikit-learn
- **Graph Analysis**: NetworkX for supply chain networks
- **Vector Search**: Qdrant for semantic search

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.13+
- Git

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd supplyflow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd supplyflow-backend
   ```

2. **Install Python dependencies**
   ```bash
   # Using uv (recommended)
   uv sync
   
   # Or using pip
   pip install -r requirements.txt
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Add your environment variables:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   QDRANT_URL=your_qdrant_url
   DATABASE_URL=sqlite:///./supply_chain.db
   ```

4. **Run the backend**
   ```bash
   # Using uv
   uv run python main.py
   
   # Or using python directly
   python main.py
   ```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📖 Usage Guide

### Dashboard Overview
The main dashboard provides a comprehensive view of your supply chain:

1. **Overview Tab**: Key metrics, performance trends, and network status
2. **Disruptions Tab**: Active and predicted disruptions with severity levels
3. **Routes Tab**: Route optimization and efficiency monitoring
4. **AI Copilot Tab**: Interactive AI assistant for supply chain queries

### AI Copilot Commands
Try these example queries with the AI Copilot:

- "What are the current supply chain risks?"
- "Show me demand forecasting for Q1 2024"
- "Optimize routes from Asia to North America"
- "Analyze inventory turnover rates"
- "Check stock levels for critical items"

### API Endpoints

#### Graph Analytics
- `GET /graph/nodes` - Get all supply chain nodes
- `GET /graph/edges` - Get all routes
- `POST /graph/analyze` - Analyze network topology
- `POST /graph/optimize` - Find optimal routes

#### Machine Learning
- `POST /ml/predict` - Predict disruptions
- `POST /ml/recommendations` - Get AI recommendations
- `GET /ml/models/status` - Check model status

#### Disruptions
- `GET /disruptions/active` - Get active disruptions
- `POST /disruptions/` - Create new disruption
- `GET /disruptions/analytics` - Get disruption analytics

## 🛠️ Development

### Project Structure
```
supplyflow-ai/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   └── copilot/        # AI chat components
│   └── lib/                # Utilities and configurations
│       ├── ai/             # AI client configurations
│       └── db/             # Database schema
├── supplyflow-backend/
│   ├── routers/            # FastAPI route handlers
│   ├── services/           # Business logic services
│   └── main.py            # FastAPI application entry point
└── public/                 # Static assets
```

### Key Technologies

#### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library
- **TanStack Query**: Data fetching and caching
- **Zustand**: State management

#### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and settings
- **SQLite + Drizzle**: Database and ORM
- **NetworkX**: Graph analysis library
- **scikit-learn**: Machine learning toolkit
- **Groq**: Fast LLM inference

### Environment Variables

#### Frontend (.env.local)
```env
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key
QDRANT_URL=your_qdrant_instance_url
DATABASE_URL=sqlite:///./supply_chain.db
```

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```

### Backend Tests
```bash
cd supplyflow-backend
uv run pytest
```

## 📦 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Create a new service on Railway or Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the `supplyflow-backend` directory

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for ultra-fast LLM inference
- **Vercel** for Next.js framework and hosting
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **FastAPI** for modern Python web framework

## 📞 Support

For support, email support@supplyflow.ai or join our Discord community.

## 🗺️ Roadmap

- [ ] **Advanced Analytics**: More sophisticated ML models
- [ ] **Mobile App**: React Native mobile application
- [ ] **Multi-tenant**: Support for multiple organizations
- [ ] **Advanced Visualizations**: 3D network graphs and maps
- [ ] **Integration APIs**: Connect with existing ERP systems
- [ ] **Blockchain Tracking**: Supply chain transparency features

---

**Built with ❤️ by the SupplyFlow AI Team**