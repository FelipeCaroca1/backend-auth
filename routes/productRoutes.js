import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', verifyToken, createProduct);
router.get('/readall', getAllProducts);
router.get('/readone/:id', getProductById);
router.put('/update/:id', verifyToken, updateProduct);
router.delete('/delete/:id', verifyToken, deleteProduct);

export default router;
