import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);   // GET /api/products
router.post('/', createProduct); // POST /api/products

export default router;