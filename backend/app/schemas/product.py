from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, validator


# 分类基本模式
class CategoryBase(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = True


# 创建分类时需要的属性
class CategoryCreate(CategoryBase):
    name: str
    slug: str


# 更新分类时可以更新的属性
class CategoryUpdate(CategoryBase):
    pass


# 数据库中存储的分类属性
class CategoryInDBBase(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


# 返回给API的分类属性
class Category(CategoryInDBBase):
    pass


# 产品基本模式
class ProductBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image: Optional[str] = None
    is_active: Optional[bool] = True
    category_id: Optional[int] = None
    brand: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None


# 创建产品时需要的属性
class ProductCreate(ProductBase):
    name: str
    price: float
    category_id: int


# 更新产品时可以更新的属性
class ProductUpdate(ProductBase):
    pass


# 数据库中存储的产品属性
class ProductInDBBase(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


# 返回给API的产品属性（不包含分类信息）
class Product(ProductInDBBase):
    pass


# 返回给API的产品属性（包含分类信息）
class ProductWithCategory(Product):
    category: Category
    image_url: Optional[str] = None

    @validator('image_url', pre=False, always=True)
    def generate_image_url(cls, v, values):
        """生成完整的图片URL"""
        from app.core.config import settings

        image_filename = values.get('image')
        if not image_filename:
            return f"{settings.SERVER_HOST}/static/images/products/placeholder.svg"

        if image_filename.startswith(('http://', 'https://')):
            return image_filename

        return f"{settings.SERVER_HOST}/static/images/products/{image_filename}"


# 购物车项目基本模式
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


# 创建购物车项目时需要的属性
class CartItemCreate(CartItemBase):
    pass


# 更新购物车项目时可以更新的属性
class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


# 数据库中存储的购物车项目属性
class CartItemInDBBase(CartItemBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


# 返回给API的购物车项目属性
class CartItem(CartItemInDBBase):
    pass


# 返回给API的购物车项目属性（包含产品信息）
class CartItemWithProduct(CartItem):
    product: Product 