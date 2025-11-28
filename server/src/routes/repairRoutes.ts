import { Router } from 'express';
import { createRepairTicket, getRepairStatus } from '../controllers/repairController';

const router = Router();

// POST http://localhost:3001/api/repairs
router.post('/', createRepairTicket);

// GET http://localhost:3001/api/repairs/:id (El :id es dinámico)
router.get('/:id', getRepairStatus);

export default router;