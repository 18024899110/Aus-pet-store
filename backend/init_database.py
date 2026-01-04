#!/usr/bin/env python3
"""Database initialization script for Railway deployment"""

import logging
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.db.init_db import init_db
from app.db.session import SessionLocal

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Initialize the database"""
    logger.info("Starting database initialization...")
    
    db = SessionLocal()
    try:
        init_db(db)
        logger.info("✓ Database initialization completed successfully")
    except Exception as e:
        logger.error(f"✗ Database initialization failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
