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
    Get current user's shopping cart
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
    Add item to shopping cart
    """
    # Check if product exists and is available
    product = db.query(Product).filter(
        Product.id == item_in.product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or not available",
        )
    
    # Check if stock is sufficient
    if product.stock < item_in.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock",
        )
    
    # Check if item already exists in cart
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item_in.product_id
    ).first()
    
    if existing_item:
        # If item exists, update quantity
        new_quantity = existing_item.quantity + item_in.quantity
        if new_quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock",
            )
        
        existing_item.quantity = new_quantity
        db.add(existing_item)
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # If item doesn't exist, add new item
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
    Update shopping cart item quantity
    """
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )
    
    # Check if product exists and is available
    product = db.query(Product).filter(
        Product.id == cart_item.product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or not available",
        )
    
    # Check if stock is sufficient
    if product.stock < item_in.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock",
        )
    
    # Update quantity
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
    Remove item from shopping cart
    """
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )
    
    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}


@router.delete("/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Clear shopping cart
    """
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared"} 