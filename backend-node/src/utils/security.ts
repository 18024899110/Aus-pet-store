import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';

export interface TokenPayload {
  sub: number;
  email: string;
  exp?: number;
  iat?: number;
}

/**
 * 对密码进行哈希加密
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * 验证密码
 */
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * 创建 JWT 访问令牌
 */
export const createAccessToken = (userId: number, email: string): string => {
  const payload = {
    sub: userId,
    email,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

/**
 * 验证 JWT 令牌
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    if (typeof decoded === 'string') {
      return null;
    }
    return decoded as any as TokenPayload;
  } catch (error) {
    return null;
  }
};
