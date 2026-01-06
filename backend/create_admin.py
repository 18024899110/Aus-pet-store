#!/usr/bin/env python3
"""手动创建管理员账户"""

import logging
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.order import Order, OrderItem  # 导入所有模型避免关系错误
from app.models.product import Product, Category
from app.utils.security import get_password_hash, verify_password
from app.core.config import settings

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_admin():
    """创建或更新管理员账户"""
    db = SessionLocal()
    try:
        # 检查管理员账户是否存在
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()

        if admin_user:
            logger.info(f"管理员账户已存在: {settings.ADMIN_EMAIL}")
            # 更新密码
            admin_user.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
            admin_user.is_admin = True
            admin_user.is_active = True
            db.commit()
            logger.info(f"✓ 已更新管理员密码")
        else:
            # 创建新管理员
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name="Administrator",
                is_admin=True,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            logger.info(f"✓ 已创建管理员账户: {settings.ADMIN_EMAIL}")

        # 验证账户
        db.refresh(admin_user)
        logger.info(f"管理员信息:")
        logger.info(f"  - ID: {admin_user.id}")
        logger.info(f"  - Email: {admin_user.email}")
        logger.info(f"  - Full Name: {admin_user.full_name}")
        logger.info(f"  - Is Admin: {admin_user.is_admin}")
        logger.info(f"  - Is Active: {admin_user.is_active}")

    except Exception as e:
        logger.error(f"✗ 创建管理员失败: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    logger.info(f"使用配置:")
    logger.info(f"  - ADMIN_EMAIL: {settings.ADMIN_EMAIL}")
    logger.info(f"  - ADMIN_PASSWORD: {'*' * len(settings.ADMIN_PASSWORD)}")
    create_admin()
