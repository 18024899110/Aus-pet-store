#!/usr/bin/env python3
"""测试登录功能"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.product import Product, Category
from app.utils.security import verify_password
from app.core.config import settings

db = SessionLocal()

# 查找用户
print(f"正在查找用户: {settings.ADMIN_EMAIL}")
user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()

if not user:
    print("User not found!")
else:
    print("User found:")
    print(f"  Email: {user.email}")
    print(f"  Full Name: {user.full_name}")
    print(f"  Is Admin: {user.is_admin}")
    print(f"  Is Active: {user.is_active}")
    print(f"  Hashed Password: {user.hashed_password[:50]}...")

    # Test password
    print(f"\nTesting password: {settings.ADMIN_PASSWORD}")
    is_valid = verify_password(settings.ADMIN_PASSWORD, user.hashed_password)

    if is_valid:
        print("Password verification SUCCESS!")
    else:
        print("Password verification FAILED!")

db.close()
