import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // NUEVO

// ... import authRoutes ...
import repairRoutes from './routes/repairRoutes'; // <--- IMPORTAR
import productRoutes from './routes/productRoutes';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// ...
app.use('/api/auth', authRoutes);
app.use('/api/repairs', repairRoutes); // <--- AGREGAR ESTA LÍNEA
app.use('/api/products', productRoutes); // <--- AGREGAR
// ...

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server up!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});



