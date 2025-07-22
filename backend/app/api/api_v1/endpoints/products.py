from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.product import Product as ProductSchema, ProductCreate, ProductUpdate, ProductWithCategory
from app.api.deps import get_current_active_user, get_current_active_admin

router = APIRouter()


@router.get("/", response_model=List[ProductWithCategory])
def read_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
) -> Any:
    """
    获取商品列表
    """
    query = db.query(Product)
    
    # 应用筛选条件
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # 只返回激活的商品
    query = query.filter(Product.is_active == True)
    
    # 排序和分页
    products = query.order_by(Product.id).offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductWithCategory)
def read_product(
    product_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    通过ID获取商品详情
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不存在",
        )
    if not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不可用",
        )
    return product


@router.post("/", response_model=ProductSchema)
def create_product(
    *,
    db: Session = Depends(get_db),
    product_in: ProductCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    创建新商品（仅管理员）
    """
    product = Product(**product_in.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductSchema)
def update_product(
    *,
    db: Session = Depends(get_db),
    product_id: int,
    product_in: ProductUpdate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    更新商品（仅管理员）
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不存在",
        )
    
    # 更新商品信息
    update_data = product_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", response_model=ProductSchema)
def delete_product(
    *,
    db: Session = Depends(get_db),
    product_id: int,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    删除商品（仅管理员）
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不存在",
        )
    
    # 软删除（将is_active设为False）
    product.is_active = False
    db.add(product)
    db.commit()
    db.refresh(product)
    return product 