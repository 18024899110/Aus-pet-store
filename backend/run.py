import logging
from app.db.init_db import init_db
from app.db.session import SessionLocal
import uvicorn

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    db = SessionLocal()
    init_db(db)


def main() -> None:
    logger.info("Initializing database...")
    init()
    logger.info("Database initialization completed")
    
    logger.info("Starting API server...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main() 