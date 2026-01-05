#!/bin/bash
set -e

# 只在设置了 RESET_DB 环境变量时才重置数据库
if [ "$RESET_DB" = "true" ]; then
    echo "Resetting product data (RESET_DB=true)..."
    python backend/reset_products.py
fi

echo "Starting database initialization..."
python backend/init_database.py

echo "Starting API server..."
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
