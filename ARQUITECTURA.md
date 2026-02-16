# ARQUITECTURA DEL PROYECTO - VISUAL REFERENCE

## 🏗️ COMPONENTES DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INTERNET / USUARIOS                          │
└─────────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴──────────┐
                    │                    │
         ┌──────────▼────────┐  ┌────────▼──────────┐
         │  Frontend (React) │  │  Admin (React)    │
         │  Port: 5173       │  │  Port: 5174       │
         │  http://frontend  │  │  http://admin     │
         └──────────┬────────┘  └────────┬──────────┘
                    │ (browser)          │ (browser)
                    │ hot reload         │ hot reload
                    │                    │
        ┌───────────┴────────────────────┴──────────┐
        │                                           │
        │        DOCKER NETWORK (internal)          │
        │                                           │
        │  ┌──────────────────────────────────────┐ │
        │  │       Node.js API                    │ │
        │  │  Port: 3001 (/api/...)               │ │
        │  │  - productos                         │ │
        │  │  - usuarios (login, register)        │ │
        │  │  - ventas                            │ │
        │  │  - opiniones                         │ │
        │  │  - lealtad                           │ │
        │  └──────────────┬───────────────────────┘ │
        │                 │                         │
        │  ┌──────────────▼───────────────────────┐ │
        │  │        MySQL Database                │ │
        │  │  - usuarios (5 columns)              │ │
        │  │  - productos (6 columns)             │ │
        │  │  - ventas (4 columns)                │ │
        │  │  - detalle_ventas (4 columns)        │ │
        │  │                                      │ │
        │  │  Volume: mysql_data                  │ │
        │  │  (persistencia de datos)             │ │
        │  └──────────────────────────────────────┘ │
        │                                           │
        └───────────────────────────────────────────┘
                              ▲
                              │
                         Producción
                         (opcional)
                              │
                    ┌─────────┴──────────┐
                    │                    │
         ┌──────────▼────────┐  ┌────────▼──────────┐
         │  Nginx Proxy      │  │  SSL Certificate  │
         │  Port: 80, 443    │  │  Let's Encrypt    │
         │  Cache + GZIP     │  │  (si tiene        │
         │                   │  │   dominio)        │
         └───────────────────┘  └───────────────────┘
```

---

## 🔌 FLUJO DE DATOS (Ejemplo: Crear Venta)

```
1. USUARIO EN FRONTEND
   └─ Click "Confirmar Compra"
      │
      ├─ Carrito guardado en localStorage/Context
      │  {items: [{id: 1, qty: 2}, ...]}
      │
      └──▶ POST /api/ventas/crear
          (Header: Authorization: Bearer JWT_TOKEN)
          (Body: {carrito: [...], monto_total: 1799.98})

2. EN EL BACKEND (Node.js)
   └─ Recibe petición POST
      │
      ├─ Verifica JWT token es válido
      ├─ Obtiene usuario_id del token
      ├─ Inserta en tabla "ventas"
      ├─ Inserta en tabla "detalle_ventas" (items)
      ├─ Actualiza stock en tabla "productos"
      ├─ Suma puntos de lealtad al usuario
      │
      └──▶ Responde con {id: 1, total: 1799.98, estado: "pendiente"}

3. EN LA BD (MySQL)
   └─ Guardó:
      ├─ ventas: 1 fila nueva
      ├─ detalle_ventas: 2-3 filas nuevas
      ├─ productos: stock actualizado
      └─ usuarios: puntos_lealtad actualizado

4. DE VUELTA AL FRONTEND
   └─ Recibe respuesta exitosa
      │
      ├─ Borra carrito del localStorage
      ├─ Muestra "Compra exitosa!"
      └─ Redirige a /historial-compras
```

---

## 🔐 FLUJO DE AUTENTICACIÓN

```
1. REGISTRO (Usuario nuevo)
   └─ Frontend: POST /auth/register
      ├─ Backend: Hash contraseña con bcrypt
      ├─ Backend: Guarda en tabla usuarios
      ├─ Backend: Genera JWT token
      └─ Frontend: Guarda token en localStorage
                   {
                     id: 1,
                     nombre: "Juan",
                     token: "eyJhbGciOiJIUzI1NiIs..." ← 24 horas validez
                   }

2. LOGIN (Usuario existente)
   └─ Frontend: POST /auth/login
      ├─ Backend: Busca usuario por email
      ├─ Backend: Compara contraseña con bcrypt
      ├─ Backend: Genera JWT token
      └─ Frontend: Guarda token en localStorage

3. SOLICITUDES AUTENTICADAS
   └─ Frontend: GET /api/usuarios/perfil
      ├─ Header: Authorization: Bearer TOKEN
      ├─ Backend: Verifica JWT (firma + expiración)
      ├─ Backend: Extrae usuario_id del JWT
      ├─ Backend: Devuelve datos del usuario
      └─ Frontend: Muestra datos en el context

4. TOKEN EXPIRADO
   └─ Frontend intenta request con token viejo
      ├─ Backend: Error 401 Unauthorized
      ├─ Frontend: Borra token del localStorage
      ├─ Frontend: Redirige a login
      └─ Usuario debe iniciar sesión de nuevo
```

---

## 📦 ESTRUCTURA DE ARCHIVOS (RESUMIDA)

```
Robcast/                          ← FRONTEND
├── src/
│   ├── App.jsx                   (Componente principal)
│   ├── Principal.jsx             (Shell con contextos)
│   ├── main.jsx                  (Entrada React)
│   ├── components/
│   │   ├── Header.jsx            (Navbar, carrito)
│   │   ├── ProductCatalog.jsx    (Listado de productos)
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── context/
│   │   ├── UsuarioContext.jsx    (Auth + perfil)
│   │   ├── CarritoContext.jsx    (Carrito de compras)
│   │   └── WishlistContext.jsx   (Favoritos)
│   ├── services/
│   │   └── ApiService.js         (HTTP client para API)
│   └── pages/
│       ├── Historial.jsx
│       ├── Perfil.jsx
│       └── ...
├── Dockerfile                    (Prod: build + Nginx)
├── Dockerfile.dev                (Dev: Node + hot reload)
├── nginx.conf                    (Proxy config)
└── package.json

Robcast-API/                      ← BACKEND
├── src/
│   ├── server.js                 (Entrada Express)
│   ├── config/
│   │   └── database.js           (Pool MySQL)
│   ├── middleware/
│   │   └── auth.js               (JWT verification)
│   ├── controllers/
│   │   ├── productosController.js (CRUD productos)
│   │   ├── usuariosController.js  (Auth + perfil)
│   │   └── ventasController.js    (Pedidos)
│   ├── routes/
│   │   ├── productos.js          (GET /api/productos)
│   │   ├── usuarios.js           (POST /api/auth/login)
│   │   └── ventas.js             (POST /api/ventas/crear)
│   └── sql/
│       └── schema.sql            (Tabla creation)
├── Dockerfile                    (Node Alpine)
├── Dockerfile.prod               (Optimizado)
├── .env.example                  (Template vars)
└── package.json

Robcast-panel/                    ← ADMIN
├── src/
│   ├── App.jsx                   (Router)
│   ├── main.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx         (Stats KPI)
│   │   ├── Productos.jsx         (CRUD productos)
│   │   └── Ventas.jsx            (Cambiar estado)
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── services/
│   │   └── AdminApiService.js    (HTTP client admin)
│   └── ...
├── Dockerfile                    (Vite + Nginx)
├── index.html
├── vite.config.js
└── package.json

.                                 ← ROOT
├── docker-compose.yml            (Prod: 3 servicios)
├── docker-compose.dev.yml        (Dev: hot reload, ports)
├── .gitignore                    (Excluye .env, node_modules)
├── manage.sh                     (CLI para Docker)
├── push.sh                       (Git commit + push)
├── health-check.sh               (Verificar servicios)
├── deploy-server.sh              (Auto-deploy script)
│
└── DOCUMENTOS/
    ├── README.md                 (Visión general)
    ├── QUICK_START.md            (Comandos rápidos)
    ├── WORKFLOW_GIT_DOCKER.md    (Dev → Git → Prod)
    ├── SERVER_SETUP.md           (Config inicial servidor)
    ├── DEPLOY_ROCKY_LINUX.md     (Deploy detallado)
    ├── API_REFERENCE.md          (Endpoints)
    ├── ESTADO_FINAL.md           (Checklist)
    └── DOCUMENTACION_FINAL.md    (Este documento)
```

---

## 🚀 CICLO DE DESARROLLO

```
DÍA 1-3: DESARROLLO LOCAL
   ├─ Editar código en VSCode
   ├─ Docker: Hot reload automático
   ├─ Probar en navegador (localhost:5173)
   └─ Commit cuando algo funciona: git add . && ./push.sh

DÍA 4-5: TESTING
   ├─ ./health-check.sh (verifica todo)
   ├─ Crear cuenta de prueba
   ├─ Hacer compra de prueba
   ├─ Usar panel admin
   └─ Revisar logs: docker-compose logs -f

VIERNES: DEPLOY A PRODUCCIÓN
   ├─ En servidor: git pull origin main
   ├─ docker-compose build
   ├─ docker-compose up -d
   ├─ Verificar: curl http://TU_IP:3001/api/health
   └─ Probar en navegador (tu dominio)
```

---

## 🔄 FLUJO DE VERSIONES (Git)

```
REPOSITORIO LOCAL
       ↓
    git add .
    git commit -m "Feature: Nuevo carrito"
       ↓
   GitHub (Remote)
       ↓
  GitHub Webhook
       ↓
SERVIDOR PRODUCCIÓN
       ↓
   docker-compose up -d --build
       ↓
   TU SITIO ACTUALIZADO ✓
```

---

## 🛡️ CAPAS DE SEGURIDAD

```
┌─────────────────────────────────────┐
│  USUARIO EN NAVEGADOR               │
└────────────────────┬────────────────┘
                     │
        ┌────────────▼──────────────┐
        │  HTTPS/SSL (opcional)     │ ← Encripta conexión
        │  localhost o dominio      │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │  JWT Token Verificado     │ ← Solo usuarios autenticados
        │  (Header Authorization)   │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │  Middleware Auth.js       │ ← Valida firma HMAC
        │  Extrae usuario_id        │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │  Controladores            │ ← Lógica de negocio
        │  (Validación inputs)      │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │  MySQL Database           │ ← Datos cifrados
        │  (Contraseñas con bcrypt) │
        └───────────────────────────┘
```

---

## 📊 DATOS EN LA BASE DE DATOS

```sql
-- TABLA: usuarios
┌────────┬─────────┬──────────────┬──────────────────────┬─────────────┐
│ id     │ nombre  │ email        │ contraseña_hash      │ puntos      │
├────────┼─────────┼──────────────┼──────────────────────┼─────────────┤
│ 1      │ Juan    │ juan@test.com│ $2b$10$abcd...      │ 250         │
│ 2      │ María   │ maria@...    │ $2b$10$xyz...       │ 100         │
└────────┴─────────┴──────────────┴──────────────────────┴─────────────┘

-- TABLA: productos
┌────┬──────────┬────────┬────────┬──────────┬─────────────────┐
│ id │ nombre   │ precio │ stock  │ imagen   │ categoria       │
├────┼──────────┼────────┼────────┼──────────┼─────────────────┤
│ 1  │ Laptop   │ 899.99 │ 25     │ lap.jpg  │ electronica     │
│ 2  │ Mouse    │ 29.99  │ 100    │ mouse.jpg│ accesorios      │
└────┴──────────┴────────┴────────┴──────────┴─────────────────┘

-- TABLA: ventas
┌────┬──────────┬────────┬──────────┬────────────────────┐
│ id │ usuario  │ total  │ estado   │ fecha              │
├────┼──────────┼────────┼──────────┼────────────────────┤
│ 1  │ 1        │ 1799.98│ pendiente│ 2024-01-15 10:30  │
└────┴──────────┴────────┴──────────┴────────────────────┘

-- TABLA: detalle_ventas
┌────┬──────────┬───────┬──────────────┬────────────┐
│ id │ venta_id │ prod  │ cantidad     │ precio_u   │
├────┼──────────┼───────┼──────────────┼────────────┤
│ 1  │ 1        │ 1     │ 2            │ 899.99     │
└────┴──────────┴───────┴──────────────┴────────────┘
```

---

## 🔌 PUERTOS UTILIZADOS

| Servicio | Puerto | Acceso | Propósito |
|----------|--------|--------|-----------|
| MySQL | 3306 | Interno | Base de datos |
| API Node | 3001 | http://localhost:3001 | REST API |
| Frontend Dev | 5173 | http://localhost:5173 | React dev server |
| Admin Dev | 5174 | http://localhost:5174 | Admin dev server |
| Nginx Prod | 80 | http://localhost | Frontend + proxy |
| HTTPS | 443 | https://dominio.com | SSL/TLS |
| Webhook | 9000 | http://servidor:9000 | Auto deploy (opt) |

---

## 💾 PERSISTENCIA DE DATOS

```
┌──────────────────────┐
│  Docker Volumes      │
├──────────────────────┤
│  mysql_data/         │ ← Datos MySQL (permanente)
│  ├─ ibdata1          │   (no se pierde si paras containers)
│  ├─ robcast_db/
│  └─ ...
│                      │
│  node_modules/       │ ← Cached en build
│  dist/               │ ← Build output
│  .env                │ ← NO SUBIR A GIT
│                      │
└──────────────────────┘
```

---

## 🎯 CASOS DE USO TÍPICOS

### 1. CLIENTE HACE COMPRA
```
Navega → Ve productos → Agrega al carrito → Login/Registra →
Compra → Pago (simulado) → Orden creada → Email de confirmación (futuro)
```

### 2. VENDEDOR MANAGE PRODUCTOS
```
Entra a admin → Dashboard ve estadísticas →
Seción Productos → Crea nuevo → Edita existente →
Seción Ventas → Ve orden nueva → Cambia a "confirmado" →
Cliente ve estado actualizado en histórico
```

### 3. GANADOR ACUMULA PUNTOS
```
Hace compra de $100 → Gana 100 puntos → Puede canjear →
Descuento de $10 → Stock de puntos baja
```

---

## 📈 ESCALABILIDAD FUTURA

```
AHORA (Single Server)
    └─ 1 servidor: Todo junto (MySQL + API + Frontend)

FUTURO (Multiple Servers)
    ├─ Server 1: MySQL (BD centralizada)
    ├─ Server 2: API (Node.js)
    ├─ Server 3: Frontend (Nginx)
    ├─ Server 4: Admin (Nginx)
    ├─ Cache: Redis (speedup)
    ├─ CDN: CloudFlare (imágenes)
    └─ Load Balancer: Nginx (distribuir carga)
```

---

**Esta arquitectura soporta:**
- ✅ Decenas de órdenes diarias
- ✅ Cientos de productos
- ✅ Millones que operaciones

**Para más detalles, revisar la documentación específica.** 📚
