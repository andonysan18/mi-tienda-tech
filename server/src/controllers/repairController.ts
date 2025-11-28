import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CREAR TICKET (El cliente o el técnico ingresan el equipo)
export const createRepairTicket = async (req: Request, res: Response) => {
  try {
    const { deviceModel, issueDescription, userId } = req.body;

    // Validamos datos mínimos
    if (!deviceModel || !issueDescription) {
      return res.status(400).json({ message: 'Faltan datos del dispositivo o la falla.' });
    }

    const newTicket = await prisma.repairTicket.create({
      data: {
        deviceModel,
        issueDescription,
        // Si viene un userId (usuario registrado), lo conectamos. Si no, queda nulo (cliente invitado)
        userId: userId ? parseInt(userId) : null, 
        status: 'PENDIENTE'
      }
    });

    res.status(201).json({ 
      message: 'Ticket creado exitosamente', 
      ticket: newTicket 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el ticket de reparación' });
  }
};

// CONSULTAR ESTADO (Para el rastreo público)
export const getRepairStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const ticket = await prisma.repairTicket.findUnique({
      where: { id },
      select: { 
        id: true, 
        deviceModel: true, 
        status: true, 
        updatedAt: true,
        estimatedCost: true
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'No encontramos ninguna reparación con ese código.' });
    }

    res.json(ticket);

  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el ticket' });
  }
};