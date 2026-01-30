import express from 'express';
import { CartItem, Product } from '../models';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// 获取购物车
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user!.id },
      include: [{ model: Product, as: 'product' }],
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch cart' });
  }
});

// 添加到购物车
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { product_id, quantity } = req.body;

    const existing = await CartItem.findOne({
      where: { userId: req.user!.id, productId: product_id },
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await CartItem.create({
      userId: req.user!.id,
      productId: product_id,
      quantity,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to add to cart' });
  }
});

// 更新购物车项目
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!cartItem) {
      return res.status(404).json({ detail: 'Cart item not found' });
    }

    cartItem.quantity = req.body.quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to update cart item' });
  }
});

// 删除购物车项目
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!cartItem) {
      return res.status(404).json({ detail: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ detail: 'Failed to delete cart item' });
  }
});

// 清空购物车
router.delete('/', authenticate, async (req: AuthRequest, res) => {
  try {
    await CartItem.destroy({ where: { userId: req.user!.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ detail: 'Failed to clear cart' });
  }
});

export default router;
