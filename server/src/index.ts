import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // NUEVO

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes); // NUEVO: Ahora tu server escucha en /api/auth

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server up!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});