#!/bin/bash
set -e

echo "Starting database initialization..."
python backend/init_database.py

echo "Starting API server..."
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
