# 📋 INSTRUCCIONES DE INSTALACIÓN - MEJORAS ROBCAST

## ⚡ NUEVO - Archivos Creados

Se han creado los siguientes archivos nuevos que necesitas **copiar/mover al servidor o incluir en tu próximo git push**:

### Backend (Robcast-API)

```
✅ src/middleware/authAdmin.js           - Autenticación para administradores
✅ src/middleware/validators.js          - Validación de datos
✅ src/middleware/fileUpload.js          - Gestión de subida de imágenes
✅ src/routes/admin.js                   - Rutas administrativas (NUEVA)
✅ database/migrations/add_nueva_funcionalidad.sql  - Migraciones SQL
```

### Frontend Panel Admin (Robcast-panel)

```
✅ src/components/LoginPanel.jsx        - Login para administradores
✅ src/components/Dashboard.jsx         - Dashboard con estadísticas
```

---

## 🔧 PASOS DE INSTALACIÓN EN SERVIDOR

### PASO 1: Actualizar package.json de Robcast-API

Agregar las nuevas dependencias necesarias:

```bash
cd /opt/robcast/Robcast-API

npm install express-validator multer --save
```

### PASO 2: Crear Directorios

```bash
# Crear carpeta de uploads
mkdir -p /opt/robcast/Robcast-API/uploads/productos
chmod 755 /opt/robcast/Robcast-API/uploads/productos

# Crear carpeta de migraciones si no existe
mkdir -p /opt/robcast/Robcast-API/database/migrations
```

### PASO 3: Ejecutar Migraciones en MySQL

```bash
# Conectar a MySQL
mysql -u robcast_user -p robcast_db

# Ejecutar el archivo de migraciones
mysql -u robcast_user -p robcast_db < /opt/robcast/Robcast-API/database/migrations/add_nueva_funcionalidad.sql
```

**⚠️ IMPORTANTE:** Antes de ejecutar las migraciones:
1. **BACKUP de la BD**: `mysqldump -u robcast_user -p robcast_db > backup.sql`
2. Reemplazar el hash de contraseña del admin en la línea:
   ```sql
   INSERT INTO usuarios ... WHERE VALUES (..., '$2b$10$...HASH...');
   ```

Para generar un hash bcrypt de `admin123`:
```bash
node -e "console.log(require('bcrypt').hashSync('admin123', 10))"
```

### PASO 4: Copiar Archivos Nuevos al Servidor

```bash
# Copiar archivos middleware
cp authAdmin.js /opt/robcast/Robcast-API/src/middleware/
cp validators.js /opt/robcast/Robcast-API/src/middleware/
cp fileUpload.js /opt/robcast/Robcast-API/src/middleware/

# Copiar ruta admin
cp admin.js /opt/robcast/Robcast-API/src/routes/

# Copiar componentes del panel
cp LoginPanel.jsx /opt/robcast/Robcast-panel/src/components/
cp Dashboard.jsx /opt/robcast/Robcast-panel/src/components/
```

### PASO 5: Actualizar server.js

Reemplazar el contenido de `/opt/robcast/Robcast-API/src/server.js` con la versión mejorada (ya se proporciona).

### PASO 6: Instalar express-validator en Panel si es necesario

```bash
cd /opt/robcast/Robcast-panel
npm install
```

### PASO 7: Reiniciar Servicios

```bash
# En el directorio raíz de Robcast-API
docker-compose down
docker-compose up -d

# Esperar a que inicie
sleep 10
docker-compose ps

# Verificar logs
docker-compose logs api
```

---

## 🧪 PRUEBAS INMEDIATAS

### 1. Verificar que la API inició correctamente

```bash
curl http://localhost:3001/health
```

Respuesta esperada:
```json
{
  "status": "API Robcast funcionando ✅",
  "timestamp": "2026-02-17T..."
}
```

### 2. Probar login con credenciales de admin

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@robcast.com.do","password":"admin123"}'
```

Respuesta esperada:
```json
{
  "token": "eyJhbGc...",
  "usuario_id": 1,
  "nombre": "Administrador",
  "rol": "admin"
}
```

### 3. Probar endpoint protegido con el token

```bash
# Reemplazar XXXX con el token anterior
curl http://localhost:3001/admin/reportes/resumen \
  -H "Authorization: Bearer XXXX"
```

### 4. Probar subida de imagen

```bash
curl -X POST http://localhost:3001/admin/productos \
  -H "Authorization: Bearer XXXX" \
  -F "nombre=Producto Test" \
  -F "precio=99.99" \
  -F "stock=10" \
  -F "categoria=electrónica" \
  -F "imagen=@/ruta/a/imagen.jpg"
```

---

## 🎨 Actualizar Frontend Panel

### Actualizar `Robcast-panel/src/main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import { LoginPanel } from './components/LoginPanel'
import { Dashboard } from './components/Dashboard'
import './index.css'

// Proteger ruta de admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token')
  return token ? children : <Navigate to="/login" replace />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPanel />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
```

### Actualizar `.env` del panel

```ini
VITE_API_URL=http://localhost:3001
VITE_BACKEND_URL=http://localhost:3001
NODE_ENV=development
```

---

## 📊 NUEVAS FUNCIONALIDADES DISPONIBLES

### Endpoints Administrativos (requieren autenticación)

#### PRODUCTOS
```
GET    /admin/productos                    - Listar productos con paginación
GET    /admin/productos/:id                - Obtener un producto
POST   /admin/productos                    - Crear producto (con imagen)
PUT    /admin/productos/:id                - Actualizar producto
DELETE /admin/productos/:id                - Eliminar producto (soft delete)
```

#### VENTAS
```
GET    /admin/ventas                       - Listar todas las ventas
GET    /admin/ventas/:id                   - Detalle de una venta
PUT    /admin/ventas/:id                   - Actualizar estado de venta
```

#### REPORTES
```
GET    /admin/reportes/resumen             - KPIs del dashboard
GET    /admin/reportes/ventas-por-periodo  - Gráfico de ventas
```

#### CLIENTES
```
GET    /admin/clientes                     - Listar clientes
```

#### CUPONES
```
POST   /admin/cupones                      - Crear cupón de descuento
```

---

## 🔐 SEGURIDAD IMPLEMENTADA

✅ **Autenticación JWT**
- Token requerido en header `Authorization: Bearer token`
- Verificación de rol = 'admin'
- Expiración de token (editable en JWT_SECRET)

✅ **Validación de Entrada**
- Todos los campos validados con express-validator
- Mensajes de error específicos
- Prevención de SQL injection

✅ **Gestión de Archivos**
- Solo imágenes permitidas (JPEG, PNG, WebP, GIF)
- Límite de 5MB por archivo
- Nombres únicos para evitar conflictos

✅ **CORS Mejorado**
- Solo orígenes permitidos
- Métodos HTTP restringidos
- Credenciales validadas

✅ **Auditoría**
- Tabla de auditoría registra todos los cambios
- Incluye usuario, acción, cambios y timestamp
- Útil para compliance y debugging

---

## ⚠️ PENDIENTES IMPORTANTES

### Fase 1 (CRÍTICA - Esta semana)
- [ ] Ejecutar migraciones en BD
- [ ] Copiar archivos nuevos al servidor
- [ ] Testear autenticación admin
- [ ] Configurar hash bcrypt correcto para admin

### Fase 2 (IMPORTANTE - Próxima semana)
- [ ] Implementar facturación
- [ ] Implementar seguimiento de envíos
- [ ] Agregar sistema de cupones/descuentos
- [ ] Crear reportes avanzados

### Fase 3 (MEDIA)
- [ ] Optimizar índices de BD
- [ ] Implementar caché (Redis)
- [ ] Tests unitarios
- [ ] Documentación API (Swagger)

### Fase 4 (PRODUCCIÓN)
- [ ] Configurar HTTPS/SSL
- [ ] Rate limiting
- [ ] Monitoreo y alertas
- [ ] Backup automático

---

## 📞 SOPORTE

**Si algo no funciona:**

1. Revisar logs: `docker-compose logs api`
2. Verificar BD: `mysql> SELECT * FROM auditorias;`
3. Verificar migraciones: `DESCRIBE usuarios;` (debe tener columna `rol`)
4. Limpiar cache: `rm -rf node_modules && npm install`

---

## ✅ PRÓXIMO PASO

Una vez completados estos pasos:

1. **Git Push**: 
```bash
git add .
git commit -m "feat: Implementar autenticación admin, validaciones y migraciones"
git push origin main
```

2. **Pull en Servidor**:
```bash
cd /opt/robcast
git pull origin main
docker-compose up -d --build
```

3. **Acceder a Panel de Admin**:
```
Dirección: http://192.168.0.19:5174
Login: admin@robcast.com.do / admin123
```

**¡Tu sistema Robcast está casi listo para producción!** 🚀
