#!/usr/bin/env python3

"""
Simple test script to verify the backend is working correctly
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from main import app
    from services.graph_service import GraphService
    from services.ml_service import MLService
    
    print("✅ All imports successful!")
    print("✅ Backend modules are working correctly!")
    
    # Test basic service initialization
    graph_service = GraphService()
    ml_service = MLService()
    
    print("✅ Services can be instantiated!")
    print("🎉 Backend verification complete!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)