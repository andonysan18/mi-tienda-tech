import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. OBTENER TODOS LOS PRODUCTOS
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// 2. CREAR UN PRODUCTO (Solo Admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, category, stock, imageUrl } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        imageUrl: imageUrl || 'https://via.placeholder.com/300' // Imagen por defecto si no ponen nada
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};