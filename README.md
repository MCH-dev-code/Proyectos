# 🛍️ Robcast E-commerce - Página Web + API + Panel de Control

Plataforma e-commerce completa con arquitectura de microservicios containerizada para Rocky Linux 8.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Frontend React (Vite) + Nginx                             │
│  - Página principal con productos dinámicos               │
│  - Tienda con filtros y carrito                            │
│  - Autenticación de usuarios                               │
│  - Mi Perfil, Mis Órdenes, Wishlist                       │
│                                                             │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────────────────────────┐
│                                                             │
│  Backend API (Node.js + Express)                           │
│  - /api/productos (CRUD)                                  │
│  - /api/usuarios (Auth, Perfil)                           │
│  - /api/ventas (Órdenes, Facturas)                        │
│  - /api/reportes (Estadísticas)                           │
│                                                             │
└────────────────┬────────────────────────────────────────────┘
                 │ MySQL Protocol
┌────────────────▼────────────────────────────────────────────┐
│                                                             │
│  Base de Datos MySQL                                       │
│  - Usuarios (con puntos de lealtad)                       │
│  - Productos (dinámicos, actualizables)                   │
│  - Ventas (órdenes, detalles, estado)                     │
│  - Favoritos/Wishlist                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Componentes

### Frontend
- **React 19** con Vite
- **Tailwind CSS** para estilos
- **Context API** para estado global
- **Responsive** (Mobile, Tablet, Desktop)

### Backend
- **Node.js 18** con Express
- **MySQL 8** como BD
- **JWT** para autenticación
- **CORS** habilitado

### Base de Datos
Tablas:
- `usuarios` - Cuentas con puntos de lealtad
- `productos` - Catálogo actualizable desde panel
- `ventas` - Órdenes de clientes
- `detalle_ventas` - Items de cada orden
- `favoritos` - Wishlist de usuarios

## 🚀 Quick Start

### Requisitos
- Docker & Docker Compose
- Rocky Linux 8 (o cualquier Linux)

### Pasos

```bash
# 1. Clonar/descargar proyecto
git clone <repo> && cd Proyectos

# 2. Levantar infraestructura
docker-compose build
docker-compose up -d

# 3. Verificar estado
docker-compose ps
curl http://localhost/api/health

# 4. Acceder
Frontend  → http://localhost
API       → http://localhost:3001
```

## 📚 Documentación Completa

Ver [DEPLOY_ROCKY_LINUX.md](./DEPLOY_ROCKY_LINUX.md) para:
- Instalación en Rocky Linux 8
- Configuración de variables de entorno
- Monitoreo y logs
- Solución de problemas
- URLs de producción
- Deploy automático

## 📱 Funcionalidades

### Para Usuarios
✅ Registro e inicio de sesión  
✅ Ver productos dinámicos de la BD  
✅ Agregar al carrito (solo logueados)  
✅ Wishlist/Favoritos  
✅ Mi Perfil editable  
✅ Mis Órdenes con estado de entrega  
✅ Puntos de lealtad  
✅ Contacto por WhatsApp  

### Para Vendedores/Admin
✅ Panel de control (en Robcast-panel)  
✅ CRUD de productos  
✅ Actualizar stock y precios  
✅ Ver historial de ventas  
✅ Reportes de ingresos  
✅ Gestionar estado de órdenes  

## 🔌 API Endpoints

### Productos
```bash
GET    /api/productos              # Listar todos
GET    /api/productos/:id          # Detalles
POST   /api/productos              # Crear (admin)
PUT    /api/productos/:id          # Actualizar (admin)
DELETE /api/productos/:id          # Eliminar (admin)
```

### Usuarios
```bash
POST   /api/usuarios/registrarse           # Crear cuenta
POST   /api/usuarios/iniciar-sesion        # Login
GET    /api/usuarios/perfil                # Mi perfil (protegido)
PUT    /api/usuarios/perfil                # Actualizar (protegido)
```

### Ventas
```bash
POST   /api/ventas                 # Nueva orden (protegido)
GET    /api/ventas                 # Mis órdenes (protegido)
GET    /api/ventas/:id             # Detalles orden (protegido)
PUT    /api/ventas/:id/estado      # Cambiar estado (admin)
GET    /api/ventas/reportes/estadisticas  # Stats (admin)
```

## 🗂️ Estructura de Carpetas

```
Proyectos/
├── docker-compose.yml
├── DEPLOY_ROCKY_LINUX.md
│
├── Robcast/                    # Frontend React + Vite
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── src/
│   │   ├── main.jsx
│   │   ├── Principal.jsx
│   │   ├── context/
│   │   │   ├── UsuarioContext.jsx
│   │   │   ├── CarritoContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── services/
│   │   │   └── ApiService.js     # Cliente HTTP
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── Navbar.jsx
│   │       ├── ProductCatalog.jsx
│   │       ├── Sesion.jsx
│   │       └── ...
│   └── package.json
│
├── Robcast-API/                # Backend Node.js/Express
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── controllers/
│   │   │   ├── productosController.js
│   │   │   ├── usuariosController.js
│   │   │   └── ventasController.js
│   │   └── routes/
│   │       ├── productos.js
│   │       ├── usuarios.js
│   │       └── ventas.js
│   └── .env
│
└── Robcast-panel/              # Panel de control (opcional)
    ├── setup_database.sql
    └── ...
```

## 🔧 Configuración

### Variables de Entorno (.env)

```env
# Base de datos
DB_HOST=mysql
DB_PORT=3306
DB_USER=robcast_user
DB_PASSWORD=robcast_password_123
DB_NAME=robcast_db

# API
API_PORT=3001
NODE_ENV=production
JWT_SECRET=tu_secreto_cambiar_en_produccion
FRONTEND_URL=http://localhost
```

## 📊 Base de Datos

### Esquema

**usuarios**
```sql
id, nombre, email, password_hash, telefono,
direccion, metodo_pago, puntos, fecha_registro
```

**productos**
```sql
id, nombre, precio, stock, descripcion,
imagen, created_at, updated_at, deleted_at
```

**ventas**
```sql
id, usuario_id, total, direccion, estado,
created_at, updated_at
```

**detalle_ventas**
```sql
id, venta_id, producto_id, cantidad,
precio_unitario, created_at
```

## 🛡️ Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación stateless
- ✅ CORS configurado
- ✅ Validación en backend
- ✅ Soft delete en productos
- ✅ Transacciones de BD

## 📈 Ejemplo de Flujo

1. **Usuario se registra**
   - POST `/api/usuarios/registrarse`
   - Contraseña hasheada, recibe JWT
   - Token guardado en localStorage

2. **Usuario ve productos**
   - GET `/api/productos` (sin auth)
   - ProductCatalog carga desde BD
   - Datos dinámicos, actualizables

3. **Usuario compra**
   - Agrega al carrito (local)
   - POST `/api/ventas` con JWT
   - Se crea orden, descontar stock
   - Se agregan puntos de lealtad

4. **Admin actualiza producto**
   - Panel: PUT `/api/productos/:id`
   - Cambios visibles en tiempo real
   - Stock automáticamente actualizado

## 🚨 Troubleshooting

### Productos no cargan
```bash
docker-compose logs api
# Verificar conexión a BD
```

### Login no funciona
```bash
# Verificar tabla usuarios en MySQL
docker exec -it robcast-mysql mysql -u robcast_user -p robcast_db
SELECT * FROM usuarios;
```

### Nginx no sirve archivos estáticos
```bash
docker-compose logs frontend
# Reconstruir: docker-compose up -d --build frontend
```

## 📞 Soporte

Para más detalles, ver:
- `DEPLOY_ROCKY_LINUX.md` - Deploy y administración
- API docs en `/src/routes/`
- Componentes en `/Robcast/src/components/`

## 📄 Licencia

MIT

---

**¡Tu tienda online lista para producción! 🎉**
