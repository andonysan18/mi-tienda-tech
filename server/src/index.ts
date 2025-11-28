import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // NUEVO

// ... import authRoutes ...
import repairRoutes from './routes/repairRoutes'; // <--- IMPORTAR

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes); // NUEVO: Ahora tu server escucha en /api/auth

// ...

app.use('/api/auth', authRoutes);
app.use('/api/repairs', repairRoutes); // <--- AGREGAR ESTA LÍNEA

// ...

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server up!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});



