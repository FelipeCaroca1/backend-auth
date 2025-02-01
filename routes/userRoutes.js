import express from 'express';
import { registerUser, loginUser, verifyToken } from '../controllers/userController.js';
import verifyAuthToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifytoken', verifyAuthToken, verifyToken);

export default router;
