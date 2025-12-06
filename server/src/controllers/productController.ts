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

// 2. CREAR UN PRODUCTO
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Agregamos bannerUrl, isFeatured, discount al destructuring
    const { name, price, category, stock, imageUrl, bannerUrl, isFeatured, discount } = req.body;

    console.log("Datos recibidos:", req.body);

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        imageUrl: imageUrl || 'https://via.placeholder.com/300',
        // Nuevos campos opcionales
        bannerUrl: bannerUrl || null,
        isFeatured: isFeatured || false,
        discount: discount ? parseInt(discount) : 0,
      }
    });
    
    res.status(201).json(newProduct);

  } catch (error: any) {
    console.error("❌ ERROR CRÍTICO EN BACKEND:", error);
    res.status(500).json({ error: 'Error al crear producto', details: error.message });
  }
};

// 3. ACTUALIZAR PRODUCTO
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    // Agregamos los nuevos campos aquí también
    const { name, price, category, stock, imageUrl, bannerUrl, isFeatured, discount } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        imageUrl,
        bannerUrl,
        isFeatured,
        discount: discount ? parseInt(discount) : 0
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// 4. ELIMINAR PRODUCTO
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};