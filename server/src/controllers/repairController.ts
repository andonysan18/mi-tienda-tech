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

// 3. OBTENER TODOS LOS TICKETS (Para el Admin)
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.repairTicket.findMany({
      orderBy: { createdAt: 'desc' }, // Los más nuevos primero
      include: { user: { select: { name: true, email: true } } } // Traer nombre del dueño si existe
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
};

// 4. ACTUALIZAR ESTADO
export const updateTicketStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, estimatedCost } = req.body; // Recibimos nuevo estado y costo

    const updatedTicket = await prisma.repairTicket.update({
      where: { id },
      data: { 
        status,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined
      }
    });

    res.json({ message: 'Ticket actualizado', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el ticket' });
  }
};