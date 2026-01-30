import express from 'express';
import { Category } from '../models';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch categories' });
  }
});

// 获取单个分类
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ detail: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch category' });
  }
});

// 创建分类（仅管理员）
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to create category' });
  }
});

// 更新分类（仅管理员）
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ detail: 'Category not found' });
    }
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to update category' });
  }
});

// 删除分类（仅管理员）
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ detail: 'Category not found' });
    }
    await category.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ detail: 'Failed to delete category' });
  }
});

export default router;
