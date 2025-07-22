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
    logger.info("初始化数据库...")
    init()
    logger.info("数据库初始化完成")
    
    logger.info("启动API服务器...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main() 