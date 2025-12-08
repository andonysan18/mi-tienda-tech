import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- HELPER: Generador de ID Corto (6 caracteres) ---
const generateShortId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 1. CREAR TICKET (Con ID Corto + WhatsApp)
export const createRepairTicket = async (req: Request, res: Response) => {
  try {
    const { deviceModel, issueDescription, userId, contactPhone } = req.body;

    if (!deviceModel || !issueDescription || !contactPhone) {
      return res.status(400).json({ 
        message: 'Faltan datos obligatorios: Modelo, Falla o Teléfono.' 
      });
    }

    // 1. Generamos un ID corto único
    let shortId = generateShortId();
    
    // Verificamos que no exista (por seguridad)
    let exists = await prisma.repairTicket.findUnique({ where: { id: shortId } });
    while (exists) {
       shortId = generateShortId();
       exists = await prisma.repairTicket.findUnique({ where: { id: shortId } });
    }

    // 2. Creamos el ticket forzando el ID corto
    const newTicket = await prisma.repairTicket.create({
      data: {
        id: shortId, // 👈 Aquí reemplazamos el UUID automático
        deviceModel,
        issueDescription,
        contactPhone,
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
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
};

// 2. CONSULTAR ESTADO (Público)
export const getRepairStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Buscamos por el ID corto (es un string, así que funciona igual)
    const ticket = await prisma.repairTicket.findUnique({
      where: { id },
      select: { 
        id: true, 
        deviceModel: true, 
        status: true, 
        updatedAt: true,
        estimatedCost: true,
        contactPhone: true 
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

// 3. OBTENER TODOS (Admin)
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.repairTicket.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        user: { select: { name: true, email: true } } 
      }
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
    const { status, estimatedCost } = req.body; 

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

// 5. ELIMINAR TICKET (Nuevo: Para que funcione el botón de borrar)
export const deleteRepairTicket = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    await prisma.repairTicket.delete({
      where: { id }
    });

    res.json({ message: 'Ticket eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el ticket' });
  }
};