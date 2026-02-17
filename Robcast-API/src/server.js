const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ================================================================
// MIDDLEWARE GLOBAL
// ================================================================

// CORS mejorado
const corsOptions = {
  origin: [
    'http://localhost:5173',      // Frontend tienda desarrollo
    'http://localhost:3002',      // Panel admin desarrollo
    'http://192.168.0.19',        // IP servidor (ajustar según producción)
    'http://192.168.0.19:80',     // Servidor producción tienda
    'http://192.168.0.19:5174',   // Servidor producción panel
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Parseo de JSON mejorado
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ================================================================
// RUTAS PÚBLICAS
// ================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Robcast funcionando ✅', timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'API Robcast funcionando ✅', timestamp: new Date() });
});

// Rutas de autenticación (públicas)
app.use('/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/auth'));

// Rutas de productos (lectura pública)
app.use('/productos', require('./routes/productos'));
app.use('/api/productos', require('./routes/productos'));

// ================================================================
// RUTAS DE USUARIO (requieren autenticación básica)
// ================================================================

app.use('/usuarios', require('./routes/usuarios'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/ventas', require('./routes/ventas'));
app.use('/api/ventas', require('./routes/ventas'));

// ================================================================
// RUTAS DE ADMINISTRACIÓN (requieren autenticación como admin)
// ================================================================

app.use('/admin', require('./routes/admin'));
app.use('/api/admin', require('./routes/admin'));

// ================================================================
// MANEJO DE ERRORES
// ================================================================

// 404 - No encontrado
app.use((req, res) => {
  res.status(404).json({
    error: 'No encontrado',
    mensaje: `La ruta ${req.method} ${req.path} no existe`,
    timestamp: new Date()
  });
});

// Error general
app.use((err, req, res, next) => {
  console.error('❌ Error:', {
    mensaje: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Errores de validación
  if (err.status === 400) {
    return res.status(400).json({
      error: err.message,
      detalles: err.errors
    });
  }

  // Errores de autenticación
  if (err.status === 401) {
    return res.status(401).json({
      error: 'No autorizado',
      mensaje: err.message
    });
  }

  // Errores de CORS
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS error',
      mensaje: 'Acceso denegado'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    error: 'Error interno',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
  });
});

// ================================================================
// INICIALIZAR SERVIDOR
// ================================================================

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║  🚀 API ROBCAST INICIADA CORRECTAMENTE  ║
  ╚════════════════════════════════════════╝
  
  📍 Puerto: ${PORT}
  🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
  🎛️  Panel: ${process.env.ADMIN_URL || 'http://localhost:3002'}
  🔒 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO CONFIGURADO'}
  🗄️  Base de datos: ${process.env.DB_HOST || 'localhost'}
  
  Endpoints disponibles:
  ✓ GET  /health                 - Estado de la API
  ✓ POST /auth/login             - Iniciar sesión
  ✓ POST /auth/registro          - Crear nueva cuenta
  ✓ GET  /productos              - Listar productos
  ✓ POST /admin/*                - Rutas de administración (requieren autenticación)
  
  `);
});

module.exports = app;
