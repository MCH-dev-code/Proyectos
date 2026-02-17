# 🚀 ROBCAST - GUÍA DE INSTALACIÓN LOCAL (Windows 11)

## 📋 Requisitos Previos

- **Docker Desktop** (instalado y ejecutándose)
- **Git** (para clonar/actualizar)
- **Node.js 20+** (opcional, para desarrollo local sin Docker)
- **Windows 11** con WSL2 habilitado

## 🎯 Configuración Rápida (5 minutos)

### 1. Preparar el Proyecto

```bash
# Navegar a la carpeta del proyecto
cd c:\Proyectos\Proyectos

# Verificar que exista el .env
type .env

# Si no existe, crear desde template
copy .env.template .env
```

### 2. Iniciar Todo con Docker Compose

```bash
# Ejecutar desde la raíz del proyecto
docker-compose -f docker-compose.local.yml up -d

# Ver logs (opcional)
docker-compose -f docker-compose.local.yml logs -f
```

### 3. Verificar que Todo Esté Corriendo

```bash
# Ver estado de contenedores
docker-compose -f docker-compose.local.yml ps

# Esperar ~30 segundos para que se inicialice la BD y luego probar:
# API Health Check
curl http://localhost:3001/health
curl http://localhost:3001/api/health

# Base de datos (mostrar tablas)
docker exec robcast-db-local mysql -u robcast_user -probcast_password_123 robcast_db -e "SHOW TABLES;"
```

## 🌐 Acceso a Aplicaciones

Una vez que todo está corriendo:

| Aplicación | URL | Puerto |
|-----------|-----|--------|
| 🏪 **Tienda** | http://localhost:5173 | 5173 |
| 👨‍💼 **Panel Admin** | http://localhost:5174 | 5174 |
| 🔌 **API** | http://localhost:3001 | 3001 |
| 🗄️ **Base de Datos** | localhost:3306 | 3306 |

## 🧪 Pruebas Básicas

### 1. Login Admin desde la Tienda

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@robcast.com.do",
    "password":"admin123"
  }'

# Respuesta esperada: JSON con token JWT
```

### 2. Acceder al Panel Admin

```
http://localhost:5174
Usuario: admin@robcast.com.do
Contraseña: admin123
```

### 3. Ver Dashboard de Admin

```bash
# Obtener el token del login anterior
TOKEN="<copiar_token_del_login>"

# Acceder al dashboard
curl -X GET http://localhost:3001/api/admin/reportes/resumen \
  -H "Authorization: Bearer $TOKEN"
```

## 🛠️ Desarrollo Local (Sin Docker)

### Backend - Robcast-API

```bash
cd Robcast-API
npm install
npm run dev
# API corriendo en http://localhost:3001
```

### Frontend - Tienda

```bash
cd Robcast
npm install
npm run dev
# Tienda en http://localhost:5173
```

### Frontend - Panel

```bash
cd Robcast-panel
npm install
npm run dev
# Panel en http://localhost:5174
```

> **Nota:** Si ejecutas sin Docker, necesitas MariaDB iniciado localmente o en otro contenedor.

## 📊 Acceso a Base de Datos

### Desde Host

```bash
# Conectar a MariaDB desde Windows
mysql -h localhost -u robcast_user -probcast_password_123 -D robcast_db

# Ver tablas
SHOW TABLES;

# Ver usuarios
SELECT * FROM usuarios;
```

### Dentro del Contenedor

```bash
# Acceso directo
docker exec -it robcast-db-local mysql -u robcast_user -probcast_password_123 robcast_db

# Ver información
SHOW TABLES;
SELECT COUNT(*) as total_usuarios FROM usuarios;
```

## 🐳 Comandos Útiles Docker

```bash
# Ver logs de un servicio específico
docker-compose -f docker-compose.local.yml logs api
docker-compose -f docker-compose.local.yml logs db
docker-compose -f docker-compose.local.yml logs tienda
docker-compose -f docker-compose.local.yml logs panel

# Ejecutar comando en contenedor
docker exec robcast-api-local npm run dev

# Reiniciar servicio específico
docker-compose -f docker-compose.local.yml restart api

# Detener todo
docker-compose -f docker-compose.local.yml down

# Eliminar volúmenes (¡PELIGRO! Elimina BD)
docker-compose -f docker-compose.local.yml down -v
```

## ⚙️ Variables de Entorno

Editar `.env` en la raíz para cambiar:

```env
# Base de datos
DB_USER=robcast_user
DB_PASSWORD=robcast_password_123
DB_NAME=robcast_db

# JWT
JWT_SECRET=jwt_secret_development_insegura_cambiar_en_produccion_123456789

# URLs
VITE_API_URL=http://localhost:3001/api
FRONTEND_TIENDA_URL=http://localhost:5173
FRONTEND_PANEL_URL=http://localhost:5174
```

## 🔧 Solución de Problemas

### "Port 3001 is already in use"
```bash
# Cambiar puerto en docker-compose.local.yml
# Línea: - "3001:3001"  →  - "3002:3001"
```

### "Base de datos no se conecta"
```bash
# Esperar a que MariaDB inicie completamente
docker logs robcast-db-local

# Reiniciar BD
docker-compose -f docker-compose.local.yml restart db
```

### "CORS Error en navegador"
```
Verificar que VITE_API_URL sea http://localhost:3001/api
(sin puerto 3001 duplicado)
```

### "npm ERR! peer dep missing"
```bash
cd Robcast-panel
npm install --legacy-peer-deps
```

## 📦 Estructura de Carpetas Local

```
c:\Proyectos\Proyectos\
├── .env                    ← Configuración compartida
├── .env.template           ← Template de variables
├── docker-compose.local.yml ← Orquestación local
├── init-db.sql             ← Script inicialización BD
├── PLAN_UNIFICACION_BD.md  ← Documento de arquitectura
│
├── Robcast-API/            ← Backend Express
│   ├── src/server.js       (Rutas con /api)
│   ├── Dockerfile
│   └── src/routes/
│
├── Robcast/                ← Frontend Tienda
│   ├── src/services/ApiService.js
│   ├── Dockerfile
│   └── vite.config.js
│
└── Robcast-panel/          ← Frontend Panel
    ├── src/services/AdminApiService.js
    ├── Dockerfile.frontend
    └── vite.config.js
```

## 🚀 Próximo Paso: Rocky Linux

Cuando esté funcionando perfectamente localmente, ver:
- `PLAN_UNIFICACION_BD.md` - Sección "Migración a Rocky Linux 8"
- Cambiar URLs de localhost a IP del servidor (192.168.0.19)
- Usar mismo `docker-compose.local.yml` con variables de entorno del servidor

---

**Estado:** ✅ Listo para uso local
**Última actualización:** 2024
**Soporte:** Verificar logs con `docker-compose logs`
