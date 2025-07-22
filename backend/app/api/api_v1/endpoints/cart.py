from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.product import CartItem, Product
from app.models.user import User
from app.schemas.product import CartItemWithProduct, CartItemCreate, CartItemUpdate
from app.api.deps import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[CartItemWithProduct])
def read_cart_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    获取当前用户的购物车
    """
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return cart_items


@router.post("/", response_model=CartItemWithProduct)
def add_cart_item(
    *,
    db: Session = Depends(get_db),
    item_in: CartItemCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    添加商品到购物车
    """
    # 检查商品是否存在且可用
    product = db.query(Product).filter(
        Product.id == item_in.product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不存在或不可用",
        )
    
    # 检查库存是否足够
    if product.stock < item_in.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="商品库存不足",
        )
    
    # 检查购物车中是否已有该商品
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item_in.product_id
    ).first()
    
    if existing_item:
        # 如果已有该商品，则更新数量
        new_quantity = existing_item.quantity + item_in.quantity
        if new_quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="商品库存不足",
            )
        
        existing_item.quantity = new_quantity
        db.add(existing_item)
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # 如果没有该商品，则添加新项
        cart_item = CartItem(
            user_id=current_user.id,
            product_id=item_in.product_id,
            quantity=item_in.quantity
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item


@router.put("/{cart_item_id}", response_model=CartItemWithProduct)
def update_cart_item(
    *,
    db: Session = Depends(get_db),
    cart_item_id: int,
    item_in: CartItemUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    更新购物车项目数量
    """
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="购物车项目不存在",
        )
    
    # 检查商品是否存在且可用
    product = db.query(Product).filter(
        Product.id == cart_item.product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不存在或不可用",
        )
    
    # 检查库存是否足够
    if product.stock < item_in.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="商品库存不足",
        )
    
    # 更新数量
    cart_item.quantity = item_in.quantity
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


@router.delete("/{cart_item_id}")
def remove_cart_item(
    *,
    db: Session = Depends(get_db),
    cart_item_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    从购物车中移除商品
    """
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="购物车项目不存在",
        )
    
    db.delete(cart_item)
    db.commit()
    return {"message": "商品已从购物车中移除"}


@router.delete("/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    清空购物车
    """
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "购物车已清空"} 