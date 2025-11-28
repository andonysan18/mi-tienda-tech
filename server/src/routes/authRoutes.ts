import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', register); // POST http://localhost:3001/api/auth/register
router.post('/login', login);       // POST http://localhost:3001/api/auth/login

export default router;