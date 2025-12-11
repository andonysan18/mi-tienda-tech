import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro'; // En prod va en .env

// REGISTRO
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // 1. Verificar si ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

    // 2. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Guardar en DB
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    res.status(201).json({ message: 'Usuario creado exitosamente', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
  
      // 1. Buscar usuario
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });
  
      // 2. Comparar contraseña (La que viene vs la encriptada)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });
  
      // 3. Generar Token (El pase VIP)
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  
      res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email} });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  };