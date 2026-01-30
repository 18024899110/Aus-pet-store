import { Request, Response } from 'express';
import { User } from '../models';
import { hashPassword, verifyPassword, createAccessToken } from '../utils/security';

/**
 * 用户注册
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, phone } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ detail: 'Email already registered' });
      return;
    }

    // 创建新用户
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      hashedPassword,
      fullName,
      phone,
      isActive: true,
      isAdmin: false,
    });

    // 生成令牌
    const accessToken = createAccessToken(user.id, user.email);

    res.status(201).json({
      access_token: accessToken,
      token_type: 'bearer',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        is_admin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ detail: 'Registration failed' });
  }
};

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { email: username } });
    if (!user) {
      res.status(401).json({ detail: 'Incorrect email or password' });
      return;
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.hashedPassword);
    if (!isValidPassword) {
      res.status(401).json({ detail: 'Incorrect email or password' });
      return;
    }

    // 检查用户是否激活
    if (!user.isActive) {
      res.status(400).json({ detail: 'Inactive user' });
      return;
    }

    // 生成令牌
    const accessToken = createAccessToken(user.id, user.email);

    res.json({
      access_token: accessToken,
      token_type: 'bearer',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        is_admin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Login failed' });
  }
};
