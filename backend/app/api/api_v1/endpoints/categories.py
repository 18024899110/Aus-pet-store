from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.product import Category
from app.models.user import User
from app.schemas.product import Category as CategorySchema, CategoryCreate, CategoryUpdate
from app.api.deps import get_current_active_user, get_current_active_admin

router = APIRouter()


@router.get("/", response_model=List[CategorySchema])
def read_categories(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get category list
    """
    categories = db.query(Category).filter(Category.is_active == True).offset(skip).limit(limit).all()
    return categories


@router.get("/{category_id}", response_model=CategorySchema)
def read_category(
    category_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get category details by ID
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    if not category.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not available",
        )
    return category


@router.post("/", response_model=CategorySchema)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: CategoryCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Create new category (Admin only)
    """
    # Check if slug already exists
    existing_category = db.query(Category).filter(Category.slug == category_in.slug).first()
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category slug already exists",
        )
    
    category = Category(**category_in.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/{category_id}", response_model=CategorySchema)
def update_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
    category_in: CategoryUpdate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Update category (Admin only)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    
    # If slug is updated, check for conflicts with other categories
    if category_in.slug and category_in.slug != category.slug:
        existing_category = db.query(Category).filter(Category.slug == category_in.slug).first()
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category slug already exists",
            )
    
    # Update category information
    update_data = category_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}", response_model=CategorySchema)
def delete_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Delete category (Admin only)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    
    # Check if any products use this category
    if category.products:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category with existing products",
        )
    
    # Soft delete (set is_active to False)
    category.is_active = False
    db.add(category)
    db.commit()
    db.refresh(category)
    return category 