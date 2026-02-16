# 🚀 Robcast - Sistema de Gestión Empresarial

## 📋 Descripción
Robcast es una aplicación web moderna para la gestión de inventario, facturación y ventas. Combina un **frontend React** con **backend Express** y **MySQL**.

---

## 🛠️ Requisitos Previos
- **Node.js** v18+ ([Descargar](https://nodejs.org))
- **MySQL** 8.0+ ([Descargar](https://www.mysql.com/downloads/mysql/))
- **npm** (incluido con Node.js)

---

## ⚙️ Instalación y Configuración

### 1️⃣ Clonar/Descargar el Proyecto
```bash
cd Robcast
```

### 2️⃣ Configurar la Base de Datos MySQL

#### Opción A: Usar MySQL Workbench o phpMyAdmin
1. Abre tu cliente MySQL
2. Copia y ejecuta el contenido de `setup_database.sql`

#### Opción B: Usar línea de comando
```bash
mysql -u root -p < setup_database.sql
```

### 3️⃣ Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (si no existe)
# En Windows:
type ..\.env
# En Mac/Linux:
cat ../.env

# Si necesitas editar .env, agrega tu contraseña de MySQL si es requerida:
# DB_PASSWORD=tu_contrasena_mysql
```

### 4️⃣ Configurar Frontend

```bash
# Volver a la carpeta raíz
cd ..

# Instalar dependencias
npm install
```

---

## 🚀 Ejecutar el Proyecto

### Terminal 1: Backend
```bash
cd backend
npm start
# o manualmente:
node server.cjs
```
✅ Debe mostrar: `✅ Backend Robcast en puerto 3001`

### Terminal 2: Frontend
```bash
npm run dev
```
✅ Debe abrir: `http://localhost:5173` (o el puerto que Vite indique)

---

## 📊 Funcionalidades Implementadas

| Módulo | Estado | Descripción |
|--------|--------|------------|
| **Dashboard** | ✅ | Resumen con estadísticas en tiempo real |
| **Productos** | ✅ | CRUD completo con imágenes |
| **Clientes** | ✅ | Gestión de clientes |
| **Ventas** | ✅ | Sistema de carrito y procesamiento |
| **Facturas** | 🔄 | Interfaz lista |
| **Pedidos** | 🔄 | Interfaz lista |
| **Envíos** | 🔄 | Interfaz lista |

---

## 🔌 API Endpoints

### Productos
- `GET /productos` - Listar todos
- `POST /productos` - Crear
- `PUT /productos/:id` - Actualizar
- `DELETE /productos/:id` - Eliminar

### Clientes
- `GET /clientes` - Listar todos
- `POST /clientes` - Crear
- `DELETE /clientes/:id` - Eliminar

### Ventas
- `GET /ventas` - Listar todas
- `POST /ventas` - Crear nueva venta

### Estadísticas
- `GET /stats/summary` - Resumen general

---

## 🔧 Variables de Entorno (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=robcast_db
```

---

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 19.2** - Librería UI
- **Vite 8** - Build tool
- **React Router 7.13** - Navegación
- **Tailwind CSS 4** - Estilos
- **Lucide React** - Iconografía
- **React Sparklines** - Gráficos

### Backend
- **Express 5.2** - Framework HTTP
- **MySQL2** - Driver de base de datos
- **CORS** - Permisos cross-origin
- **dotenv** - Gestión de variables

---

## 🐛 Solución de Problemas

### Error: "Cannot GET /productos"
- ✅ Asegúrate de ejecutar el backend en Terminal 1
- ✅ Verifica que el puerto 3001 esté disponible

### Error de conexión MySQL
- ✅ Verifica que MySQL está ejecutándose
- ✅ Comprueba credenciales en `.env`
- ✅ Ejecuta `setup_database.sql`

### Frontend no conecta con Backend
- ✅ Abre DevTools (F12) → Consola
- ✅ Verifica que no hay errores de CORS
- ✅ Backend debe estar en `http://localhost:3001`

### Puerto 3001 ya está en uso
```bash
# En Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# En Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

---

## 📝 Notas Importantes

1. **Primera ejecución**: Ejecuta `setup_database.sql` para crear tablas
2. **Hot Reload**: El frontend recarga automáticamente en cambios
3. **Backend**: Requiere restart manual para cambios en código
4. **CORS**: Ya está habilitado para `localhost:5173`

---

## 📞 Soporte
Para reportar issues o sugerencias, usa el sistema de issues del repositorio.

**¡Disfruta de Robcast! 🎉**
