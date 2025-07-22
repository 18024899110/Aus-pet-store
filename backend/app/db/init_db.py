import logging
from sqlalchemy.orm import Session

from app.db.session import Base, engine
from app.core.config import settings
from app.models.user import User
from app.models.product import Product, Category
from app.models.order import Order, OrderItem
from app.utils.security import get_password_hash

logger = logging.getLogger(__name__)

# 初始化数据库表
def init_db(db: Session) -> None:
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    
    # 检查是否已有管理员用户
    admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin_user:
        # 创建管理员用户
        admin_user = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            full_name="管理员",
            is_admin=True,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        logger.info("已创建管理员用户")
    
    # 检查是否已有商品分类
    categories_count = db.query(Category).count()
    if categories_count == 0:
        # 创建基本分类
        categories = [
            Category(name="狗狗用品", slug="dog"),
            Category(name="猫咪用品", slug="cat"),
            Category(name="小宠用品", slug="small-pet"),
        ]
        db.add_all(categories)
        db.commit()
        logger.info("已创建基本商品分类")
    
    # 检查是否已有示例商品
    products_count = db.query(Product).count()
    if products_count == 0:
        # 获取分类
        dog_category = db.query(Category).filter(Category.slug == "dog").first()
        cat_category = db.query(Category).filter(Category.slug == "cat").first()
        small_pet_category = db.query(Category).filter(Category.slug == "small-pet").first()
        
        # 创建示例商品
        products = [
            Product(
                name="优质狗粮 10kg",
                description="高品质狗粮，适合所有成年犬。富含优质蛋白质和必要的维生素，确保您的爱犬健康成长。",
                price=89.99,
                stock=50,
                image="product1.jpg",
                category_id=dog_category.id,
                is_active=True
            ),
            Product(
                name="猫咪磨爪玩具",
                description="耐用猫咪磨爪玩具，保护您的家具。",
                price=29.99,
                stock=100,
                image="product2.jpg",
                category_id=cat_category.id,
                is_active=True
            ),
            Product(
                name="宠物自动喂食器",
                description="智能宠物喂食器，可定时定量。",
                price=129.99,
                stock=30,
                image="product3.jpg",
                category_id=dog_category.id,
                is_active=True
            ),
            Product(
                name="猫咪营养膏",
                description="提供猫咪所需的全面营养。",
                price=19.99,
                stock=80,
                image="product4.jpg",
                category_id=cat_category.id,
                is_active=True
            ),
            Product(
                name="狗狗训练零食",
                description="适合训练的美味零食，狗狗喜爱。",
                price=15.99,
                stock=120,
                image="product5.jpg",
                category_id=dog_category.id,
                is_active=True
            ),
            Product(
                name="猫咪舒适窝",
                description="柔软舒适的猫窝，让猫咪有自己的空间。",
                price=45.99,
                stock=40,
                image="product6.jpg",
                category_id=cat_category.id,
                is_active=True
            ),
            Product(
                name="狗狗玩具球",
                description="耐咬耐用的狗狗玩具球。",
                price=12.99,
                stock=150,
                image="product7.jpg",
                category_id=dog_category.id,
                is_active=True
            ),
            Product(
                name="小宠饲料",
                description="适合仓鼠、兔子等小宠物的营养饲料。",
                price=9.99,
                stock=100,
                image="product8.jpg",
                category_id=small_pet_category.id,
                is_active=True
            ),
        ]
        db.add_all(products)
        db.commit()
        logger.info("已创建示例商品") 