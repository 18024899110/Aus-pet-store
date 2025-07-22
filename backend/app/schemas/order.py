from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

from app.models.order import OrderStatus, PaymentMethod
from app.schemas.product import Product


# 订单项基本模式
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)
    unit_price: float
    total_price: float


# 创建订单项时需要的属性
class OrderItemCreate(OrderItemBase):
    pass


# 数据库中存储的订单项属性
class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int
    created_at: datetime

    class Config:
        orm_mode = True


# 返回给API的订单项属性
class OrderItem(OrderItemInDBBase):
    pass


# 返回给API的订单项属性（包含产品信息）
class OrderItemWithProduct(OrderItem):
    product: Product


# 订单基本模式
class OrderBase(BaseModel):
    status: Optional[OrderStatus] = OrderStatus.PENDING
    payment_method: Optional[PaymentMethod] = None
    shipping_address: Optional[str] = None
    shipping_city: Optional[str] = None
    shipping_state: Optional[str] = None
    shipping_postcode: Optional[str] = None
    shipping_country: Optional[str] = None
    shipping_fee: Optional[float] = 0
    tax: Optional[float] = 0
    notes: Optional[str] = None


# 创建订单时需要的属性
class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    payment_method: PaymentMethod
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_postcode: str
    shipping_country: str = "Australia"


# 更新订单时可以更新的属性
class OrderUpdate(OrderBase):
    pass


# 数据库中存储的订单属性
class OrderInDBBase(OrderBase):
    id: int
    user_id: int
    order_number: str
    total_amount: float
    payment_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


# 返回给API的订单属性
class Order(OrderInDBBase):
    pass


# 返回给API的订单属性（包含订单项信息）
class OrderWithItems(Order):
    items: List[OrderItemWithProduct] 