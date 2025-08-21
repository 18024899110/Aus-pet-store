import logging
from sqlalchemy.orm import Session

from app.db.session import Base, engine
from app.core.config import settings
from app.models.user import User
from app.models.product import Product, Category
from app.models.order import Order, OrderItem
from app.utils.security import get_password_hash

logger = logging.getLogger(__name__)

# Initialize database tables
def init_db(db: Session) -> None:
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Check if admin user already exists
    admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin_user:
        # Create admin user
        admin_user = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            full_name="Administrator",
            is_admin=True,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        logger.info("Admin user created")
    
    # Check if product categories already exist
    categories_count = db.query(Category).count()
    if categories_count == 0:
        # Create basic categories
        categories = [
            Category(name="Dog Supplies", slug="dog"),
            Category(name="Cat Supplies", slug="cat"),
            Category(name="Small Pet Supplies", slug="small-pet"),
        ]
        db.add_all(categories)
        db.commit()
        logger.info("Basic product categories created")
    
    # Check if sample products already exist
    products_count = db.query(Product).count()
    if products_count == 0:
        # Get categories
        dog_category = db.query(Category).filter(Category.slug == "dog").first()
        cat_category = db.query(Category).filter(Category.slug == "cat").first()
        small_pet_category = db.query(Category).filter(Category.slug == "small-pet").first()
        
        # Create sample products
        products = [
            Product(
                name="Premium Dog Food 10kg",
                description="High-quality dog food suitable for all adult dogs. Rich in premium protein and essential vitamins to ensure your beloved dog's healthy growth.",
                price=89.99,
                stock=50,
                image="product1.jpg",
                category_id=dog_category.id,
                is_active=True
            ),
            Product(
                name="Cat Scratching Toy",
                description="Durable cat scratching toy to protect your furniture.",
                price=29.99,
                stock=100,
                image="product2.jpg",
                category_id=cat_category.id,
                is_active=True
            ),
            Product(
                name="Pet Automatic Feeder",
                description="Smart pet feeder with scheduled feeding capabilities.",
                price=129.99,
                stock=30,
                image="product3.jpg",
                category_id=dog_category.id,
                is_active=True
            ),
            Product(
                name="Cat Nutrition Paste",
                description="Provides comprehensive nutrition for cats.",
                price=19.99,
                stock=80,
                image="product4.jpg",
                category_id=cat_category.id,
                is_active=True
            ),
            Product(
                name="Dog Training Treats",
                description="Delicious treats perfect for training, dogs love them.",
                price=15.99,
                stock=120,
                image="product5.jpg",
                category_id=dog_category.id,
                is_active=True
            ),
            Product(
                name="Cat Comfortable Bed",
                description="Soft and comfortable cat bed, giving cats their own space.",
                price=45.99,
                stock=40,
                image="product6.jpg",
                category_id=cat_category.id,
                is_active=True
            ),
            Product(
                name="Dog Toy Ball",
                description="Durable and chew-resistant dog toy ball.",
                price=12.99,
                stock=150,
                image="product7.jpg",
                category_id=dog_category.id,
                is_active=True
            ),
            Product(
                name="Small Pet Food",
                description="Nutritious food suitable for small pets like hamsters and rabbits.",
                price=9.99,
                stock=100,
                image="product8.jpg",
                category_id=small_pet_category.id,
                is_active=True
            ),
        ]
        db.add_all(products)
        db.commit()
        logger.info("Sample products created") 