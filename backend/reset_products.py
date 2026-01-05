#!/usr/bin/env python3
"""重置产品数据库脚本 - 用于更新图片文件名"""

import logging
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.db.session import SessionLocal, engine
from sqlalchemy import text

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def reset_products():
    """删除所有产品和分类，让初始化脚本重新创建"""
    db = SessionLocal()
    try:
        # 使用原生 SQL 删除，避免 SQLAlchemy 关系加载问题
        logger.info("正在删除产品数据...")
        result = db.execute(text("DELETE FROM products"))
        product_count = result.rowcount
        logger.info(f"✓ 删除了 {product_count} 个产品")

        logger.info("正在删除分类数据...")
        result = db.execute(text("DELETE FROM categories"))
        category_count = result.rowcount
        logger.info(f"✓ 删除了 {category_count} 个分类")

        db.commit()
        logger.info("✓ 数据库已重置，请重启应用以重新初始化数据")

    except Exception as e:
        logger.error(f"✗ 重置失败: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    reset_products()
