#!/usr/bin/env python3
"""
Test script to verify import resolution
"""

try:
    from fastapi import FastAPI
    print("✅ FastAPI imported successfully")
except ImportError as e:
    print(f"❌ FastAPI import failed: {e}")

try:
    from dotenv import load_dotenv
    print("✅ python-dotenv imported successfully")
except ImportError as e:
    print(f"❌ python-dotenv import failed: {e}")

try:
    import uvicorn
    print("✅ uvicorn imported successfully")
except ImportError as e:
    print(f"❌ uvicorn import failed: {e}")

print("\n🎉 All imports successful! Your environment is configured correctly.")