# 🚀 PLAN COMPLETO DE MEJORAS - ROBCAST

## 📋 RESUMEN EJECUTIVO

**Estado Actual:** Proyecto 75% funcional pero con 🔥 **problemas críticos de seguridad**

**Principales Issues:**
1. Panel admin **SIN AUTENTICACIÓN** (crítico)
2. Backend panel **DUPLICADO** e inconsistente
3. **SIN control de roles** en la API
4. Imágenes **ineficientes** (Data URLs)
5. **Falta validación** en API
6. **Sin HTTPS** en producción

---

## ⚡ IMPLEMENTACIÓN INMEDIATA (FASE 1 - SEGURIDAD)

### 1. AGREGAR AUTENTICACIÓN AL PANEL ADMIN

**Ubicación:** `Robcast-API/src/middleware/authAdmin.js` (NUEVO)

```javascript
const jwt = require('jsonwebtoken');

const verificarAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Sin autenticación' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que sea admin
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado - se requiere rol admin' });
    }

    req.usuario_id = decoded.usuario_id;
    req.rol = decoded.rol;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { verificarAdmin };
```

### 2. CREAR RUTA DEDICADA PARA ADMIN

**Ubicación:** `Robcast-API/src/routes/admin.js` (NUEVO)

```javascript
const express = require('express');
const router = express.Router();
const { verificarAdmin } = require('../middleware/authAdmin');

// Todas las rutas de admin requieren autenticación
router.use(verificarAdmin);

// PRODUCTOS (equivalentes a panel)
router.get('/productos', async (req, res) => {
  // GET todos los productos con paginación
});

router.post('/productos', async (req, res) => {
  // POST nuevo producto
});

router.put('/productos/:id', async (req, res) => {
  // PUT actualizar producto
});

router.delete('/productos/:id', async (req, res) => {
  // DELETE eliminar producto lógicamente
});

// VENTAS Y REPORTES
router.get('/ventas', async (req, res) => {
  // GET todas las ventas con paginación y filtros
});

router.get('/reportes/resumen', async (req, res) => {
  // GET resumen de métricas clave
});

router.get('/reportes/ventas-por-periodo', async (req, res) => {
  // GET ventas agrupadas por día/semana/mes
});

// CLIENTES
router.get('/clientes', async (req, res) => {
  // GET todos los clientes
});

// FACTURACIÓN
router.post('/facturas', async (req, res) => {
  // POST generar factura de una venta
});

// ENVÍOS
router.get('/envios', async (req, res) => {
  // GET seguimiento de envíos
});

router.put('/envios/:id', async (req, res) => {
  // PUT actualizar estado de envío
});

module.exports = router;
```

### 3. ACTUALIZAR SERVIDOR PARA INCLUIR RUTAS ADMIN

**Ubicación:** `Robcast-API/src/server.js` (MODIFICADO)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');
const ventasRoutes = require('./routes/ventas');
const adminRoutes = require('./routes/admin'); // ← NUEVO

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',      // Frontend tienda desarrollo
    'http://localhost:3002',      // Panel admin backend
    'http://192.168.0.19:80',     // Servidor producción tienda
    'http://192.168.0.19:5174'    // Servidor producción panel
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Rutas
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);
app.use('/admin', adminRoutes); // ← NUEVO - Todas las rutas requieren autenticación

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API en puerto ${PORT}`);
});
```

---

### 4. EXTENDER TABLA USUARIOS PARA ROLES

**Ubicación:** `Robcast-API/database/migrations/add_rol_to_usuarios.sql` (NUEVO)

```sql
-- Agregar columna rol a usuarios
ALTER TABLE usuarios ADD COLUMN rol ENUM('usuario', 'admin', 'vendedor') DEFAULT 'usuario';

-- Crear usuario admin inicial
-- Password: admin123 (CAMBIAR EN PRODUCCIÓN)
INSERT INTO usuarios (nombre, email, password, telefono, rol) 
VALUES ('Administrador', 'admin@robcast.com', '$2b$10$...hash_bcrypt...', '+1-234-567-8900', 'admin');
```

---

### 5. INTEGRACIÓN CON PANEL ADMIN (FRONTEND)

**Ubicación:** `Robcast-panel/src/services/api.js` (NUEVO/MODIFICADO)

```javascript
import { useState } from 'react';

const BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001';

export class AdminAPI {
  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    };

    const response = await fetch(`${BASE_URL}/admin${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401 || response.status === 403) {
      // Redirigir a login
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }

    return response.json();
  }

  // PRODUCTOS
  async getProductos(page = 1, limit = 20) {
    return this.request(`/productos?page=${page}&limit=${limit}`);
  }

  async crearProducto(datos) {
    return this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(datos)
    });
  }

  async actualizarProducto(id, datos) {
    return this.request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos)
    });
  }

  async eliminarProducto(id) {
    return this.request(`/productos/${id}`, { method: 'DELETE' });
  }

  // VENTAS
  async getVentas(page = 1, limit = 20) {
    return this.request(`/ventas?page=${page}&limit=${limit}`);
  }

  // REPORTES
  async getResumen() {
    return this.request('/reportes/resumen');
  }

  async getVentasPorPeriodo(periodo = 'mes') {
    return this.request(`/reportes/ventas-por-periodo?periodo=${periodo}`);
  }

  // FACTURACIÓN
  async generarFactura(ventaId) {
    return this.request('/facturas', {
      method: 'POST',
      body: JSON.stringify({ venta_id: ventaId })
    });
  }
}

export const adminAPI = new AdminAPI();
```

---

## 🔐 FASE 2: VALIDACIÓN Y SANITIZACIÓN

### Sistema de Validación Centralizado

**Ubicación:** `Robcast-API/src/middleware/validators.js` (NUEVO)

```javascript
const { body, validationResult } = require('express-validator');

const validarProducto = [
  body('nombre').trim().isLength({ min: 3, max: 100 }).withMessage('Nombre debe tener 3-100 caracteres'),
  body('precio').isFloat({ min: 0.01 }).withMessage('Precio debe ser positivo'),
  body('stock').isInt({ min: 0 }).withMessage('Stock debe ser número no negativo'),
  body('descripcion').optional().trim().isLength({ max: 1000 }).withMessage('Descripción máximo 1000 caracteres'),
  body('categoria').trim().isLength({ min: 2 }).withMessage('Categoría requerida'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

const validarVenta = [
  body('usuario_id').isInt().withMessage('usuario_id debe ser número'),
  body('items').isArray({ min: 1 }).withMessage('Debe haber al menos 1 item'),
  body('items.*.producto_id').isInt(),
  body('items.*.cantidad').isInt({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

module.exports = {
  validarProducto,
  validarVenta
};
```

---

## 📁 FASE 3: GESTIÓN DE IMÁGENES

### Sistema de Upload de Archivos

**Ubicación:** `Robcast-API/src/middleware/fileUpload.js` (NUEVO)

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorio si no existe
const uploadDir = path.join(__dirname, '../../uploads/productos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp_originalname
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPEG, PNG o WebP'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

module.exports = upload;
```

**Actualizar ruta de productos:**

```javascript
const express = require('express');
const upload = require('../middleware/fileUpload');
const { verificarAdmin } = require('../middleware/authAdmin');

router.post('/admin/productos', 
  verificarAdmin,
  upload.single('imagen'),
  async (req, res) => {
    const { nombre, precio, stock, descripcion, categoria } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Imagen requerida' });
    }

    const imagenUrl = `/uploads/productos/${req.file.filename}`;
    
    // Guardar en BD con URL en lugar de Data URL
    const result = await db.query(
      'INSERT INTO productos (nombre, precio, stock, descripcion, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, precio, stock, descripcion, categoria, imagenUrl]
    );

    res.json({ id: result.insertId, imagen: imagenUrl });
  }
);

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
```

---

## 🎯 FASE 4: MEJORAS DE UX EN PANEL

### Dashboard Mejorado con Gráficos

**Ubicación:** `Robcast-panel/src/components/Dashboard.jsx` (NUEVO/MEJORADO)

```jsx
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [ventasGrafico, setVentasGrafico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar estadísticas resumen
        const resStats = await adminAPI.getResumen();
        setStats(resStats);

        // Cargar gráfico de ventas por período
        const resVentas = await adminAPI.getVentasPorPeriodo('mes');
        setVentasGrafico(resVentas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Ingresos Totales</p>
          <p className="text-2xl font-bold text-green-600">${stats.ingresos_totales}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Ventas</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total_ventas}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Productos</p>
          <p className="text-2xl font-bold text-purple-600">{stats.total_productos}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Clientes</p>
          <p className="text-2xl font-bold text-orange-600">{stats.total_clientes}</p>
        </div>
      </div>

      {/* Gráfico de Ventas */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Ventas por Día</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ventasGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ventas" stroke="#3b82f6" />
            <Line type="monotone" dataKey="ingresos" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Más secciones... */}
    </div>
  );
}
```

---

## 📊 FASE 5: NUEVA ESTRUCTURA DE BASE DE DATOS

### Agregar Tablas Faltantes

**Ubicación:** `Robcast-API/database/migrations/add_nuevo_schema.sql` (NUEVO)

```sql
-- Tabla de Cupones/Descuentos
CREATE TABLE IF NOT EXISTS cupones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  tipo ENUM('porcentaje', 'monto_fijo') DEFAULT 'porcentaje',
  valor DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT NULL,
  usado INT DEFAULT 0,
  valido_desde DATETIME,
  valido_hasta DATETIME,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (codigo),
  INDEX (activo)
);

-- Tabla de Envíos
CREATE TABLE IF NOT EXISTS envios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  numero_seguimiento VARCHAR(100) UNIQUE,
  empresa_envio VARCHAR(100),
  estado ENUM('pendiente', 'en_transito', 'entregado', 'devuelto') DEFAULT 'pendiente',
  fecha_envio DATETIME,
  fecha_entrega DATETIME,
  direccion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id) REFERENCES ventas(id),
  INDEX (numero_seguimiento),
  INDEX (estado)
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS facturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL UNIQUE,
  numero_factura VARCHAR(50) UNIQUE,
  fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
  subtotal DECIMAL(10, 2),
  iva DECIMAL(10, 2),
  total DECIMAL(10, 2),
  archivo_pdf VARCHAR(255),
  estado ENUM('borrador', 'emitida', 'anulada') DEFAULT 'borrador',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id) REFERENCES ventas(id),
  INDEX (numero_factura),
  INDEX (estado)
);

-- Tabla de Auditoría
CREATE TABLE IF NOT EXISTS auditorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  entidad VARCHAR(100),
  entidad_id INT,
  accion ENUM('crear', 'actualizar', 'eliminar') NOT NULL,
  cambios JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX (usuario_id),
  INDEX (entidad),
  INDEX (created_at)
);

-- Índices de rendimiento
ALTER TABLE productos ADD INDEX idx_categoria (categoria);
ALTER TABLE productos ADD INDEX idx_precio (precio);
ALTER TABLE usuarios ADD INDEX idx_email (email);
ALTER TABLE ventas ADD INDEX idx_usuario_id (usuario_id);
ALTER TABLE ventas ADD INDEX idx_created_at (created_at);
```

---

## 📱 MEJORAS DE FRONTEND - TIENDA

### 1. Agregar Historial de Órdenes en Perfil

**Ubicación:** `Robcast/src/components/PerfilUsuario.jsx` (NUEVO)

```jsx
import React, { useEffect, useState } from 'react';
import ApiService from '../services/ApiService';

export function PerfilUsuario() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const response = await ApiService.get('/ventas/mis-ordenes');
        setOrdenes(response);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarOrdenes();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Mis Órdenes</h2>
        
        {ordenes.length === 0 ? (
          <p>No tienes órdenes aún</p>
        ) : (
          <div className="space-y-4">
            {ordenes.map(orden => (
              <div key={orden.id} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Orden #{orden.id}</span>
                  <span className={`px-3 py-1 rounded text-white ${
                    orden.estado === 'pendiente' ? 'bg-yellow-500' :
                    orden.estado === 'entregada' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}>
                    {orden.estado}
                  </span>
                </div>
                <p className="text-gray-600">Fecha: {new Date(orden.created_at).toLocaleDateString()}</p>
                <p className="font-bold">Total: ${orden.total}</p>
                {orden.envio && (
                  <p className="text-sm mt-2">
                    📦 Seguimiento: {orden.envio.numero_seguimiento}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🔗 CONECTAR PANEL CON TIENDA

### Flujo de Datos Integrado

**El panel debe mostrar:**
- ✅ Mismo catálogo de productos de la tienda
- ✅ Órdenes que los usuarios hacen en la tienda
- ✅ Estado de envíos en tiempo real
- ✅ Clientes registrados en la tienda
- ✅ Reportes y estadísticas de la tienda

**La tienda debe mostrar:**
- ✅ Cambios que admin hace en productos (stocks, precios)
- ✅ Estado de sus órdenes (actualizado por admin)
- ✅ Facturas generadas por admin

---

## 📈 IMPLEMENTACIÓN RECOMENDADA (Orden)

### Semana 1:
1. [ ] Implementar middleware authAdmin
2. [ ] Crear rutas /admin en API
3. [ ] Validación con express-validator
4. [ ] HTTPS en servidor

### Semana 2:
1. [ ] Sistema de upload de imágenes
2. [ ] Crear tablas nuevas (cupones, envíos, facturas)
3. [ ] Endpoints de facturación
4. [ ] Login en panel admin

### Semana 3:
1. [ ] Dashboard con gráficos
2. [ ] Historial de órdenes en tienda
3. [ ] Seguimiento de envíos
4. [ ] Auditoría de cambios

### Semana 4:
1. [ ] Tests unitarios
2. [ ] Documentación API (Swagger)
3. [ ] Optimización de BD
4. [ ] Deploy a producción

---

## 🚨 CHECKLIST DE SEGURIDAD ANTES DE PRODUCCIÓN

- [ ] Panel requiere autenticación JWT
- [ ] HTTPS configurado con certificado válido
- [ ] Rate limiting implementado
- [ ] CORS restrictivo
- [ ] Validación de entrada en todos los endpoints
- [ ] Sanitización contra XSS
- [ ] Protección contra SQL injection
- [ ] Backup automático de BD
- [ ] Monitoreo y alertas configuradas
- [ ] Logs de auditoría en BD
- [ ] Documentación API completa
- [ ] Tests de seguridad pasados

---

## 📞 SOPORTE Y CONTACTO

Para preguntas sobre la implementación contactar al equipo de desarrollo.

