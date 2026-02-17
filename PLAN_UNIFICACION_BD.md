# 📋 PLAN INTEGRAL ROBCAST - BASE DE DATOS UNIFICADA

## 🏗️ ARQUITECTURA PROPUESTA

### Estructura Actual
```
Robcast-API/          → API Express con rutas
Robcast/              → Tienda (React/Vite) - Frontend puro
Robcast-panel/        → Panel Admin (React/Vite) - Frontend puro
docker-compose.yml    → Solo contiene MySQL (desfasado)
```

### Estructura Unificada Propuesta
```
robcast-proyecto/
├── backend/                    (Robcast-API mejorada)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js         ✅ Existente
│   │   │   ├── productos.js    ✅ Existente
│   │   │   ├── usuarios.js     ✅ Existente
│   │   │   ├── ventas.js       ✅ Existente
│   │   │   └── admin.js        ✅ Existente
│   │   ├── middleware/
│   │   ├── db.js               ✅ MariaDB
│   │   └── server.js           ✅ Existente
│   ├── package.json
│   ├── Dockerfile
│   └── .env
│
├── tienda/                     (Robcast actual)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   │   └── ApiService.js   ⚠️ ACTUALIZAR URLs
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── .env
│
├── panel/                      (Robcast-panel actual)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   │   └── AdminApiService.js ⚠️ ACTUALIZAR URLs
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml          🆕 Unificado (MariaDB + 3 servicios)
├── .env                        🆕 Configuración centralizada
└── README.md                   🆕 Documentación
```

---

## 🗄️ BASE DE DATOS UNIFICADA (MariaDB)

### Tablas Necesarias

**1. Autenticación y Usuarios**
- `usuarios` - Clientes y administradores
- `auditorias` - Historial de cambios

**2. Productos y Catálogo**
- `productos` - Datos de productos
- `categorias` - Clasificación de productos
- `imagenes_productos` - Galería de imágenes

**3. Compras y Ventas**
- `ventas` - Órdenes de compra
- `detalle_ventas` - Items en cada orden
- `carrito` - Carrito temporal

**4. Post-Venta**
- `envios` - Información de envío
- `facturas` - Documentos de facturación
- `cupones` - Descuentos y promociones

**5. Solicitud de Servicio (si aplica)**
- `solicitudes` - Contactos/cotizaciones

---

## 🔧 CONFIGURACIÓN URLS API

### Problema Actual
```
ApiService.js:        http://localhost:3001/api/productos
AdminApiService.js:   http://localhost:3001/api/productos
Robcast-API routes:   http://localhost:3001/productos (sin /api)
```

### Solución
Las rutas de API están **correctas en Robcast-API**, pero los servicios de frontend esperan `/api/`. 

**Opciones:**
1. **Opción A** - Crear prefijo `/api` en server.js (recomendado para escalabilidad)
2. **Opción B** - Cambiar los servicios del frontend a rutas sin `/api`

→ **Elegimos Opción A** para mejor arquitectura

---

## 🖥️ PRUEBA LOCAL (Windows 11)

### Requisitos
- Docker Desktop (ya instalado)
- Node.js 20+
- Git

### Pasos para Local

1. **Crear docker-compose.yml centralizado**
   - MariaDB 10.5 (compatible CPU)
   - Robcast-API (backend) - puerto 3001
   - Robcast tienda (frontend) - puerto 5173
   - Robcast-panel admin (frontend) - puerto 5174

2. **Configurar variables de entorno**
   - .env en raíz con credenciales DB
   - .env en cada servicio si es necesario

3. **Actualizar server.js**
   - Agregar prefijo `/api` a las rutas
   - Configurar CORS para los 3 servicios

4. **Actualizar endpoints en frontends**
   - ApiService.js mantenga `http://localhost:3001/api`
   - AdminApiService.js mantenga `http://localhost:3001/api`

5. **Pruebas locales**
   - Health check: http://localhost:3001/api/health
   - Login tienda: POST http://localhost:3001/api/auth/login
   - Panel admin: http://localhost:5174
   - Tienda: http://localhost:5173

---

## 🚀 MIGRACIÓN A ROCKY LINUX 8

### Cambios mínimos
- Docker Compose comandos iguales
- Solo cambiar URLs de `localhost` a IP del servidor
- Variables de entorno (credenciales DB, JWT_SECRET, etc)

### Estructura en servidor
```
/home/usuario/robcast-proyecto/
├── docker-compose.yml
├── .env              (credenciales seguras)
├── backend/
├── tienda/
└── panel/
```

---

## 📋 TODO LIST

### Fase 1: Análisis y Preparación
- [ ] Revisar todas las rutas API existentes
- [ ] Documentar estructura de datos actual
- [ ] Listar todos los endpoints usados

### Fase 2: Configuración Backend
- [ ] Actualizar server.js con prefijo `/api`
- [ ] Verificar todas las rutas con `/api`
- [ ] Actualizar docker-compose.yml (MariaDB)
- [ ] Crear .env centralizado

### Fase 3: Frontend - Tienda
- [ ] Verificar ApiService.js apunte a /api
- [ ] Probar login y carrito
- [ ] Probar CRUD de productos

### Fase 4: Frontend - Panel
- [ ] Verificar AdminApiService.js apunte a /api
- [ ] Probar dashboard
- [ ] Probar CRUD admin

### Fase 5: Pruebas Integración Local
- [ ] Ambos frontends comunicándose con misma BD
- [ ] Crear producto en panel → ver en tienda
- [ ] Comprar en tienda → ver en panel
- [ ] Gestionar usuarios desde panel → logueo en tienda

### Fase 6: Documentación Rocky Linux
- [ ] Script de instalación
- [ ] Guía de deployment
- [ ] Proceso de actualización

---

## 🔐 SEGURIDAD

### Credenciales por Entorno
```
# .env local (Windows)
DB_PASSWORD=local123
JWT_SECRET=dev_key_insegura

# .env servidor (Rocky Linux)
DB_PASSWORD=<generada_aleatória_fuerte>
JWT_SECRET=<generada_aleatória_fuerte>
NODE_ENV=production
```

### CORS Configuration
- Local: localhost:5173, localhost:5174, localhost:3001
- Producción: IP servidor, dominio si existe

---

## 📊 ENDPOINTS API UNIFICADOS

```javascript
// Autenticación (público)
POST   /api/auth/login
POST   /api/auth/registro
GET    /api/auth/verificar

// Productos (público lectura, restringido escritura)
GET    /api/productos
GET    /api/productos/:id
POST   /api/productos         (requiere admin)
PUT    /api/productos/:id     (requiere admin)
DELETE /api/productos/:id     (requiere admin)

// Usuarios
POST   /api/usuarios/registrarse
GET    /api/usuarios/perfil
PUT    /api/usuarios/perfil

// Ventas
GET    /api/ventas
POST   /api/ventas
GET    /api/ventas/:id
PUT    /api/ventas/:id

// Admin
GET    /api/admin/productos
GET    /api/admin/ventas
GET    /api/admin/clientes
GET    /api/admin/reportes/resumen
GET    /api/admin/reportes/ventas-por-periodo
POST   /api/admin/cupones
```

---

## ✅ RESULTADO ESPERADO

✅ Una base de datos unificada (MariaDB)
✅ Una API centralizada (Robcast-API con prefijo /api)
✅ Tienda y Panel conectados a mismos datos
✅ Funcional en Windows 11 local
✅ Listo para deploy en Rocky Linux 8
✅ Seguro, escalable y mantenible

---

**Estado:** Listo para iniciar Fase 1
**Estimado:** 6-8 horas de trabajo total
