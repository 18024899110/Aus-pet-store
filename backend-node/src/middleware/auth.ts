import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/security';
import { User } from '../models';

export interface AuthRequest extends Request {
  user?: User;
}

/**
 * 认证中间件 - 验证 JWT 令牌
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ detail: 'Not authenticated' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ detail: 'Invalid or expired token' });
      return;
    }

    const user = await User.findByPk(payload.sub);

    if (!user) {
      res.status(401).json({ detail: 'User not found' });
      return;
    }

    if (!user.isActive) {
      res.status(400).json({ detail: 'Inactive user' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ detail: 'Authentication failed' });
  }
};

/**
 * 管理员权限中间件
 */
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ detail: 'Not authenticated' });
    return;
  }

  if (!req.user.isAdmin) {
    res.status(403).json({ detail: 'Not enough permissions' });
    return;
  }

  next();
};
