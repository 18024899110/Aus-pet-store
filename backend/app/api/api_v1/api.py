from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, products, categories, cart, orders

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(users.router, prefix="/users", tags=["用户"])
api_router.include_router(products.router, prefix="/products", tags=["商品"])
api_router.include_router(categories.router, prefix="/categories", tags=["分类"])
api_router.include_router(cart.router, prefix="/cart", tags=["购物车"])
api_router.include_router(orders.router, prefix="/orders", tags=["订单"]) 