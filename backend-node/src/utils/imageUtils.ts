import fs from 'fs';
import path from 'path';
import config from '../config';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const MAX_FILE_SIZE = config.upload.maxSize;

/**
 * 验证图片文件
 */
export const validateImage = (file: any): { valid: boolean; error?: string } => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
};

/**
 * 保存图片文件
 */
export const saveImage = (file: any, directory: string): string => {
  const uploadDir = path.join(process.cwd(), config.upload.dir);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(file.originalname);
  const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
  const filepath = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, file.buffer);

  return filename;
};

/**
 * 删除图片文件
 */
export const deleteImage = (filename: string): boolean => {
  try {
    const filepath = path.join(process.cwd(), config.upload.dir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

/**
 * 获取图片 URL
 */
export const getImageUrl = (filename: string | null): string | null => {
  if (!filename) return null;
  return `/static/images/products/${filename}`;
};
