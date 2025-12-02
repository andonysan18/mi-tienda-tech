import { Router } from 'express';
import { createRepairTicket, getAllTickets, getRepairStatus, updateTicketStatus } from '../controllers/repairController';

const router = Router();

// POST http://localhost:3001/api/repairs
router.post('/', createRepairTicket);

// GET http://localhost:3001/api/repairs/:id (El :id es dinámico)
router.get('/:id', getRepairStatus);

router.get('/', getAllTickets); // NUEVO: GET /api/repairs (Trae todos)
router.patch('/:id', updateTicketStatus); // NUEVO: PATCH para actualizar partes del ticket

export default router;