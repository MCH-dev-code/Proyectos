const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/productos', require('./routes/productos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/ventas', require('./routes/ventas'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API Robcast funcionando ✅' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Robcast corriendo en puerto ${PORT}`);
  console.log(`📍 Frontend: ${process.env.FRONTEND_URL}`);
});
