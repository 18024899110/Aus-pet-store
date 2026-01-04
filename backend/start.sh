#!/bin/bash
set -e

echo "Starting database initialization..."
cd /app/backend
python -c "
from app.db.init_db import init_db
from app.db.session import SessionLocal
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info('Initializing database...')
db = SessionLocal()
try:
    init_db(db)
    logger.info('Database initialization completed')
finally:
    db.close()
"

echo "Starting API server..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT
