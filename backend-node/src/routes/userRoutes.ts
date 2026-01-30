import express from 'express';
import { User } from '../models';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// 获取当前用户信息
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    res.json({
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      postcode: user.postcode,
      country: user.country,
      is_active: user.isActive,
      is_admin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch user' });
  }
});

// 更新当前用户信息
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const updateData = req.body;

    await user.update({
      fullName: updateData.full_name,
      phone: updateData.phone,
      address: updateData.address,
      city: updateData.city,
      state: updateData.state,
      postcode: updateData.postcode,
      country: updateData.country,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to update user' });
  }
});

// 获取所有用户（仅管理员）
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['hashedPassword'] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch users' });
  }
});

// 获取指定用户（仅管理员）
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['hashedPassword'] },
    });
    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch user' });
  }
});

export default router;
