from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


# 共享属性
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_admin: bool = False


# 创建用户时需要的属性
class UserCreate(UserBase):
    email: EmailStr
    password: str


# 更新用户时可以更新的属性
class UserUpdate(UserBase):
    password: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postcode: Optional[str] = None
    country: Optional[str] = None


# 数据库中存储的用户属性
class UserInDBBase(UserBase):
    id: int
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postcode: Optional[str] = None
    country: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


# 返回给API的用户属性
class User(UserInDBBase):
    pass


# 数据库中存储的用户属性，包含密码
class UserInDB(UserInDBBase):
    hashed_password: str 