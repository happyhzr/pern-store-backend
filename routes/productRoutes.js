import express from 'express';

import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;