import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;
