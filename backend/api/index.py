"""
Vercel Serverless Entry Point
"""
import sys
import os

# Add the backend root to path so 'app' package can be found
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

# Vercel looks for 'app' variable - this is it
