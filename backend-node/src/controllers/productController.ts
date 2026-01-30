import { Request, Response } from 'express';
import { Product, Category } from '../models';
import { Op } from 'sequelize';

/**
 * 获取产品列表
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      skip = 0,
      limit = 100,
      category_id,
      search,
      min_price,
      max_price,
    } = req.query;

    const where: any = { isActive: true };

    if (category_id) {
      where.categoryId = category_id;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      offset: Number(skip),
      limit: Number(limit),
      order: [['createdAt', 'DESC']],
    });

    // 转换为前端期望的格式
    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      stock: p.stock,
      image: p.image,
      image_url: p.image,
      is_active: p.isActive,
      category_id: p.categoryId,
      category: p.category ? { id: p.category.id, name: p.category.name } : null,
      brand: p.brand,
      weight: p.weight ? Number(p.weight) : null,
      dimensions: p.dimensions,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ detail: 'Failed to fetch products' });
  }
};

/**
 * 获取单个产品
 */
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      res.status(404).json({ detail: 'Product not found' });
      return;
    }

    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      image: product.image,
      image_url: product.image,
      is_active: product.isActive,
      category_id: product.categoryId,
      category: product.category ? { id: product.category.id, name: product.category.name } : null,
      brand: product.brand,
      weight: product.weight ? Number(product.weight) : null,
      dimensions: product.dimensions,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ detail: 'Failed to fetch product' });
  }
};

/**
 * 创建产品（仅管理员）
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;

    const product = await Product.create({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock || 0,
      image: productData.image,
      isActive: productData.is_active !== undefined ? productData.is_active : true,
      categoryId: productData.category_id,
      brand: productData.brand,
      weight: productData.weight,
      dimensions: productData.dimensions,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ detail: 'Failed to create product' });
  }
};

/**
 * 更新产品（仅管理员）
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ detail: 'Product not found' });
      return;
    }

    await product.update({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      image: productData.image,
      isActive: productData.is_active,
      categoryId: productData.category_id,
      brand: productData.brand,
      weight: productData.weight,
      dimensions: productData.dimensions,
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ detail: 'Failed to update product' });
  }
};

/**
 * 删除产品（仅管理员）
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ detail: 'Product not found' });
      return;
    }

    await product.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ detail: 'Failed to delete product' });
  }
};
