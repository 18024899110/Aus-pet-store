from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.product import Product as ProductSchema, ProductCreate, ProductUpdate, ProductWithCategory
from app.api.deps import get_current_active_user, get_current_active_admin
from app.utils.image_utils import image_manager

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
    Get product list
    """
    query = db.query(Product)
    
    # Apply filters
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Only return active products
    query = query.filter(Product.is_active == True)
    
    # Sort and paginate
    products = query.order_by(Product.id).offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductWithCategory)
def read_product(
    product_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get product details by ID
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    if not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not available",
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
    Create new product (Admin only)
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
    Update product (Admin only)
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    
    # Update product information
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
    Delete product (Admin only)
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    
    # Soft delete (set is_active to False)
    product.is_active = False
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Upload product image (Admin only)
    """
    try:
        # Save the uploaded image
        filename = await image_manager.save_product_image(file)
        image_url = image_manager.get_image_url(filename)
        
        return {
            "message": "Image uploaded successfully",
            "filename": filename,
            "image_url": image_url
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) 