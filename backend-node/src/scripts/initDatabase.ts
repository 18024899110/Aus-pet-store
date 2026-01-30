import sequelize from '../db';
import { User, Category, Product } from '../models';
import { hashPassword } from '../utils/security';
import config from '../config';

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // 同步数据库模型
    await sequelize.sync({ force: true });
    console.log('✅ Database models synchronized');

    // 创建管理员用户
    const hashedPassword = await hashPassword(config.admin.password);
    const admin = await User.create({
      email: config.admin.email,
      hashedPassword,
      fullName: config.admin.name,
      isActive: true,
      isAdmin: true,
    });
    console.log(`✅ Admin user created: ${admin.email}`);

    // 创建分类
    const categories = await Category.bulkCreate([
      {
        name: 'Dog Supplies',
        slug: 'dog-supplies',
        description: 'Everything your dog needs',
        isActive: true,
      },
      {
        name: 'Cat Supplies',
        slug: 'cat-supplies',
        description: 'Everything your cat needs',
        isActive: true,
      },
      {
        name: 'Small Pet Supplies',
        slug: 'small-pet-supplies',
        description: 'Supplies for small pets like rabbits, hamsters, etc.',
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // 创建示例产品
    const products = await Product.bulkCreate([
      {
        name: 'Premium Dog Food',
        description: 'High-quality nutritious dog food for all breeds',
        price: 29.99,
        stock: 100,
        categoryId: categories[0].id,
        brand: 'PetNutrition',
        weight: 5.0,
        isActive: true,
      },
      {
        name: 'Cat Scratching Post',
        description: 'Durable scratching post for cats',
        price: 39.99,
        stock: 50,
        categoryId: categories[1].id,
        brand: 'CatComfort',
        dimensions: '20x20x60cm',
        isActive: true,
      },
      {
        name: 'Hamster Cage',
        description: 'Spacious and comfortable hamster cage',
        price: 49.99,
        stock: 30,
        categoryId: categories[2].id,
        brand: 'SmallPetHome',
        dimensions: '40x30x30cm',
        isActive: true,
      },
      {
        name: 'Dog Chew Toy',
        description: 'Durable rubber chew toy for dogs',
        price: 12.99,
        stock: 200,
        categoryId: categories[0].id,
        brand: 'PlayPet',
        isActive: true,
      },
      {
        name: 'Cat Litter',
        description: 'Odor-control cat litter',
        price: 19.99,
        stock: 150,
        categoryId: categories[1].id,
        brand: 'FreshPet',
        weight: 10.0,
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${products.length} sample products`);

    console.log('🎉 Database initialization completed successfully!');
    console.log(`\n📝 Admin credentials:`);
    console.log(`   Email: ${config.admin.email}`);
    console.log(`   Password: ${config.admin.password}`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
