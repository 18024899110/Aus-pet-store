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
    获取分类列表
    """
    categories = db.query(Category).filter(Category.is_active == True).offset(skip).limit(limit).all()
    return categories


@router.get("/{category_id}", response_model=CategorySchema)
def read_category(
    category_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    通过ID获取分类详情
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在",
        )
    if not category.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不可用",
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
    创建新分类（仅管理员）
    """
    # 检查slug是否已存在
    existing_category = db.query(Category).filter(Category.slug == category_in.slug).first()
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该分类标识已存在",
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
    更新分类（仅管理员）
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在",
        )
    
    # 如果更新了slug，检查是否与其他分类冲突
    if category_in.slug and category_in.slug != category.slug:
        existing_category = db.query(Category).filter(Category.slug == category_in.slug).first()
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="该分类标识已存在",
            )
    
    # 更新分类信息
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
    删除分类（仅管理员）
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在",
        )
    
    # 检查是否有商品使用此分类
    if category.products:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无法删除已有商品的分类",
        )
    
    # 软删除（将is_active设为False）
    category.is_active = False
    db.add(category)
    db.commit()
    db.refresh(category)
    return category 