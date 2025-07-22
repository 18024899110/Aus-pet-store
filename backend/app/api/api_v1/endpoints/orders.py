import uuid
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product, CartItem
from app.models.user import User
from app.schemas.order import Order as OrderSchema, OrderCreate, OrderWithItems
from app.api.deps import get_current_active_user, get_current_active_admin

router = APIRouter()


@router.get("/", response_model=List[OrderSchema])
def read_orders(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    获取当前用户的订单列表
    """
    if current_user.is_admin:
        # 管理员可以查看所有订单
        orders = db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    else:
        # 普通用户只能查看自己的订单
        orders = db.query(Order).filter(
            Order.user_id == current_user.id
        ).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    return orders


@router.get("/{order_id}", response_model=OrderWithItems)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    通过ID获取订单详情
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在",
        )
    
    # 检查权限（只有管理员或订单所有者可以查看）
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足",
        )
    
    return order


@router.post("/", response_model=OrderWithItems)
def create_order(
    *,
    db: Session = Depends(get_db),
    order_in: OrderCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    创建新订单
    """
    # 计算订单总金额
    total_amount = 0
    order_items = []
    
    for item in order_in.items:
        # 检查商品是否存在且可用
        product = db.query(Product).filter(
            Product.id == item.product_id,
            Product.is_active == True
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"商品ID {item.product_id} 不存在或不可用",
            )
        
        # 检查库存是否足够
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"商品 '{product.name}' 库存不足",
            )
        
        # 计算项目总价
        item_total = product.price * item.quantity
        total_amount += item_total
        
        # 创建订单项
        order_items.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "unit_price": product.price,
            "total_price": item_total
        })
    
    # 添加运费和税费
    shipping_fee = 0 if total_amount >= 100 else 10  # 订单满$100免运费
    tax = total_amount * 0.1  # 10% 税
    total_amount += shipping_fee + tax
    
    # 生成订单号
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    
    # 创建订单
    order = Order(
        user_id=current_user.id,
        order_number=order_number,
        status=OrderStatus.PENDING,
        total_amount=total_amount,
        payment_method=order_in.payment_method,
        shipping_address=order_in.shipping_address,
        shipping_city=order_in.shipping_city,
        shipping_state=order_in.shipping_state,
        shipping_postcode=order_in.shipping_postcode,
        shipping_country=order_in.shipping_country,
        shipping_fee=shipping_fee,
        tax=tax,
        notes=order_in.notes
    )
    
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # 创建订单项
    for item_data in order_items:
        order_item = OrderItem(
            order_id=order.id,
            **item_data
        )
        db.add(order_item)
        
        # 减少商品库存
        product = db.query(Product).filter(Product.id == item_data["product_id"]).first()
        product.stock -= item_data["quantity"]
        db.add(product)
    
    # 清空用户购物车
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    
    db.commit()
    db.refresh(order)
    return order


@router.put("/{order_id}/status", response_model=OrderSchema)
def update_order_status(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    status: OrderStatus,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    更新订单状态（仅管理员）
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在",
        )
    
    # 更新订单状态
    order.status = status
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}")
def cancel_order(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    取消订单
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在",
        )
    
    # 检查权限（只有管理员或订单所有者可以取消）
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足",
        )
    
    # 只有待处理的订单可以取消
    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只有待处理的订单可以取消",
        )
    
    # 取消订单
    order.status = OrderStatus.CANCELLED
    db.add(order)
    
    # 恢复商品库存
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock += item.quantity
            db.add(product)
    
    db.commit()
    return {"message": "订单已取消"} 