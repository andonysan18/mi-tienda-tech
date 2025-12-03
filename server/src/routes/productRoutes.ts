import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);   // GET /api/products
router.post('/', createProduct); // POST /api/products

router.put('/:id', updateProduct); // PUT /api/products/:id
router.delete('/:id', deleteProduct); // DELETE /api/products/:id

export default router;